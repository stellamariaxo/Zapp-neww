export const metadata = {
  title: "ZAPP - Super App",
  description: "Social Commerce + Live Streaming for Gen Z",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
