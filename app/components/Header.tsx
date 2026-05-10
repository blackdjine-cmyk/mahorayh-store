"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔢 Nombre total produits panier
  const totalItems = cart.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold text-purple-700"
        >
          Mahorayh Beauté
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 font-medium">

          <Link
            href="/"
            className="hover:text-purple-600 transition"
          >
            Accueil
          </Link>

          <Link
            href="/produit"
            className="hover:text-purple-600 transition"
          >
            Produits
          </Link>

          <Link
            href="/resultats"
            className="hover:text-purple-600 transition"
          >
            Résultats
          </Link>

        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">

          {/* PANIER */}
          <Link
            href="/panier"
            className="relative"
          >
            <ShoppingCart
              size={30}
              className="text-gray-700"
            />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* BOUTON */}
          <Link href="/produit">
            <button className="hidden md:block bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">
              Acheter
            </button>
          </Link>

          {/* MENU MOBILE */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden"
          >
            <Menu
              size={34}
              className="text-purple-700"
            />
          </button>

        </div>

      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">

          < div className="absolute right-0 top-0 h-auto min-h-screen w-[85%] max-w-[320px] bg-white shadow-2xl p-6 rounded-l-3xl">

            {/* HEADER MENU */}
            <div className="flex items-center justify-between mb-10">

              <h2 className="text-2xl font-bold text-purple-700">
                Menu
              </h2>

              <button onClick={() => setMenuOpen(false)}>
                <X size={32} />
              </button>

            </div>

            {/* NAV */}
            <nav className="flex flex-col text-2xl font-semibold mt-8">

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="py-3 border-b hover:text-purple-600 transition"
              >
                Accueil
              </Link>

              <Link
                href="/produit"
                onClick={() => setMenuOpen(false)}
                className="py-3 border-b hover:text-purple-600 transition"
              >
                Produits
              </Link>

              <Link
                href="/resultats"
                onClick={() => setMenuOpen(false)}
                className="py-3 border-b hover:text-purple-600 transition"
              >
                Résultats
              </Link>

              <Link
                href="/panier"
                onClick={() => setMenuOpen(false)}
                className="py-3 border-b hover:text-purple-600 transition"
              >
                Panier
              </Link>

            </nav>

          </div>

        </div>
      )}

    </header>
  );
}