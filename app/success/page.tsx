"use client";

import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

 useEffect(() => {
    localStorage.removeItem("cart"); // 🔥 important
    clearCart(); // 🔥 vide le state
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        🎉 Paiement réussi !
      </h1>

      <p className="text-lg text-gray-600 mb-6">
        Merci pour votre commande 💜
      </p>

      <a
        href="/"
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
      >
        Retour à l'accueil
      </a>
    </div>
  );
}