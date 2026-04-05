/**
 * ═══════════════════════════════════════════════════════════════════════
 * TECHNICAL INDICATORS & SMART MONEY CONCEPTS ENGINE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Professional-grade indicators used by institutional crypto traders:
 *
 * Tier 1 (Classic):  RSI, MACD, EMA, Volume Analysis
 * Tier 2 (SMC):      Fair Value Gap, Liquidity Sweeps, Order Flow
 *
 * Combined with Stella Z Quantum Engine for next-level signal generation.
 */

// ─── EMA (Exponential Moving Average) ────────────────────────────────

/**
 * Calculate EMA for a given period.
 * EMA gives more weight to recent prices.
 */
function calcEMA(prices, period) {
  if (prices.length < period) return [];
  const k = 2 / (period + 1);
  const ema = [];

  // Start with SMA for the first value
  let sum = 0;
  for (let i = 0; i < period; i++) sum += prices[i];
  ema.push(sum / period);

  for (let i = period; i < prices.length; i++) {
    ema.push(prices[i] * k + ema[ema.length - 1] * (1 - k));
  }
  return ema;
}

/**
 * Get multiple EMAs: 9, 21, 50, 200
 */
function calcAllEMAs(prices) {
  return {
    ema9: calcEMA(prices, 9),
    ema21: calcEMA(prices, 21),
    ema50: calcEMA(prices, 50),
    ema200: calcEMA(prices, 200),
  };
}

/**
 * EMA Signal Analysis
 */
function emaSignal(prices) {
  const emas = calcAllEMAs(prices);
  const current = prices[prices.length - 1];
  const signals = [];
  let score = 0;

  // Price vs EMA 200 (major trend)
  if (emas.ema200.length > 0) {
    const e200 = emas.ema200[emas.ema200.length - 1];
    if (current > e200) {
      signals.push({ type: "BULLISH", msg: "Price above EMA 200 — Uptrend" });
      score += 2;
    } else {
      signals.push({ type: "BEARISH", msg: "Price below EMA 200 — Downtrend" });
      score -= 2;
    }
  }

  // Golden Cross / Death Cross (EMA 50 vs EMA 200)
  if (emas.ema50.length > 1 && emas.ema200.length > 1) {
    const e50 = emas.ema50[emas.ema50.length - 1];
    const e50prev = emas.ema50[emas.ema50.length - 2];
    const e200 = emas.ema200[emas.ema200.length - 1];
    const e200prev = emas.ema200[emas.ema200.length - 2];

    if (e50prev < e200prev && e50 > e200) {
      signals.push({ type: "BULLISH", msg: "Golden Cross — Strong BUY" });
      score += 3;
    } else if (e50prev > e200prev && e50 < e200) {
      signals.push({ type: "BEARISH", msg: "Death Cross — Strong SELL" });
      score -= 3;
    }
  }

  // Short-term trend (EMA 9 vs EMA 21)
  if (emas.ema9.length > 0 && emas.ema21.length > 0) {
    const e9 = emas.ema9[emas.ema9.length - 1];
    const e21 = emas.ema21[emas.ema21.length - 1];
    if (e9 > e21) {
      signals.push({ type: "BULLISH", msg: "EMA 9 > 21 — Short-term bullish" });
      score += 1;
    } else {
      signals.push({ type: "BEARISH", msg: "EMA 9 < 21 — Short-term bearish" });
      score -= 1;
    }
  }

  return { emas, signals, score };
}

// ─── RSI (Relative Strength Index) ──────────────────────────────────

/**
 * Calculate RSI with given period (default 14)
 */
function calcRSI(prices, period = 14) {
  if (prices.length < period + 1) return [];

  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  // First average gain/loss
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) avgGain += changes[i];
    else avgLoss += Math.abs(changes[i]);
  }
  avgGain /= period;
  avgLoss /= period;

  const rsi = [];
  if (avgLoss === 0) rsi.push(100);
  else rsi.push(100 - 100 / (1 + avgGain / avgLoss));

  // Smoothed RSI
  for (let i = period; i < changes.length; i++) {
    const gain = changes[i] > 0 ? changes[i] : 0;
    const loss = changes[i] < 0 ? Math.abs(changes[i]) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    if (avgLoss === 0) rsi.push(100);
    else rsi.push(100 - 100 / (1 + avgGain / avgLoss));
  }

  return rsi;
}

