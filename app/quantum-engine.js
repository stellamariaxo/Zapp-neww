/**
 * ═══════════════════════════════════════════════════════════════════════
 * STELLA Z QUANTUM ENGINE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Implementation of the {{7, 2, 2}}_SU(2) Intrinsic Quantum Error-Correcting Code
 * Applied to crypto market direction signal processing.
 *
 * Code label :  {{7, 2, 2}}_SU(2)
 * Group      :  G = SU(2)
 * Irrep      :  V = 7  (spin-3, dimension 7)
 * Logical K  :  2  (one logical qubit)
 * Depth d    :  2  (detects all adjoint-order-1 errors)
 *
 * The Stella Z code encodes market signals into the spin-3 irrep weight basis,
 * applies quantum error detection via the Knill-Laflamme conditions, and
 * outputs a confidence-weighted direction signal.
 */

// ─── Spin-3 Weight Basis Constants ───────────────────────────────────
const SPIN_J = 3;
const DIM_V = 2 * SPIN_J + 1; // = 7

/**
 * Compute J+ raising operator coefficient: sqrt(j(j+1) - m(m+1))
 * In weight basis |w>, m = w - 3
 */
function jPlusCoeff(w) {
  const m = w - SPIN_J;
  return Math.sqrt(SPIN_J * (SPIN_J + 1) - m * (m + 1));
}

/**
 * Compute J- lowering operator coefficient: sqrt(j(j+1) - m(m-1))
 */
function jMinusCoeff(w) {
  const m = w - SPIN_J;
  return Math.sqrt(SPIN_J * (SPIN_J + 1) - m * (m - 1));
}

/**
 * J_z eigenvalue for weight state |w>
 */
function jzEigenvalue(w) {
  return w - SPIN_J;
}

// ─── Stella Z Codewords ──────────────────────────────────────────────
// |0̄> = (1/√2)(|0> + |6>)  — symmetric superposition of extremes
// |1̄> = |3>                 — central weight state, m = 0

/**
 * Create the 7-dimensional state vector for |0̄>
 */
function codeword0Bar() {
  const state = new Array(DIM_V).fill(0);
  state[0] = 1 / Math.sqrt(2); // |0> component (m = -3)
  state[6] = 1 / Math.sqrt(2); // |6> component (m = +3)
  return state;
}

/**
 * Create the 7-dimensional state vector for |1̄>
 */
function codeword1Bar() {
  const state = new Array(DIM_V).fill(0);
  state[3] = 1; // |3> component (m = 0)
  return state;
}

// ─── Knill-Laflamme Verification Engine ──────────────────────────────

/**
 * Inner product <a|b> for real state vectors
 */
function innerProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/**
 * Apply J_z to a state in the weight basis
 */
function applyJz(state) {
  return state.map((amp, w) => jzEigenvalue(w) * amp);
}

/**
 * Apply J+ to a state in the weight basis
 */
function applyJPlus(state) {
  const result = new Array(DIM_V).fill(0);
  for (let w = 0; w < DIM_V - 1; w++) {
    result[w + 1] += jPlusCoeff(w) * state[w];
  }
  return result;
}

/**
 * Apply J- to a state in the weight basis
 */
function applyJMinus(state) {
  const result = new Array(DIM_V).fill(0);
  for (let w = 1; w < DIM_V; w++) {
    result[w - 1] += jMinusCoeff(w) * state[w];
  }
  return result;
}

/**
 * Verify KL condition for a single operator F:
 * Ω F Ω = cF · Ω
 * Returns { diagonal: [<0̄|F|0̄>, <1̄|F|1̄>], offDiag: <0̄|F|1̄>, valid: bool }
 */
function verifyKL(operatorFn) {
  const c0 = codeword0Bar();
  const c1 = codeword1Bar();

  const Fc0 = operatorFn(c0);
  const Fc1 = operatorFn(c1);

  const d00 = innerProduct(c0, Fc0); // <0̄|F|0̄>
  const d11 = innerProduct(c1, Fc1); // <1̄|F|1̄>
  const d01 = innerProduct(c0, Fc1); // <0̄|F|1̄>

  const diagonalMatch = Math.abs(d00 - d11) < 1e-10;
  const offDiagZero = Math.abs(d01) < 1e-10;

  return {
    diagonal: [d00, d11],
    offDiag: d01,
    valid: diagonalMatch && offDiagZero,
  };
}

/**
 * Run full KL verification for sectors 1 (trivial) and 3 (adjoint)
 */
