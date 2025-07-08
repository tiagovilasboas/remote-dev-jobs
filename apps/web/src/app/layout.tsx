import "./globals.css";
import React from "react";

export const metadata = {
  title: "Remote Dev Jobs",
  description: "Find remote developer jobs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
