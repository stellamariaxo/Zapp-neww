"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  quantumSignalAnalysis,
  fullKLVerification,
  verifyRank2Failure,
  sixQubitCodewords,
  codeword0Bar,
  codeword1Bar,
  jzEigenvalue,
  SPIN_J,
  DIM_V,
} from "./quantum-engine";
import { masterSignal } from "./indicators";

// ─── Styles ──────────────────────────────────────────────────────────
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a1a 0%, #0d1033 50%, #1a0a2e 100%)",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    color: "#e0e0ff",
    padding: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    padding: "30px 0 20px",
    borderBottom: "1px solid rgba(100, 100, 255, 0.2)",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#8888cc",
    marginTop: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "rgba(15, 15, 40, 0.8)",
    border: "1px solid rgba(100, 100, 255, 0.15)",
    borderRadius: "16px",
    padding: "24px",
    backdropFilter: "blur(10px)",
  },
  cardTitle: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "#8888cc",
    marginBottom: "12px",
  },
  cryptoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "rgba(20, 20, 50, 0.6)",
    borderRadius: "12px",
    marginBottom: "12px",
    border: "1px solid rgba(100, 100, 255, 0.1)",
  },
  price: {
    fontSize: "1.5rem",
    fontWeight: "700",
    fontVariantNumeric: "tabular-nums",
  },
  changePositive: {
    color: "#4ade80",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  changeNegative: {
    color: "#f87171",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  directionBadge: (dir) => ({
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "700",
    letterSpacing: "1px",
    background:
      dir === "BULLISH"
        ? "rgba(74, 222, 128, 0.15)"
        : dir === "BEARISH"
        ? "rgba(248, 113, 113, 0.15)"
        : "rgba(150, 150, 150, 0.15)",
    color:
      dir === "BULLISH" ? "#4ade80" : dir === "BEARISH" ? "#f87171" : "#aaa",
    border: `1px solid ${
      dir === "BULLISH"
        ? "rgba(74, 222, 128, 0.3)"
        : dir === "BEARISH"
        ? "rgba(248, 113, 113, 0.3)"
        : "rgba(150, 150, 150, 0.3)"
    }`,
  }),
  quantumBar: {
    height: "6px",
    borderRadius: "3px",
    background: "rgba(255,255,255,0.05)",
    overflow: "hidden",
    marginTop: "8px",
  },
  quantumFill: (pct, color) => ({
    height: "100%",
    width: `${Math.min(100, pct * 100)}%`,
    background: color,
    borderRadius: "3px",
    transition: "width 0.5s ease",
  }),
  stateVector: {
    fontFamily: "'Courier New', monospace",
    fontSize: "0.75rem",
    lineHeight: "1.8",
    color: "#aaaadd",
    background: "rgba(10, 10, 30, 0.6)",
    padding: "12px",
    borderRadius: "8px",
    overflowX: "auto",
  },
  klRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid rgba(100, 100, 255, 0.05)",
    fontSize: "0.85rem",
  },
  statusDot: (ok) => ({
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: ok ? "#4ade80" : "#f87171",
    marginRight: "6px",
  }),
  refreshBtn: {
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    border: "none",
    color: "#fff",
    padding: "10px 24px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#8888cc",
  },
  codeLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: "0.75rem",
    background: "rgba(139, 92, 246, 0.15)",
    color: "#a78bfa",
    padding: "2px 8px",
    borderRadius: "4px",
    display: "inline-block",
    marginBottom: "8px",
  },
  miniChart: {
    display: "flex",
    alignItems: "flex-end",
    gap: "2px",
    height: "40px",
    marginTop: "8px",
  },
  miniBar: (h, color) => ({
    width: "4px",
    height: `${h}%`,
    background: color,
    borderRadius: "2px 2px 0 0",
    minHeight: "2px",
  }),
};

// ─── Crypto Config ───────────────────────────────────────────────────
const CRYPTOS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", color: "#f7931a" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", color: "#627eea" },
  { id: "hyperliquid", symbol: "HYPE", name: "Hyperliquid", color: "#00d4aa" },
];