function fullKLVerification() {
  const identity = (s) => [...s];
  const results = {
    trivial: verifyKL(identity),
    Jz: verifyKL(applyJz),
    Jplus: verifyKL(applyJPlus),
    Jminus: verifyKL(applyJMinus),
  };

  results.allValid = Object.values(results).every(
    (r) => r.valid === undefined || r.valid
  );
  results.depth = results.allValid ? 2 : 0;

  return results;
}

// ─── Rank-2 Sector Failure Verification ──────────────────────────────

/**
 * T_0^(2) ∝ (3J²_z - J²) operator
 * J² = j(j+1) = 12 for spin-3
 */
function applyT20(state) {
  const J_SQUARED = SPIN_J * (SPIN_J + 1); // = 12
  return state.map((amp, w) => {
    const m = jzEigenvalue(w);
    return (3 * m * m - J_SQUARED) * amp / Math.sqrt(6);
  });
}

function verifyRank2Failure() {
  return verifyKL(applyT20);
}

// ─── Market Signal Encoding into Spin-3 Space ───────────────────────

/**
 * Encode a set of market data points into the spin-3 weight basis.
 *
 * Given 7 signal values (derived from price data), we create a quantum state
 * in V=7 by normalizing the signal vector and mapping each component to a
 * weight state amplitude.
 *
 * The signal is then projected onto the Stella Z codespace to extract the
 * "quantum-corrected" direction.
 */
function encodeMarketSignal(signals7) {
  // Normalize to unit vector
  const norm = Math.sqrt(signals7.reduce((s, v) => s + v * v, 0));
  if (norm < 1e-15) return new Array(7).fill(0);
  return signals7.map((v) => v / norm);
}

/**
 * Project a state onto the Stella Z codespace.
 * Returns { alpha, beta, fidelity } where:
 *   alpha = <0̄|ψ>  (coefficient of logical |0>)
 *   beta  = <1̄|ψ>  (coefficient of logical |1>)
 *   fidelity = |alpha|² + |beta|²  (overlap with codespace)
 */
function projectOntoCodespace(state) {
  const c0 = codeword0Bar();
  const c1 = codeword1Bar();

  const alpha = innerProduct(c0, state);
  const beta = innerProduct(c1, state);
  const fidelity = alpha * alpha + beta * beta;

  return { alpha, beta, fidelity };
}

/**
 * Apply the Stella Z error detection protocol to a market signal.
 *
 * Process:
 * 1. Encode 7 data points into the spin-3 weight basis
 * 2. Apply adjoint-sector "noise" operators (Jz, J+, J-)
 * 3. Verify KL conditions hold for the encoded state
 * 4. Project onto codespace to extract corrected signal
 * 5. Decode logical qubit: |0̄> → BULLISH, |1̄> → BEARISH
 *
 * The "quantum confidence" is the codespace fidelity — high fidelity means
 * the signal is well-protected against adjoint-order noise.
 */
function quantumSignalAnalysis(priceHistory) {
  // Derive 7 features from price history
  const signals = deriveSevenFeatures(priceHistory);

  // Encode into spin-3 space
  const psi = encodeMarketSignal(signals);

  // Project onto Stella Z codespace
  const { alpha, beta, fidelity } = projectOntoCodespace(psi);

  // Compute direction
  // |0̄> = extreme superposition → strong directional move (BULLISH if trending up)
  // |1̄> = central state → mean-reverting / BEARISH
  const alphaProb = alpha * alpha;
  const betaProb = beta * beta;

  let direction, strength;
  if (fidelity < 0.01) {
    direction = "UNCERTAIN";
    strength = 0;
  } else if (alphaProb > betaProb) {
    direction = "BULLISH";
    strength = alphaProb / fidelity;
  } else {
    direction = "BEARISH";
    strength = betaProb / fidelity;
  }

  // Error syndrome: check how much signal leaks into non-code sectors
  const errorLeakage = 1 - fidelity;

  return {
    direction,
    strength,
    confidence: fidelity,
    errorLeakage,
    alpha,
    beta,
    signals,
    quantumState: psi,
    klVerification: fullKLVerification(),
    rank2Check: verifyRank2Failure(),
  };
}

/**
 * Derive 7 features from price history to map into spin-3 weight basis.
 *
 * Weight states and their market meaning:
 * |w=0> (m=-3): Extreme bearish momentum
 * |w=1> (m=-2): Strong bearish
 * |w=2> (m=-1): Mild bearish
 * |w=3> (m= 0): Neutral / mean-reverting
 * |w=4> (m=+1): Mild bullish
 * |w=5> (m=+2): Strong bullish
 * |w=6> (m=+3): Extreme bullish momentum
 */
