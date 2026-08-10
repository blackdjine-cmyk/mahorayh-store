import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  metadataBase: new URL("https://www.mahorayh-beaute.fr"),

  title: "Mahorayh Beauté | Soins naturels & cosmétiques pour une peau éclatante",

  description:
    "Découvrez Mahorayh Beauté : lotions, soins naturels et cosmétiques premium pour une peau éclatante, hydratée et lumineuse.",

  keywords: [
    "Mahorayh Beauté",
    "cosmétiques naturels",
    "soins visage",
    "soins corps",
    "lotion corps",
    "peau éclatante",
    "beauté naturelle",
    "cosmétiques premium",
    "glutathione",
    "curcuma",
    "soins peau noire",
    "soins peau métissée",
  ],

  authors: [{ name: "Mahorayh Beauté" }],

  creator: "Mahorayh Beauté",

  openGraph: {
    title: "Mahorayh Beauté",
    description:
      "Soins naturels & cosmétiques premium pour une peau éclatante.",
    url: "https://www.mahorayh-beaute.fr",
    siteName: "Mahorayh Beauté",
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mahorayh Beauté",
    description:
      "Soins naturels & cosmétiques premium pour une peau éclatante.",
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