/**
 * RSI Signal Analysis
 */
function rsiSignal(prices) {
  const rsi = calcRSI(prices);
  if (rsi.length === 0) return { rsi: [], current: null, signals: [], score: 0 };

  const current = rsi[rsi.length - 1];
  const signals = [];
  let score = 0;

  if (current > 80) {
    signals.push({ type: "BEARISH", msg: `RSI ${current.toFixed(1)} — Extreme Overbought, SELL` });
    score -= 3;
  } else if (current > 70) {
    signals.push({ type: "BEARISH", msg: `RSI ${current.toFixed(1)} — Overbought, consider SELL` });
    score -= 2;
  } else if (current < 20) {
    signals.push({ type: "BULLISH", msg: `RSI ${current.toFixed(1)} — Extreme Oversold, BUY` });
    score += 3;
  } else if (current < 30) {
    signals.push({ type: "BULLISH", msg: `RSI ${current.toFixed(1)} — Oversold, consider BUY` });
    score += 2;
  } else if (current >= 45 && current <= 55) {
    signals.push({ type: "NEUTRAL", msg: `RSI ${current.toFixed(1)} — Neutral zone` });
  } else if (current > 55) {
    signals.push({ type: "BULLISH", msg: `RSI ${current.toFixed(1)} — Bullish momentum` });
    score += 1;
  } else {
    signals.push({ type: "BEARISH", msg: `RSI ${current.toFixed(1)} — Bearish momentum` });
    score -= 1;
  }

  // RSI divergence detection (simplified)
  if (rsi.length >= 5) {
    const prevRSI = rsi[rsi.length - 5];
    const prevPrice = prices[prices.length - 5];
    const currPrice = prices[prices.length - 1];

    // Bullish divergence: price lower but RSI higher
    if (currPrice < prevPrice && current > prevRSI) {
      signals.push({ type: "BULLISH", msg: "RSI Bullish Divergence detected" });
      score += 2;
    }
    // Bearish divergence: price higher but RSI lower
    if (currPrice > prevPrice && current < prevRSI) {
      signals.push({ type: "BEARISH", msg: "RSI Bearish Divergence detected" });
      score -= 2;
    }
  }

  return { rsi, current, signals, score };
}

// ─── MACD (Moving Average Convergence Divergence) ───────────────────

/**
 * Calculate MACD: MACD line, Signal line, Histogram
 */
function calcMACD(prices, fast = 12, slow = 26, signal = 9) {
  const emaFast = calcEMA(prices, fast);
  const emaSlow = calcEMA(prices, slow);

  if (emaSlow.length === 0) return { macd: [], signal: [], histogram: [] };

  // Align arrays (emaSlow is shorter)
  const offset = emaFast.length - emaSlow.length;
  const macdLine = [];
  for (let i = 0; i < emaSlow.length; i++) {
    macdLine.push(emaFast[i + offset] - emaSlow[i]);
  }

  const signalLine = calcEMA(macdLine, signal);
  const histOffset = macdLine.length - signalLine.length;
  const histogram = [];
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + histOffset] - signalLine[i]);
  }

  return { macd: macdLine, signal: signalLine, histogram };
}

/**
 * MACD Signal Analysis
 */
function macdSignal(prices) {
  const { macd, signal, histogram } = calcMACD(prices);
  if (histogram.length < 2) return { macd, signal, histogram, signals: [], score: 0 };

  const signals = [];
  let score = 0;
  const currHist = histogram[histogram.length - 1];
  const prevHist = histogram[histogram.length - 2];

  // MACD Cross
  if (prevHist < 0 && currHist > 0) {
    signals.push({ type: "BULLISH", msg: "MACD Bullish Cross — BUY signal" });
    score += 3;
  } else if (prevHist > 0 && currHist < 0) {
    signals.push({ type: "BEARISH", msg: "MACD Bearish Cross — SELL signal" });
    score -= 3;
  }

  // Histogram direction
  if (currHist > prevHist && currHist > 0) {
    signals.push({ type: "BULLISH", msg: "MACD Histogram expanding — Bullish acceleration" });
    score += 1;
  } else if (currHist < prevHist && currHist < 0) {
    signals.push({ type: "BEARISH", msg: "MACD Histogram expanding — Bearish acceleration" });
    score -= 1;
  }

  // MACD above/below zero
  const currMACD = macd[macd.length - 1];
  if (currMACD > 0) {
    signals.push({ type: "BULLISH", msg: "MACD above zero line" });
    score += 1;
  } else {
    signals.push({ type: "BEARISH", msg: "MACD below zero line" });
    score -= 1;
  }

  return { macd, signal, histogram, signals, score, currentHist: currHist };
}

