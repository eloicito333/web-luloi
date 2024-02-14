import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { getAuthSession } from "@/lib/nextAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Luloi",
  description: "Pàgina web creada amb tot el carinyo del món per penjarte cosetes 😙",
  referrer: 'origin-when-cross-origin',
  keywords: [],
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
    image: [
      {
        url: '/public/open-graph.png'
      }
    ]
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
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
    other: {
      rel: 'luloi-icon',
      url: '/icon.png',
    },
  },
};

export default async function RootLayout({ children }) {

  const session = await getAuthSession()

  return (
    <html lang="ca" className={`overflow-hidden light`}>
      <body className={`${inter.className} w-full h-full overflow-hidden text-black`}>
        <Providers nextAuthSession={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
