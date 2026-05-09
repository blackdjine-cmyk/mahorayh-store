"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <h1 className="text-xl md:text-2xl font-bold text-purple-700">
          Mahorayh Beauté
        </h1>

        {/* MENU PC */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-purple-600 transition">
            Accueil
          </Link>

          <Link
            href="/produit"
            className="hover:text-purple-600 transition"
          >
            Produits
          </Link>

          <Link href="#" className="hover:text-purple-600 transition">
            Résultats
          </Link>

          <Link href="#" className="hover:text-purple-600 transition">
            Avis
          </Link>
        </nav>

        {/* DROITE */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* PANIER */}
          <Link href="/panier" className="relative text-2xl">
            🛒

            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* BOUTON */}
          <Link href="/produit">
            <button className="bg-purple-600 text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition">
              Acheter
            </button>
          </Link>

          {/* MENU MOBILE */}
          <button
            className="md:hidden text-purple-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={34} /> : <Menu size={34} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE OUVERT */}
      {menuOpen && (
        <div className="md:hidden absolute top-[78px] right-4 w-52 bg-white/95 backdrop-blur-xl shadow-xl border border-gray-100 px-5 py-4 rounded-2xl">

          <nav className="flex flex-col gap-1 text-base font-semibold text-gray-800">

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="py-2 hover:text-purple-600 transition"
            >
              Accueil
            </Link>

            <Link
              href="/produit"
              onClick={() => setMenuOpen(false)}
              className="py-2 hover:text-purple-600 transition"
            >
              Produits
            </Link>

            <Link
              href="#"
              onClick={() => setMenuOpen(false)}
              className="py-2 hover:text-purple-600 transition"
            >
              Résultats
            </Link>

            <Link
              href="#"
              onClick={() => setMenuOpen(false)}
              className="py-2 hover:text-purple-600 transition"
            >
              Avis
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}