// ─── Volume Analysis ────────────────────────────────────────────────

/**
 * Analyze volume patterns
 */
function volumeSignal(prices) {
  if (prices.length < 10) return { signals: [], score: 0, avgVolChange: 0 };

  // Approximate volume from price volatility (since we don't have actual volume)
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(Math.abs(prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const recentVol = changes.slice(-5).reduce((s, v) => s + v, 0) / 5;
  const pastVol = changes.slice(-20, -5).reduce((s, v) => s + v, 0) / Math.min(15, changes.slice(-20, -5).length || 1);

  const signals = [];
  let score = 0;
  const ratio = pastVol > 0 ? recentVol / pastVol : 1;

  if (ratio > 1.5) {
    const lastChange = prices[prices.length - 1] - prices[prices.length - 2];
    if (lastChange > 0) {
      signals.push({ type: "BULLISH", msg: `Volume spike ${ratio.toFixed(1)}x — Bullish momentum confirmed` });
      score += 2;
    } else {
      signals.push({ type: "BEARISH", msg: `Volume spike ${ratio.toFixed(1)}x — Bearish momentum confirmed` });
      score -= 2;
    }
  } else if (ratio < 0.5) {
    signals.push({ type: "NEUTRAL", msg: "Low volume — Weak move, possible reversal" });
  }

  return { signals, score, volumeRatio: ratio };
}

// ═══════════════════════════════════════════════════════════════════════
// SMART MONEY CONCEPTS (SMC)
// ═══════════════════════════════════════════════════════════════════════

// ─── Fair Value Gap (FVG) ───────────────────────────────────────────

/**
 * Detect Fair Value Gaps in price data.
 *
 * FVG occurs when candle 1 high < candle 3 low (bullish FVG)
 * or candle 1 low > candle 3 high (bearish FVG)
 *
 * Since we have price array (not OHLC), we simulate using
 * consecutive price movements as proxy candles.
 */
function detectFVG(prices) {
  if (prices.length < 20) return { gaps: [], signals: [], score: 0 };

  const gaps = [];
  // Create synthetic candles from price data (groups of ~3 data points)
  const candles = [];
  const step = Math.max(1, Math.floor(prices.length / 60));

  for (let i = 0; i < prices.length - step; i += step) {
    const slice = prices.slice(i, i + step + 1);
    candles.push({
      open: slice[0],
      close: slice[slice.length - 1],
      high: Math.max(...slice),
      low: Math.min(...slice),
      index: i,
    });
  }

  // Detect FVGs
  for (let i = 2; i < candles.length; i++) {
    const c1 = candles[i - 2];
    const c3 = candles[i];

    // Bullish FVG: candle 1 high < candle 3 low (gap up)
    if (c1.high < c3.low) {
      gaps.push({
        type: "BULLISH",
        top: c3.low,
        bottom: c1.high,
        size: c3.low - c1.high,
        index: i,
        filled: false,
      });
    }

    // Bearish FVG: candle 1 low > candle 3 high (gap down)
    if (c1.low > c3.high) {
      gaps.push({
        type: "BEARISH",
        top: c1.low,
        bottom: c3.high,
        size: c1.low - c3.high,
        index: i,
        filled: false,
      });
    }
  }

  // Check if recent gaps are filled
  const currentPrice = prices[prices.length - 1];
  for (const gap of gaps) {
    if (gap.type === "BULLISH" && currentPrice <= gap.top && currentPrice >= gap.bottom) {
      gap.filled = true;
    }
    if (gap.type === "BEARISH" && currentPrice >= gap.bottom && currentPrice <= gap.top) {
      gap.filled = true;
    }
  }

  // Generate signals from unfilled gaps near current price
  const signals = [];
  let score = 0;
  const priceRange = currentPrice * 0.05; // 5% range

  const recentUnfilled = gaps.filter(
    (g) => !g.filled && Math.abs(currentPrice - (g.top + g.bottom) / 2) < priceRange
  );

  const bullishGaps = recentUnfilled.filter((g) => g.type === "BULLISH");
  const bearishGaps = recentUnfilled.filter((g) => g.type === "BEARISH");

  if (bullishGaps.length > 0 && currentPrice > bullishGaps[bullishGaps.length - 1].top) {
    signals.push({
      type: "BULLISH",
      msg: `${bullishGaps.length} Bullish FVG below — Support zone`,
    });
    score += 2;
  }

  if (bearishGaps.length > 0 && currentPrice < bearishGaps[bearishGaps.length - 1].bottom) {
    signals.push({
      type: "BEARISH",
      msg: `${bearishGaps.length} Bearish FVG above — Resistance zone`,
    });
    score -= 2;
  }

  // Price approaching unfilled FVG = potential reversal zone
  for (const gap of recentUnfilled.slice(-3)) {
    const mid = (gap.top + gap.bottom) / 2;
    const dist = ((currentPrice - mid) / currentPrice) * 100;

    if (Math.abs(dist) < 1) {
      if (gap.type === "BULLISH") {
        signals.push({ type: "BULLISH", msg: `Price at Bullish FVG — Expect bounce UP` });
        score += 3;
      } else {
        signals.push({ type: "BEARISH", msg: `Price at Bearish FVG — Expect rejection DOWN` });
        score -= 3;
      }
    }
  }

  if (gaps.length > 0 && signals.length === 0) {
    signals.push({
      type: "NEUTRAL",
      msg: `${gaps.length} FVGs detected, none near current price`,
    });
  }

  return { gaps, signals, score, totalGaps: gaps.length };
}

// ─── Liquidity Sweeps ───────────────────────────────────────────────

/**
 * Detect Liquidity Sweeps — price breaking key levels then reversing.
 *
 * Looks for:
 * 1. Previous swing highs/lows (where stop losses accumulate)
 * 2. Price briefly breaks these levels
 * 3. Then reverses — indicating a liquidity grab
 */
function detectLiquiditySweeps(prices) {
  if (prices.length < 20) return { sweeps: [], signals: [], score: 0 };

  // Find swing highs and lows
  const swingHighs = [];
  const swingLows = [];
  const lookback = Math.max(3, Math.floor(prices.length / 20));

  for (let i = lookback; i < prices.length - lookback; i++) {
    let isHigh = true;
    let isLow = true;
    for (let j = 1; j <= lookback; j++) {
      if (prices[i] <= prices[i - j] || prices[i] <= prices[i + j]) isHigh = false;
      if (prices[i] >= prices[i - j] || prices[i] >= prices[i + j]) isLow = false;
    }
    if (isHigh) swingHighs.push({ price: prices[i], index: i });
    if (isLow) swingLows.push({ price: prices[i], index: i });
  }

  const sweeps = [];
  const currentPrice = prices[prices.length - 1];
  const recentPrices = prices.slice(-Math.max(5, Math.floor(prices.length / 10)));

  // Check for high sweeps (price went above swing high then came back)
  for (const sh of swingHighs.slice(-5)) {
    const maxRecent = Math.max(...recentPrices);
    if (maxRecent > sh.price && currentPrice < sh.price) {
      sweeps.push({
        type: "BEARISH_SWEEP",
        level: sh.price,
        msg: `Swept high $${sh.price.toFixed(2)} — Sellers grabbed liquidity`,
      });
    }
  }

  // Check for low sweeps (price went below swing low then came back)
  for (const sl of swingLows.slice(-5)) {
    const minRecent = Math.min(...recentPrices);
    if (minRecent < sl.price && currentPrice > sl.price) {
      sweeps.push({
        type: "BULLISH_SWEEP",
        level: sl.price,
        msg: `Swept low $${sl.price.toFixed(2)} — Buyers grabbed liquidity`,
      });
    }
  }

  const signals = [];
  let score = 0;

  const bullishSweeps = sweeps.filter((s) => s.type === "BULLISH_SWEEP");
  const bearishSweeps = sweeps.filter((s) => s.type === "BEARISH_SWEEP");

  if (bullishSweeps.length > 0) {
    signals.push({
      type: "BULLISH",
      msg: `${bullishSweeps.length} Liquidity Sweep(s) below — Smart money buying`,
    });
    score += bullishSweeps.length * 2;
  }

  if (bearishSweeps.length > 0) {
    signals.push({
      type: "BEARISH",
      msg: `${bearishSweeps.length} Liquidity Sweep(s) above — Smart money selling`,
    });
    score -= bearishSweeps.length * 2;
  }

  if (sweeps.length === 0) {
    signals.push({ type: "NEUTRAL", msg: "No recent liquidity sweeps detected" });
  }

  return {
    sweeps,
    signals,
    score,
    swingHighs: swingHighs.slice(-5),
    swingLows: swingLows.slice(-5),
  };
}

// ─── Order Flow Analysis ────────────────────────────────────────────

/**
 * Simulated Order Flow Analysis from price action.
 *
 * Since we don't have real order book data, we derive order flow
 * signals from:
 * - Price momentum and acceleration
 * - Volume-price relationship
 * - Buying/selling pressure estimation
 */
function analyzeOrderFlow(prices) {
  if (prices.length < 15) return { signals: [], score: 0, buyPressure: 50, sellPressure: 50 };

  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  // Buying pressure: count and magnitude of up moves
  const recentChanges = changes.slice(-10);
  let buyVolume = 0;
  let sellVolume = 0;
  let buyCount = 0;
  let sellCount = 0;

  for (const c of recentChanges) {
    if (c > 0) {
      buyVolume += c;
      buyCount++;
    } else {
      sellVolume += Math.abs(c);
      sellCount++;
    }
  }

  const totalVolume = buyVolume + sellVolume || 1;
  const buyPressure = (buyVolume / totalVolume) * 100;
  const sellPressure = (sellVolume / totalVolume) * 100;

  // Momentum acceleration
  const recentMomentum = changes.slice(-3).reduce((s, c) => s + c, 0);
  const prevMomentum = changes.slice(-6, -3).reduce((s, c) => s + c, 0);
  const acceleration = recentMomentum - prevMomentum;

  // Absorption detection (large moves followed by small moves)
  const lastBigMove = Math.max(...recentChanges.map(Math.abs));
  const lastSmallMoves = recentChanges.slice(-3).map(Math.abs);
  const avgSmall = lastSmallMoves.reduce((s, v) => s + v, 0) / 3;
  const absorbed = lastBigMove > 0 && avgSmall < lastBigMove * 0.3;

  const signals = [];
  let score = 0;

  // Buy/Sell pressure
  if (buyPressure > 65) {
    signals.push({
      type: "BULLISH",
      msg: `Buy pressure ${buyPressure.toFixed(0)}% — Aggressive buyers in control`,
    });
    score += 2;
  } else if (sellPressure > 65) {
    signals.push({
      type: "BEARISH",
      msg: `Sell pressure ${sellPressure.toFixed(0)}% — Aggressive sellers in control`,
    });
    score -= 2;
  } else {
    signals.push({
      type: "NEUTRAL",
      msg: `Buy ${buyPressure.toFixed(0)}% / Sell ${sellPressure.toFixed(0)}% — Balanced`,
    });
  }

  // Momentum acceleration
  if (acceleration > 0 && recentMomentum > 0) {
    signals.push({ type: "BULLISH", msg: "Momentum accelerating UP — Buyers pushing" });
    score += 2;
  } else if (acceleration < 0 && recentMomentum < 0) {
    signals.push({ type: "BEARISH", msg: "Momentum accelerating DOWN — Sellers pushing" });
    score -= 2;
  }

  // Absorption
  if (absorbed) {
    const lastDir = recentChanges[recentChanges.length - 1] > 0 ? "BULLISH" : "BEARISH";
    if (lastDir === "BEARISH") {
      signals.push({ type: "BULLISH", msg: "Selling absorbed — Buyers defending level" });
      score += 1;
    } else {
      signals.push({ type: "BEARISH", msg: "Buying absorbed — Sellers defending level" });
      score -= 1;
    }
  }

  // Consecutive direction
  if (buyCount >= 7) {
    signals.push({ type: "BULLISH", msg: `${buyCount}/10 periods buying — Strong demand` });
    score += 1;
  } else if (sellCount >= 7) {
    signals.push({ type: "BEARISH", msg: `${sellCount}/10 periods selling — Strong supply` });
    score -= 1;
  }

  return { signals, score, buyPressure, sellPressure, acceleration };
}

// ═══════════════════════════════════════════════════════════════════════
// MASTER SIGNAL COMBINER
// ═══════════════════════════════════════════════════════════════════════

/**
 * Combine all indicators + SMC + Quantum into one master signal.
 *
 * Weights:
 * - Quantum Engine:     25%
 * - RSI:                15%
 * - MACD:               15%
 * - EMA:                10%
 * - Volume:             5%
 * - FVG:                10%
 * - Liquidity Sweeps:   10%
 * - Order Flow:         10%
 */
function masterSignal(prices, quantumResult) {
  const rsi = rsiSignal(prices);
  const macd = macdSignal(prices);
  const ema = emaSignal(prices);
  const vol = volumeSignal(prices);
  const fvg = detectFVG(prices);
  const liq = detectLiquiditySweeps(prices);
  const flow = analyzeOrderFlow(prices);

  // Normalize scores to -10..+10 range
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const normalize = (score, maxScore) => clamp(score / maxScore, -1, 1);

  // Quantum score from direction
  let quantumScore = 0;
  if (quantumResult) {
    if (quantumResult.direction === "BULLISH") quantumScore = quantumResult.strength;
    else if (quantumResult.direction === "BEARISH") quantumScore = -quantumResult.strength;
  }

  const weights = {
    quantum: 0.25,
    rsi: 0.15,
    macd: 0.15,
    ema: 0.10,
    volume: 0.05,
    fvg: 0.10,
    liquidity: 0.10,
    orderFlow: 0.10,
  };

  const weightedScore =
    quantumScore * weights.quantum +
    normalize(rsi.score, 5) * weights.rsi +
    normalize(macd.score, 5) * weights.macd +
    normalize(ema.score, 6) * weights.ema +
    normalize(vol.score, 3) * weights.volume +
    normalize(fvg.score, 5) * weights.fvg +
    normalize(liq.score, 4) * weights.liquidity +
    normalize(flow.score, 5) * weights.orderFlow;

  // Count bullish vs bearish signals
  const allSignals = [
    ...rsi.signals,
    ...macd.signals,
    ...ema.signals,
    ...vol.signals,
    ...fvg.signals,
    ...liq.signals,
    ...flow.signals,
  ];

  const bullishCount = allSignals.filter((s) => s.type === "BULLISH").length;
  const bearishCount = allSignals.filter((s) => s.type === "BEARISH").length;
  const totalSignals = bullishCount + bearishCount || 1;

  let direction, action;
  const absScore = Math.abs(weightedScore);

  if (weightedScore > 0.1) {
    direction = "BULLISH";
    action = absScore > 0.4 ? "STRONG LONG" : "LONG";
  } else if (weightedScore < -0.1) {
    direction = "BEARISH";
    action = absScore > 0.4 ? "STRONG SHORT" : "SHORT";
  } else {
    direction = "NEUTRAL";
    action = "WAIT";
  }

  const confidence = Math.min(100, (absScore / 0.6) * 100);
  const agreement = Math.max(bullishCount, bearishCount) / totalSignals * 100;

  return {
    direction,
    action,
    score: weightedScore,
    confidence,
    agreement,
    bullishCount,
    bearishCount,
    indicators: {
      rsi,
      macd,
      ema,
      volume: vol,
      fvg,
      liquidity: liq,
      orderFlow: flow,
    },
    allSignals,
  };
}

export {
  // Technical indicators
  calcEMA,
  calcAllEMAs,
  emaSignal,
  calcRSI,
  rsiSignal,
  calcMACD,
  macdSignal,
  volumeSignal,
  // Smart Money Concepts
  detectFVG,
  detectLiquiditySweeps,
  analyzeOrderFlow,
  // Master
  masterSignal,
};