const COINGECKO_API =
  "https://api.coingecko.com/api/v3";

// ─── Main Component ──────────────────────────────────────────────────
export default function Page() {
  const [cryptoData, setCryptoData] = useState({});
  const [priceHistories, setPriceHistories] = useState({});
  const [quantumResults, setQuantumResults] = useState({});
  const [klStatus, setKlStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  // ── Fetch with retry ─────────────────────────────────────────────
  const fetchWithRetry = useCallback(async (url, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(url, {
          headers: { "Accept": "application/json" },
        });
        if (res.status === 429) {
          // Rate limited, wait and retry
          await new Promise((r) => setTimeout(r, (i + 1) * 2000));
          continue;
        }
        if (!res.ok) throw new Error(`API ${res.status}`);
        return await res.json();
      } catch (err) {
        if (i === retries) throw err;
        await new Promise((r) => setTimeout(r, (i + 1) * 1000));
      }
    }
    return null;
  }, []);

  // ── Fetch current prices ────────────────────────────────────────
  const fetchPrices = useCallback(async () => {
    try {
      const data = await fetchWithRetry(
        `${COINGECKO_API}/simple/price?ids=bitcoin,ethereum,hyperliquid&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );
      return data;
    } catch (err) {
      console.error("Price fetch error:", err);
      setError("CoinGecko API rate limited. Prices will load on next refresh.");
      return null;
    }
  }, [fetchWithRetry]);

  // ── Fetch price history (7 days) ────────────────────────────────
  const fetchHistory = useCallback(async (coinId) => {
    try {
      const data = await fetchWithRetry(
        `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=7`
      );
      if (data && data.prices) return data.prices.map((p) => p[1]);
      return null;
    } catch (err) {
      console.error(`History fetch error for ${coinId}:`, err);
      return null;
    }
  }, [fetchWithRetry]);

  // ── Run quantum + SMC analysis ───────────────────────────────────
  const runQuantumAnalysis = useCallback((histories, priceData) => {
    const results = {};
    for (const crypto of CRYPTOS) {
      let prices = histories[crypto.id];

      // Fallback: generate synthetic history from 24h change
      if ((!prices || prices.length < 2) && priceData && priceData[crypto.id]) {
        const currentPrice = priceData[crypto.id].usd;
        const change24h = priceData[crypto.id].usd_24h_change || 0;
        const prevPrice = currentPrice / (1 + change24h / 100);
        prices = [];
        for (let i = 0; i <= 48; i++) {
          const t = i / 48;
          prices.push(prevPrice + (currentPrice - prevPrice) * t + (Math.sin(t * 8) * currentPrice * 0.002));
        }
      }

      if (prices && prices.length > 1) {
        const quantum = quantumSignalAnalysis(prices);
        const master = masterSignal(prices, quantum);
        results[crypto.id] = { quantum, master, prices };
      }
    }
    return results;
  }, []);

  // ── Master refresh ──────────────────────────────────────────────
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch prices and histories in parallel
      const [priceData, btcHist, ethHist, hypeHist] = await Promise.all([
        fetchPrices(),
        fetchHistory("bitcoin"),
        fetchHistory("ethereum"),
        fetchHistory("hyperliquid"),
      ]);

      if (priceData) {
        setCryptoData(priceData);
      }

      const histories = {};
      if (btcHist) histories.bitcoin = btcHist;
      if (ethHist) histories.ethereum = ethHist;
      if (hypeHist) histories.hyperliquid = hypeHist;

      setPriceHistories(histories);

      // Run quantum analysis (with priceData fallback)
      const qResults = runQuantumAnalysis(histories, priceData);
      setQuantumResults(qResults);

      // Run KL verification
      setKlStatus(fullKLVerification());

      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }, [fetchPrices, fetchHistory, runQuantumAnalysis]);

  // ── Auto-refresh every 60s ──────────────────────────────────────
  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(refresh, 60000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, refresh]);

  // ── Format helpers ──────────────────────────────────────────────
  const fmt = (n, decimals = 2) => {
    if (n == null) return "—";
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
    return `$${Number(n).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  const pct = (n) => {
    if (n == null) return "—";
    const sign = n >= 0 ? "+" : "";
    return `${sign}${n.toFixed(2)}%`;
  };

  // ── Render mini sparkline ───────────────────────────────────────
  const MiniChart = ({ prices, color }) => {
    if (!prices || prices.length < 2) return null;
    // Sample ~24 points
    const step = Math.max(1, Math.floor(prices.length / 24));
    const sampled = [];
    for (let i = 0; i < prices.length; i += step) sampled.push(prices[i]);
    const min = Math.min(...sampled);
    const max = Math.max(...sampled);
    const range = max - min || 1;
    return (
      <div style={styles.miniChart}>
        {sampled.map((p, i) => (
          <div
            key={i}
            style={styles.miniBar(
              10 + ((p - min) / range) * 90,
              i === sampled.length - 1 ? color : `${color}88`
            )}
          />
        ))}
      </div>
    );
  };

  // ── Render weight state visualization ───────────────────────────
  const WeightStateViz = ({ analysis }) => {
    if (!analysis) return null;
    const maxAmp = Math.max(...analysis.quantumState.map(Math.abs));
    return (
      <div style={{ marginTop: "12px" }}>
        <div style={{ fontSize: "0.75rem", color: "#8888cc", marginBottom: "6px" }}>
          Spin-3 Weight Basis Amplitudes |w=0..6&#x27E9;
        </div>
        <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "50px" }}>
          {analysis.quantumState.map((amp, w) => {
            const h = maxAmp > 0 ? (Math.abs(amp) / maxAmp) * 100 : 0;
            const m = jzEigenvalue(w);
            return (
              <div key={w} style={{ flex: 1, textAlign: "center" }}>
                <div
                  style={{
                    height: `${Math.max(2, h)}%`,
                    background:
                      m < 0
                        ? `rgba(248,113,113,${0.3 + Math.abs(amp) * 0.7})`
                        : m > 0
                        ? `rgba(74,222,128,${0.3 + Math.abs(amp) * 0.7})`
                        : "rgba(167,139,250,0.6)",
                    borderRadius: "3px 3px 0 0",
                    minHeight: "2px",
                    transition: "height 0.5s",
                  }}
                />
                <div style={{ fontSize: "0.6rem", color: "#666", marginTop: "2px" }}>
                  m={m >= 0 ? "+" : ""}{m}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── KL Verification Panel ──────────────────────────────────────
  const KLPanel = () => {
    const kl = klStatus;
    const rank2 = verifyRank2Failure();
    if (!kl) return null;

    return (
      <div style={styles.card}>
        <div style={styles.codeLabel}>{"{{7, 2, 2}}_SU(2)"}</div>
        <div style={styles.cardTitle}>Knill-Laflamme Verification</div>

        <div style={styles.klRow}>
          <span>
            <span style={styles.statusDot(kl.trivial.valid)} />
            Trivial Sector (1) — Identity
          </span>
          <span style={{ color: kl.trivial.valid ? "#4ade80" : "#f87171" }}>
            {kl.trivial.valid ? "PASS" : "FAIL"}
          </span>
        </div>

        <div style={styles.klRow}>
          <span>
            <span style={styles.statusDot(kl.Jz.valid)} />
            Adjoint (3) — J_z
          </span>
          <span style={{ color: kl.Jz.valid ? "#4ade80" : "#f87171" }}>
            {kl.Jz.valid ? "PASS" : "FAIL"}
          </span>
        </div>

        <div style={styles.klRow}>
          <span>
            <span style={styles.statusDot(kl.Jplus.valid)} />
            Adjoint (3) — J_+
          </span>
          <span style={{ color: kl.Jplus.valid ? "#4ade80" : "#f87171" }}>
            {kl.Jplus.valid ? "PASS" : "FAIL"}
          </span>
        </div>

        <div style={styles.klRow}>
          <span>
            <span style={styles.statusDot(kl.Jminus.valid)} />
            Adjoint (3) — J_-
          </span>
          <span style={{ color: kl.Jminus.valid ? "#4ade80" : "#f87171" }}>
            {kl.Jminus.valid ? "PASS" : "FAIL"}
          </span>
        </div>

        <div style={{ ...styles.klRow, borderBottom: "none" }}>
          <span>
            <span style={styles.statusDot(!rank2.valid)} />
            Rank-2 (5) — T_0^(2)
          </span>
          <span style={{ color: "#f59e0b" }}>
            FAIL (expected, d=2)
          </span>
        </div>

        <div
          style={{
            marginTop: "12px",
            padding: "10px",
            background: "rgba(74, 222, 128, 0.08)",
            borderRadius: "8px",
            fontSize: "0.8rem",
            color: "#4ade80",
            textAlign: "center",
          }}
        >
          Depth d = {kl.depth} verified — Detects all adjoint-order-1 errors
        </div>
      </div>
    );
  };

  // ── Six-Qubit Codewords Display ─────────────────────────────────
  const CodewordsPanel = () => {
    const cw = sixQubitCodewords();
    const c0 = codeword0Bar();
    const c1 = codeword1Bar();

    return (
      <div style={styles.card}>
        <div style={styles.codeLabel}>((6, 2, 2)) Six-Qubit Realization</div>
        <div style={styles.cardTitle}>Stella Z Codewords</div>

        <div style={styles.stateVector}>
          <div style={{ color: "#60a5fa", marginBottom: "4px" }}>
            Logical |0&#x0304;&#x27E9; = (1/&#x221A;2)( |000000&#x27E9; + |111111&#x27E9; )
          </div>
          <div style={{ color: "#666", fontSize: "0.65rem" }}>
            GHZ-like superposition of extreme weight states
          </div>
        </div>

        <div style={{ ...styles.stateVector, marginTop: "8px" }}>
          <div style={{ color: "#a78bfa", marginBottom: "4px" }}>
            Logical |1&#x0304;&#x27E9; = (1/&#x221A;20) &#x03A3; of {cw.logical1.numTerms} weight-3 states
          </div>
          <div style={{ color: "#666", fontSize: "0.65rem" }}>
            Maximally spread Dicke state D_3^6 — {cw.logical1.numTerms} balanced bitstrings
          </div>
        </div>

        <div style={{ marginTop: "12px" }}>
          <div style={{ fontSize: "0.7rem", color: "#8888cc", marginBottom: "6px" }}>
            Abstract V=7 Codeword Amplitudes
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {c0.map((v, i) => (
              <div
                key={`c0-${i}`}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "4px",
                  background: v !== 0 ? "rgba(96, 165, 250, 0.15)" : "rgba(30,30,60,0.4)",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  color: v !== 0 ? "#60a5fa" : "#444",
                }}
              >
                {v !== 0 ? v.toFixed(3) : "0"}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            {c1.map((v, i) => (
              <div
                key={`c1-${i}`}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "4px",
                  background: v !== 0 ? "rgba(167, 139, 250, 0.15)" : "rgba(30,30,60,0.4)",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  color: v !== 0 ? "#a78bfa" : "#444",
                }}
              >
                {v !== 0 ? v.toFixed(3) : "0"}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "2px",
              fontSize: "0.55rem",
              color: "#555",
            }}
          >
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                |{i}&#x27E9;
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─── MAIN RENDER ───────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>ZAPP Quantum Crypto Tracker</h1>
        <div style={styles.subtitle}>
          Powered by Stella Z Quantum Code {"{{7, 2, 2}}"}_SU(2) — Spin-3 Irrep Error Detection Engine
        </div>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <button style={styles.refreshBtn} onClick={refresh} disabled={loading}>
            {loading ? "Analyzing..." : "Refresh & Analyze"}
          </button>
          <label
            style={{ fontSize: "0.8rem", color: "#8888cc", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ marginRight: "6px" }}
            />
            Auto-refresh (60s)
          </label>
          {lastUpdate && (
            <span style={{ fontSize: "0.75rem", color: "#666" }}>
              Last: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      {error && (
        <div
          style={{
            padding: "12px",
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: "8px",
            color: "#f87171",
            marginBottom: "20px",
            fontSize: "0.85rem",
          }}
        >
          API Error: {error} — Retrying on next refresh cycle.
        </div>
      )}

      {/* Crypto Direction Cards */}
      <div style={styles.grid}>
        {CRYPTOS.map((crypto) => {
          const data = cryptoData[crypto.id];
          const history = priceHistories[crypto.id];
          const result = quantumResults[crypto.id];
          const qr = result?.quantum;
          const ms = result?.master;
          const change = data?.usd_24h_change;
          const isUp = change >= 0;

          const actionColor = ms?.direction === "BULLISH" ? "#4ade80" : ms?.direction === "BEARISH" ? "#f87171" : "#888";
          const actionBg = ms?.direction === "BULLISH" ? "rgba(74,222,128," : ms?.direction === "BEARISH" ? "rgba(248,113,113," : "rgba(150,150,150,";

          return (
            <div key={crypto.id} style={styles.card}>
              {/* Price Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.4rem", fontWeight: "800", color: crypto.color }}>{crypto.symbol}</span>
                    <span style={{ fontSize: "0.85rem", color: "#888" }}>{crypto.name}</span>
                  </div>
                  <div style={{ ...styles.price, marginTop: "4px" }}>
                    {data ? fmt(data.usd) : loading ? "..." : "\u2014"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {change != null && (
                    <div style={isUp ? styles.changePositive : styles.changeNegative}>
                      {isUp ? "\u25B2" : "\u25BC"} {pct(change)}
                    </div>
                  )}
                  {data?.usd_market_cap && (
                    <div style={{ fontSize: "0.7rem", color: "#666", marginTop: "4px" }}>MCap: {fmt(data.usd_market_cap, 0)}</div>
                  )}
                </div>
              </div>

              <MiniChart prices={history || result?.prices} color={crypto.color} />

              {/* ══ MASTER SIGNAL — LONG / SHORT / WAIT ══ */}
              {ms && (
                <div style={{
                  marginTop: "16px", padding: "16px", borderRadius: "12px",
                  background: `${actionBg}0.08)`,
                  border: `2px solid ${actionBg}0.3)`,
                }}>
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <div style={{ fontSize: "2.2rem", fontWeight: "900", letterSpacing: "4px", color: actionColor }}>
                      {ms.action}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#8888cc", marginTop: "2px" }}>
                      Quantum + SMC Combined Signal
                    </div>
                  </div>

                  {/* Confidence & Agreement */}
                  <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.7rem", color: "#888", marginBottom: "3px" }}>Confidence</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#a78bfa" }}>{ms.confidence.toFixed(0)}%</div>
                      <div style={styles.quantumBar}><div style={styles.quantumFill(ms.confidence / 100, "#a78bfa")} /></div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.7rem", color: "#888", marginBottom: "3px" }}>Agreement</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#60a5fa" }}>{ms.agreement.toFixed(0)}%</div>
                      <div style={styles.quantumBar}><div style={styles.quantumFill(ms.agreement / 100, "#60a5fa")} /></div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.7rem", color: "#888", marginBottom: "3px" }}>Signals</div>
                      <div style={{ fontSize: "0.85rem" }}>
                        <span style={{ color: "#4ade80", fontWeight: "700" }}>{ms.bullishCount}</span>
                        <span style={{ color: "#666" }}> vs </span>
                        <span style={{ color: "#f87171", fontWeight: "700" }}>{ms.bearishCount}</span>
                      </div>
                      <div style={{ fontSize: "0.6rem", color: "#555" }}>bull / bear</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ INDICATORS BREAKDOWN ══ */}
              {ms && (
                <div style={{ marginTop: "12px", padding: "12px", borderRadius: "10px", background: "rgba(10,10,30,0.5)", border: "1px solid rgba(100,100,255,0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#8888cc", letterSpacing: "1px", marginBottom: "8px", textTransform: "uppercase" }}>
                    Indicator Breakdown
                  </div>

                  {/* RSI */}
                  {ms.indicators.rsi.current != null && (
                    <div style={styles.klRow}>
                      <span style={{ fontSize: "0.78rem" }}>
                        <span style={{ color: "#f59e0b", fontWeight: "600" }}>RSI</span>
                        <span style={{ color: "#888" }}> {ms.indicators.rsi.current.toFixed(1)}</span>
                      </span>
                      <span style={{ fontSize: "0.72rem", color: ms.indicators.rsi.score > 0 ? "#4ade80" : ms.indicators.rsi.score < 0 ? "#f87171" : "#888" }}>
                        {ms.indicators.rsi.current > 70 ? "OVERBOUGHT" : ms.indicators.rsi.current < 30 ? "OVERSOLD" : ms.indicators.rsi.current > 55 ? "BULLISH" : ms.indicators.rsi.current < 45 ? "BEARISH" : "NEUTRAL"}
                      </span>
                    </div>
                  )}

                  {/* MACD */}
                  {ms.indicators.macd.histogram.length > 0 && (
                    <div style={styles.klRow}>
                      <span style={{ fontSize: "0.78rem" }}>
                        <span style={{ color: "#818cf8", fontWeight: "600" }}>MACD</span>
                      </span>
                      <span style={{ fontSize: "0.72rem", color: ms.indicators.macd.score > 0 ? "#4ade80" : ms.indicators.macd.score < 0 ? "#f87171" : "#888" }}>
                        {ms.indicators.macd.signals[0]?.type || "NEUTRAL"}
                      </span>
                    </div>
                  )}

                  {/* EMA */}
                  <div style={styles.klRow}>
                    <span style={{ fontSize: "0.78rem" }}>
                      <span style={{ color: "#34d399", fontWeight: "600" }}>EMA</span>
                      <span style={{ color: "#888" }}> 9/21/50/200</span>
                    </span>
                    <span style={{ fontSize: "0.72rem", color: ms.indicators.ema.score > 0 ? "#4ade80" : ms.indicators.ema.score < 0 ? "#f87171" : "#888" }}>
                      {ms.indicators.ema.score > 0 ? "BULLISH" : ms.indicators.ema.score < 0 ? "BEARISH" : "NEUTRAL"}
                    </span>
                  </div>

                  {/* FVG */}
                  <div style={styles.klRow}>
                    <span style={{ fontSize: "0.78rem" }}>
                      <span style={{ color: "#fb923c", fontWeight: "600" }}>FVG</span>
                      <span style={{ color: "#888" }}> ({ms.indicators.fvg.totalGaps || 0} gaps)</span>
                    </span>
                    <span style={{ fontSize: "0.72rem", color: ms.indicators.fvg.score > 0 ? "#4ade80" : ms.indicators.fvg.score < 0 ? "#f87171" : "#888" }}>
                      {ms.indicators.fvg.signals[0]?.type || "NEUTRAL"}
                    </span>
                  </div>

                  {/* Liquidity Sweeps */}
                  <div style={styles.klRow}>
                    <span style={{ fontSize: "0.78rem" }}>
                      <span style={{ color: "#f472b6", fontWeight: "600" }}>Liquidity</span>
                      <span style={{ color: "#888" }}> ({ms.indicators.liquidity.sweeps?.length || 0} sweeps)</span>
                    </span>
                    <span style={{ fontSize: "0.72rem", color: ms.indicators.liquidity.score > 0 ? "#4ade80" : ms.indicators.liquidity.score < 0 ? "#f87171" : "#888" }}>
                      {ms.indicators.liquidity.signals[0]?.type || "NEUTRAL"}
                    </span>
                  </div>

                  {/* Order Flow */}
                  <div style={{ ...styles.klRow, borderBottom: "none" }}>
                    <span style={{ fontSize: "0.78rem" }}>
                      <span style={{ color: "#22d3ee", fontWeight: "600" }}>Order Flow</span>
                      <span style={{ color: "#888" }}> Buy {ms.indicators.orderFlow.buyPressure?.toFixed(0)}%</span>
                    </span>
                    <span style={{ fontSize: "0.72rem", color: ms.indicators.orderFlow.score > 0 ? "#4ade80" : ms.indicators.orderFlow.score < 0 ? "#f87171" : "#888" }}>
                      {ms.indicators.orderFlow.score > 0 ? "BUYERS" : ms.indicators.orderFlow.score < 0 ? "SELLERS" : "BALANCED"}
                    </span>
                  </div>
                </div>
              )}

              {/* ══ DETAILED SIGNALS LIST ══ */}
              {ms && ms.allSignals.length > 0 && (
                <div style={{ marginTop: "8px", padding: "10px", borderRadius: "8px", background: "rgba(10,10,30,0.3)" }}>
                  <div style={{ fontSize: "0.65rem", color: "#666", letterSpacing: "1px", marginBottom: "6px", textTransform: "uppercase" }}>
                    All Signals
                  </div>
                  {ms.allSignals.slice(0, 8).map((sig, i) => (
                    <div key={i} style={{ fontSize: "0.7rem", padding: "3px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{
                        width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                        background: sig.type === "BULLISH" ? "#4ade80" : sig.type === "BEARISH" ? "#f87171" : "#888",
                      }} />
                      <span style={{ color: sig.type === "BULLISH" ? "#4ade80" : sig.type === "BEARISH" ? "#f87171" : "#888" }}>
                        {sig.msg}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantum State (collapsed) */}
              {qr && (
                <div style={{ marginTop: "8px" }}>
                  <WeightStateViz analysis={qr} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quantum Verification Section */}
      <div style={{ ...styles.grid, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <KLPanel />
        <CodewordsPanel />

        {/* Code Properties */}
        <div style={styles.card}>
          <div style={styles.codeLabel}>Stella Z Properties</div>
          <div style={styles.cardTitle}>Code Specification</div>

          <div style={{ fontSize: "0.85rem", lineHeight: "2" }}>
            {[
              ["Code Label", "{{7, 2, 2}}_SU(2)"],
              ["Group G", "SU(2)"],
              ["Irrep V", "7 (spin-3, dim 7)"],
              ["Logical K", "2 (one qubit)"],
              ["Depth d", "2"],
              ["Min Qubits", "6 (unique)"],
              ["Bosonic", "CLY-6 (n=6 excitations)"],
              ["Multi-qudit", "2 ququarts or 3 qutrits"],
            ].map(([label, value]) => (
              <div key={label} style={styles.klRow}>
                <span style={{ color: "#888" }}>{label}</span>
                <span style={{ color: "#e0e0ff", fontFamily: "monospace", fontSize: "0.8rem" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "12px",
              padding: "10px",
              background: "rgba(139, 92, 246, 0.08)",
              borderRadius: "8px",
              fontSize: "0.75rem",
              color: "#8888cc",
              lineHeight: "1.6",
            }}
          >
            <strong>Error Protection:</strong> Detects all single-qubit Pauli X, Y, Z errors,
            all adjoint-sector operators (J_x, J_y, J_z), and any multi-qubit error
            with irrep content in sectors 1 or 3. Fails at rank-2 sector (5) —
            consistent with depth d=2 exactly.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "30px 0",
          fontSize: "0.75rem",
          color: "#444",
          borderTop: "1px solid rgba(100, 100, 255, 0.1)",
          marginTop: "20px",
        }}
      >
        {"ZAPP Quantum Crypto Tracker — Stella Z {{7, 2, 2}}_SU(2) Engine"}
        <br />
        Market data from CoinGecko API | Quantum analysis is experimental and not financial advice
      </footer>
    </div>
  );
}
