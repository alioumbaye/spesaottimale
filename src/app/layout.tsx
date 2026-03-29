import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spesa Ottimale — Risparmia sulla spesa",
  description:
    "Confronta i prezzi di Lidl, Esselunga, Conad, Eurospin e Coop vicino a te. Inserisci la lista della spesa e il tuo CAP per scoprire dove conviene comprare ogni prodotto.",
  keywords: "spesa, supermercato, risparmio, prezzi, confronto, Lidl, Esselunga, Conad, Eurospin, Coop",
  openGraph: {
    title: "Spesa Ottimale",
    description: "Trova i prezzi migliori nei supermercati vicino a te",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
