"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cart } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <h1 className="text-xl font-bold text-purple-700">
          Mahorayh Beauté
        </h1>

        {/* MENU */}
        <nav className="hidden md:flex gap-8 text-gray-700">
          <Link href="/">Accueil</Link>
          <Link href="/produit">Produits</Link>
          <Link href="#">Résultats</Link>
          <Link href="#">Avis</Link>
        </nav>

        {/* DROITE */}
        <div className="flex items-center gap-6">
          
          {/* PANIER */}
          <Link href="/panier" className="relative text-xl cursor-pointer">
           🛒

           {cart.length > 0 && (
           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
           {cart.length}
           </span>
           )}
           </Link>

          {/* BOUTON */}
          <Link href="/produit">
            <button className="bg-purple-600 text-white px-5 py-2 rounded-full shadow hover:scale-105 transition">
              Acheter
            </button>
          </Link>

        </div>
      </div>
    </header>
  );
}