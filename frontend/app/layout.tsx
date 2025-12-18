import type { Metadata } from "next";
import "./globals.css";
import { customFont } from "./fonts";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "BeMusicShare - Descubra Musicas Atraves de Pessoas",
    template: "%s | BeMusicShare",
  },
  description:
    "Uma comunidade de curadores musicais compartilhando descobertas autenticas. Descubra musicas atraves de pessoas, nao de algoritmos.",
  keywords: [
    "musica",
    "descoberta musical",
    "artistas independentes",
    "curadoria musical",
    "comunidade musical",
    "recomendacoes",
  ],
  authors: [{ name: "BeMusicShare" }],
  creator: "BeMusicShare",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://bemusicshare.com",
    siteName: "BeMusicShare",
    title: "BeMusicShare - Descubra Musicas Atraves de Pessoas",
    description:
      "Uma comunidade de curadores musicais compartilhando descobertas autenticas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BeMusicShare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BeMusicShare - Descubra Musicas Atraves de Pessoas",
    description:
      "Uma comunidade de curadores musicais compartilhando descobertas autenticas.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={customFont.variable}>
      <body className={`antialiased ${customFont.className} bg-[oklch(0.99_0.002_264)] text-[oklch(0.15_0.01_264)]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}