{
  "name": "zapp",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
} "use client";
import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("feed");
  const [cart, setCart] = useState([]);
  const [balance, setBalance] = useState(500000);

  const products = [
    { id: 1, name: "Sneakers", price: 850000 },
    { id: 2, name: "Earbuds", price: 450000 }
  ];

  const addToCart = (p) => {
    setCart((c) => [...c, p]);
  };

  const checkout = () => {
    const total = cart.reduce((s, i) => s + i.price, 0);

    if (balance < total) {
      alert("Saldo tidak cukup");
      return;
    }

    setBalance(balance - total);
    setCart([]);
    alert("Berhasil bayar!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ZAPP APP 🚀</h1>

      <h3>Saldo: Rp {balance.toLocaleString()}</h3>

      {/* NAV */}
      <button onClick={() => setTab("feed")}>Feed</button>
      <button onClick={() => setTab("shop")}>Shop</button>
      <button onClick={() => setTab("pay")}>Pay</button>

      <hr />

      {/* SCREEN */}
      {tab === "feed" && <div>🔥 Feed Page</div>}

      {tab === "shop" && (
        <div>
          {products.map((p) => (
            <div key={p.id}>
              {p.name} - Rp {p.price.toLocaleString()}
              <button onClick={() => addToCart(p)}>Tambah</button>
            </div>
          ))}
        </div>
      )}

      {tab === "pay" && (
        <div>
          <h3>Keranjang: {cart.length}</h3>
          <button onClick={checkout}>Checkout</button>
        </div>
      )}
    </div>
  );
}
