"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { supabase } from "../../lib/supabase";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const { cart } = useCart();

  const totalItems = cart.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );
  useEffect(() => {
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  getUser();
}, []);
const handleLogout = async () => {
  await supabase.auth.signOut();
  setUser(null);
};

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl md:text-4xl font-bold text-purple-700"
        >
          Mahorayh Beauté
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">

          <Link
            href="/"
            className="hover:text-purple-700 transition"
          >
            Accueil
          </Link>

          <Link
            href="/produit"
            className="hover:text-purple-700 transition"
          >
            Produits
          </Link>

          <Link
            href="/resultats"
            className="hover:text-purple-700 transition"
          >
            Résultats
          </Link>
          {user ? (
     <>
    <Link href="/compte" className="hover:text-purple-700 transition">
      Mon compte
    </Link>

    <button
      onClick={handleLogout}
      className="hover:text-red-500 transition"
    >
      Déconnexion
    </button>
  </>
) : (
  <>
    <Link href="/login" className="hover:text-purple-700 transition">
      Connexion
    </Link>

    <Link href="/register" className="hover:text-purple-700 transition">
      Inscription
    </Link>
  </>
)}

          <Link
            href="/panier"
            className="relative hover:text-purple-700 transition"
          >
            <ShoppingCart size={26} />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

        </nav>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-4 md:hidden">

          {/* PANIER */}
          <Link href="/panier" className="relative">

            <ShoppingCart
              size={28}
              className="text-gray-700"
            />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* BOUTON ACHETER */}
          <Link
            href="/produit"
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-5 py-2 rounded-full font-medium shadow-lg"
          >
            Acheter
          </Link>

          {/* MENU */}
          <button
            onClick={() => setMenuOpen(true)}
            className="text-purple-700"
          >
            <Menu size={34} />
          </button>

        </div>

      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">

          {/* MENU MOBILE */}
          <div className="absolute right-0 top-0 h-screen w-[78%] max-w-[300px] bg-white shadow-2xl p-8 rounded-l-[35px]">

            {/* HEADER MENU */}
            <div className="flex items-center justify-between mb-12">

              <h2 className="text-3xl font-bold text-purple-700">
                Menu
              </h2>

              <button
                onClick={() => setMenuOpen(false)}
                className="text-black"
              >
                <X size={40} />
              </button>

            </div>

          {/* LIENS */}
<nav className="flex flex-col text-2xl font-semibold text-gray-900">

  <Link
    href="/"
    onClick={() => setMenuOpen(false)}
    className="py-5 border-b"
  >
    Accueil
  </Link>

  <Link
    href="/produit"
    onClick={() => setMenuOpen(false)}
    className="py-5 border-b"
  >
    Produits
  </Link>

  <Link
    href="/resultats"
    onClick={() => setMenuOpen(false)}
    className="py-5 border-b"
  >
    Résultats
  </Link>

  <Link
    href="/panier"
    onClick={() => setMenuOpen(false)}
    className="py-5 border-b"
  >
    Panier
  </Link>

  {user ? (
    <>
      <Link
        href="/compte"
        onClick={() => setMenuOpen(false)}
        className="py-5 border-b"
      >
        Mon compte
      </Link>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          setUser(null);
          setMenuOpen(false);
          router.push("/");
        }}
        className="py-5 border-b text-left"
      >
        Déconnexion
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        onClick={() => setMenuOpen(false)}
        className="py-5 border-b"
      >
        Connexion
      </Link>

      <Link
        href="/register"
        onClick={() => setMenuOpen(false)}
        className="py-5 border-b"
      >
        Inscription
      </Link>
    </>
  )}

</nav>

          </div>

        </div>
      )}
    </header>
  );
}