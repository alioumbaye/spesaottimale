/** @type {import('next').NextConfig} */
const nextConfig = {
  // Rimuove i log di hydration in produzione
  reactStrictMode: true,

  // Ottimizzazione immagini — domini esterni futuri
  images: {
    remotePatterns: [],
  },

  // Variabili d'ambiente esposte al browser (devono iniziare con NEXT_PUBLIC_)
  // Quelle senza prefisso sono solo server-side e NON vanno qui
  env: {},
};

export default nextConfig;
