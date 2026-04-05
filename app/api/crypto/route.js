/**
 * Server-side API proxy for crypto data.
 * Fetches from CoinGecko with proper headers to avoid rate limiting,
 * and falls back to CoinCap API if CoinGecko fails.
 */

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const COINCAP_API = "https://api.coincap.io/v2";

// CoinCap asset IDs mapping
const COINCAP_IDS = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  hyperliquid: "hyperliquid",
};

async function fetchCoinGecko() {
  const priceRes = await fetch(
    `${COINGECKO_API}/simple/price?ids=bitcoin,ethereum,hyperliquid&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "ZappQuantumTracker/1.0",
      },
      next: { revalidate: 30 },
    }
  );

  if (!priceRes.ok) throw new Error(`CoinGecko ${priceRes.status}`);
  const prices = await priceRes.json();

  // Fetch history for each coin
  const historyPromises = ["bitcoin", "ethereum", "hyperliquid"].map(async (id) => {
    try {
      const res = await fetch(
        `${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=7`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "ZappQuantumTracker/1.0",
          },
          next: { revalidate: 60 },
        }
      );
      if (!res.ok) return { id, prices: null };
      const data = await res.json();
      return { id, prices: data.prices?.map((p) => p[1]) || null };
    } catch {
      return { id, prices: null };
    }
  });

  const histories = await Promise.all(historyPromises);
  const historyMap = {};
  for (const h of histories) {
    historyMap[h.id] = h.prices;
  }

  return { prices, histories: historyMap, source: "coingecko" };
}

async function fetchCoinCap() {
  // Fetch all three assets
  const ids = ["bitcoin", "ethereum"];
  const results = {};

  for (const id of ids) {
    try {
      const res = await fetch(`${COINCAP_API}/assets/${id}`, {
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        const asset = data.data;
        results[id] = {
          usd: parseFloat(asset.priceUsd),
          usd_24h_change: parseFloat(asset.changePercent24Hr),
          usd_market_cap: parseFloat(asset.marketCapUsd),
          usd_24h_vol: parseFloat(asset.volumeUsd24Hr),
        };
      }
    } catch {
      // skip
    }
  }

  // Hyperliquid might not be on CoinCap, try it
  try {
    const res = await fetch(`${COINCAP_API}/assets?search=hyperliquid&limit=1`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const asset = data.data[0];
        results.hyperliquid = {
          usd: parseFloat(asset.priceUsd),
          usd_24h_change: parseFloat(asset.changePercent24Hr),
          usd_market_cap: parseFloat(asset.marketCapUsd),
          usd_24h_vol: parseFloat(asset.volumeUsd24Hr),
        };
      }
    }
  } catch {
    // skip
  }

  // Fetch history from CoinCap
  const historyMap = {};
  for (const id of ["bitcoin", "ethereum"]) {
    try {
      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const res = await fetch(
        `${COINCAP_API}/assets/${id}/history?interval=h2&start=${weekAgo}&end=${now}`,
        { headers: { Accept: "application/json" } }
      );
      if (res.ok) {
        const data = await res.json();
        historyMap[id] = data.data?.map((d) => parseFloat(d.priceUsd)) || null;
      }
    } catch {
      // skip
    }
  }

  return { prices: results, histories: historyMap, source: "coincap" };
}

export async function GET() {
  try {
    // Try CoinGecko first
    const data = await fetchCoinGecko();
    return Response.json(data);
  } catch (err) {
    console.log("CoinGecko failed, trying CoinCap:", err.message);
    try {
      // Fallback to CoinCap
      const data = await fetchCoinCap();
      return Response.json(data);
    } catch (err2) {
      console.log("CoinCap also failed:", err2.message);
      return Response.json(
        { error: "All APIs failed", prices: {}, histories: {} },
        { status: 502 }
      );
    }
  }
}
