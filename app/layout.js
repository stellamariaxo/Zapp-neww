"use client";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>ZAPP - Stella Z Quantum Crypto Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0a0a1a", color: "#e0e0ff" }}>
        {children}
      </body>
    </html>
  );
}
