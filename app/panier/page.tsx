"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function PanierPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [adresse, setAdresse] = useState("");

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  // 🔢 TOTAL
  const total = cart.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  // 💳 CHECKOUT
  const handleCheckout = async () => {

    // ✅ VALIDATION
    if (
      !nom ||
      !email ||
      !telephone ||
      !codePostal ||
      !adresse
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
        nom,
        email,
        telephone,
        codePostal,
        adresse,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur lors du paiement");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        🛒 Votre panier
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">
          Votre panier est vide.
        </p>
      ) : (
        <>
  {/* LAYOUT PREMIUM */}
<div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

  {/* ================= LEFT : PRODUITS ================= */}
  <div className="lg:col-span-3 space-y-5">
    {cart.map((item: any, index: number) => (
      <div
        key={index}
        className="bg-white rounded-3xl shadow-sm border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
      >
        {/* INFOS PRODUIT */}
        <div className="flex gap-4">
          <img
            src={item.image}
            className="w-24 h-24 object-cover rounded-2xl"
          />

          <div className="flex flex-col justify-center">
            <h2 className="font-semibold text-xl leading-tight max-w-md">
              {item.name}
            </h2>

            <p className="text-purple-600 font-bold text-2xl mt-2">
              {item.price}€
            </p>

            {/* QUANTITÉ */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => decreaseQuantity(index)}
                className="w-10 h-10 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                -
              </button>

              <span className="text-lg font-semibold">
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQuantity(index)}
                className="w-10 h-10 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* SUPPRIMER */}
        <button
          onClick={() => removeFromCart(index)}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Supprimer
        </button>
      </div>
    ))}
  </div>

  {/* ================= RIGHT : CHECKOUT ================= */}
  <div className="lg:col-span-2 lg:sticky lg:top-24 bg-white rounded-3xl shadow-sm border p-6 md:p-8 space-y-6">

    {/* TOTAL */}
    <div className="border-b pb-5">
      <h2 className="text-2xl font-bold mb-4">
        Résumé commande
      </h2>

      <div className="space-y-3 text-gray-700">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{total.toFixed(2)}€</span>
        </div>

        <div className="flex justify-between">
          <span>Livraison</span>
          <span className="text-green-600 font-medium">
            Offerte
          </span>
        </div>

        <div className="flex justify-between text-2xl font-bold text-black pt-4 border-t mt-4">
          <span>Total</span>
          <span>{total.toFixed(2)}€</span>
        </div>
      </div>
    </div>

    {/* FORMULAIRE */}
    <input
      type="text"
      placeholder="Nom complet"
      value={nom}
      onChange={(e) => setNom(e.target.value)}
      className="w-full border p-4 rounded-xl text-black placeholder-gray-400"
    />

    <input
      type="email"
      placeholder="Adresse e-mail"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full border p-4 rounded-xl text-black placeholder-gray-400"
    />

    <input
      type="tel"
      placeholder="Téléphone"
      value={telephone}
      onChange={(e) => setTelephone(e.target.value)}
      className="w-full border p-4 rounded-xl text-black placeholder-gray-400"
    />

    <input
      type="text"
      placeholder="Code postal"
      value={codePostal}
      onChange={(e) => setCodePostal(e.target.value)}
      className="w-full border p-4 rounded-xl text-black placeholder-gray-400"
    />

    <textarea
      placeholder="Adresse de livraison"
      value={adresse}
      onChange={(e) => setAdresse(e.target.value)}
      className="w-full border p-4 rounded-xl min-h-[120px] text-black placeholder-gray-400"
    />

    {/* ACTIONS */}
    <button
      onClick={handleCheckout}
      className="w-full bg-purple-600 text-white px-6 py-4 rounded-xl hover:bg-purple-700 transition font-semibold"
    >
      💳 Passer au paiement
    </button>

    <button
      onClick={clearCart}
      className="w-full bg-gray-200 px-6 py-4 rounded-xl hover:bg-gray-300 transition font-medium"
    >
      Vider le panier
    </button>

    <p className="text-sm text-gray-500 text-center">
      🔒 Paiement sécurisé • Livraison rapide
    </p>
  </div>
</div>

        </>
      )}
    </div>
  );
}