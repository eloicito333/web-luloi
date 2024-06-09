import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { getAuthSession } from "@/lib/nextAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Luloi",
  description: "Pàgina web creada amb tot el carinyo del món per penjarte cosetes 😙",
  manifest: "/manifest.webmanifest",
  referrer: 'origin-when-cross-origin',
  keywords: [],
  metadataBase: new URL(process.env?.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env?.PORT || 3000}`) ,
  authors: [{ name: 'Eloi Buil Cuadrat' }],
  creator: 'Eloi Buil Cuadrat',
  publisher: 'Eloi Buil Cuadrat',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Luloi',
    description: 'Pàgina web creada amb tot el carinyo del món per penjarte cosetes 😙',
    url: 'https://luloi.vercel.app/',
    siteName: 'Luloi',
    locale: 'ca_CA',
    type: 'website',
    images: {
      url: '/images/openGraph/opengraph-image.png',
      alt: `Foto de la Lucia i l'Eloi fent mewing`
    }
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon-white.png',
    apple: '/apple-icon.png',
    other: {
      rel: 'luloi-icon',
      url: '/icon-white.png',
    },
  },
  appleWebApp: {
    title: 'Luloi',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/apple-icon.png',
    ],
  },
};

export default async function RootLayout({ children }) {

  const session = await getAuthSession()

  return (
    <html lang="ca" className={`overflow-hidden light p-0 m-0 max-w-screen max-h-screen`}>
      <body className={`${inter.className} w-full h-full overflow-hidden text-black`}>
        <Providers nextAuthSession={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
