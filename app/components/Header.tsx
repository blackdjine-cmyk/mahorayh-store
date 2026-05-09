"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 relative">

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <h1 className="text-xl md:text-2xl font-bold text-purple-700">
          Mahorayh Beauté
        </h1>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="/">Accueil</Link>
          <Link href="/produit">Produits</Link>
          <Link href="#">Résultats</Link>
          <Link href="#">Avis</Link>
        </nav>

        {/* DROITE */}
        <div className="flex items-center gap-4">

          {/* PANIER */}
          <Link
            href="/panier"
            className="relative text-2xl cursor-pointer"
          >
            🛒

            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* BOUTON */}
          <Link href="/produit">
            <button className="bg-purple-600 text-white px-4 md:px-5 py-2 rounded-full shadow-lg hover:scale-105 transition">
              Acheter
            </button>
          </Link>

          {/* MENU MOBILE */}
          <button
            className="md:hidden text-4xl text-purple-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>
      </div>

      {/* MENU MOBILE DÉROULANT */}
      
      {menuOpen && (
        <div className="md:hidden absolute top-[78px] right-4 w-60 bg-white/90 backdrop-blur-2xl shadow-2xl border border-gray-100 px-6 py-5 rounded-3xl">

          <nav className="flex flex-col gap-2 text-lg font-semibold text-gray-800">

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-purple-600 transition"
            >
              Accueil
            </Link>

            <Link
              href="/produit"
              onClick={() => setMenuOpen(false)}
              className="hover:text-purple-600 transition"
            >
              Produits
            </Link>

            <Link
              href="#"
              onClick={() => setMenuOpen(false)}
              className="hover:text-purple-600 transition"
            >
              Résultats
            </Link>

            <Link
              href="#"
              onClick={() => setMenuOpen(false)}
              className="hover:text-purple-600 transition"
            >
              Avis
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}