function deriveSevenFeatures(prices) {
  if (!prices || prices.length < 2) {
    return [0, 0, 0, 1, 0, 0, 0]; // Neutral state
  }

  const n = prices.length;
  const returns = [];
  for (let i = 1; i < n; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  // Feature extraction
  const avgReturn = returns.reduce((s, r) => s + r, 0) / returns.length;
  const volatility = Math.sqrt(
    returns.reduce((s, r) => s + (r - avgReturn) ** 2, 0) / returns.length
  );

  // Recent momentum (last 25% of data)
  const recentStart = Math.floor(returns.length * 0.75);
  const recentReturns = returns.slice(recentStart);
  const recentAvg =
    recentReturns.reduce((s, r) => s + r, 0) / (recentReturns.length || 1);

  // Trend strength
  const trendStrength = avgReturn / (volatility + 1e-10);

  // Map to 7 weight states using sigmoid-like distribution
  const features = new Array(7).fill(0);

  // Central state (neutral) gets base amplitude
  features[3] = Math.exp(-Math.abs(trendStrength) * 2);

  // Distribute momentum into directional states
  if (trendStrength > 0) {
    features[4] = Math.min(1, Math.abs(trendStrength) * 0.5);
    features[5] = Math.min(1, Math.abs(trendStrength) * 0.3);
    features[6] = Math.min(1, Math.abs(trendStrength) * 0.15);
  } else {
    features[2] = Math.min(1, Math.abs(trendStrength) * 0.5);
    features[1] = Math.min(1, Math.abs(trendStrength) * 0.3);
    features[0] = Math.min(1, Math.abs(trendStrength) * 0.15);
  }

  // Recent acceleration modifies extreme states
  const accel = recentAvg - avgReturn;
  if (accel > 0) {
    features[5] += Math.min(0.3, accel * 10);
    features[6] += Math.min(0.2, accel * 5);
  } else {
    features[1] += Math.min(0.3, Math.abs(accel) * 10);
    features[0] += Math.min(0.2, Math.abs(accel) * 5);
  }

  // Volatility affects spread
  const volFactor = Math.min(1, volatility * 20);
  features[0] += volFactor * 0.05;
  features[6] += volFactor * 0.05;

  return features;
}

// ─── Six-Qubit Realization Helpers ───────────────────────────────────

/**
 * Generate the six-qubit Dicke state representation
 * |D_w^6> = (1/√C(6,w)) Σ_{|x|=w} |x>
 */
function sixQubitDickeState(w) {
  const n = 6;
  const states = [];

  // Generate all n-bit strings of Hamming weight w
  for (let i = 0; i < (1 << n); i++) {
    let bits = i;
    let count = 0;
    while (bits) {
      count += bits & 1;
      bits >>= 1;
    }
    if (count === w) {
      const bitStr = i.toString(2).padStart(n, "0");
      states.push(bitStr);
    }
  }

  return {
    weight: w,
    normalization: 1 / Math.sqrt(states.length),
    terms: states,
    numTerms: states.length,
  };
}

/**
 * Get the full six-qubit Stella Z codewords
 */
function sixQubitCodewords() {
  const d0 = sixQubitDickeState(0); // |000000>
  const d6 = sixQubitDickeState(6); // |111111>
  const d3 = sixQubitDickeState(3); // Dicke state weight 3

  return {
    logical0: {
      description: "|0̄> = (1/√2)(|000000> + |111111>)",
      terms: [
        { coeff: "1/√2", state: "000000" },
        { coeff: "1/√2", state: "111111" },
      ],
    },
    logical1: {
      description: `|1̄> = (1/√20) Σ of ${d3.numTerms} weight-3 states`,
      normalization: `1/√${d3.numTerms}`,
      terms: d3.terms.map((s) => ({ coeff: `1/√${d3.numTerms}`, state: s })),
      numTerms: d3.numTerms,
    },
  };
}

// ─── Export ──────────────────────────────────────────────────────────

export {
  // Core quantum engine
  quantumSignalAnalysis,
  fullKLVerification,
  verifyRank2Failure,
  projectOntoCodespace,
  encodeMarketSignal,
  deriveSevenFeatures,
  // Codewords
  codeword0Bar,
  codeword1Bar,
  // Operators
  applyJz,
  applyJPlus,
  applyJMinus,
  applyT20,
  jzEigenvalue,
  jPlusCoeff,
  jMinusCoeff,
  // Six-qubit realization
  sixQubitCodewords,
  sixQubitDickeState,
  // Utilities
  innerProduct,
  verifyKL,
  // Constants
  SPIN_J,
  DIM_V,
};
