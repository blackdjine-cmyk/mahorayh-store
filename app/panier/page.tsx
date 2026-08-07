"use client";

import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PanierPage() {
const [nom, setNom] = useState("");
const [email, setEmail] = useState("");
const [telephone, setTelephone] = useState("");
const [codePostal, setCodePostal] = useState("");
const [ville, setVille] = useState("");
const [adresse, setAdresse] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [userId, setUserId] = useState("");
useEffect(() => {
  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
  setUserId(user.id);   
  setEmail(user.email || "");

const { data: client, error } = await supabase
  .from("clients")
  .select("*")
  .eq("user_id", user.id)
  .single();

console.log("CLIENT :", client);
console.log("CLIENT ERROR :", error);

if (client) {
  setNom(client.nom || "");
  setTelephone(client.telephone || "");
  setAdresse(client.adresse || "");
  setCodePostal(client.code_postal || "");
  setVille(client.ville || "");
}
}
  };

  loadUser();
}, []);

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

  const totalWeight = cart.reduce(
  (acc: number, item: any) =>
    acc + (item.weight || 0) * item.quantity,
  0
);

let shippingCost = 0;

if (totalWeight <= 500) {
  shippingCost = 3.69;
} else if (totalWeight <= 1000) {
  shippingCost = 4.25;
} else if (totalWeight <= 2000) {
  shippingCost = 5.25;
} else if (totalWeight <= 5000) {
  shippingCost = 7.90;
} else {
  shippingCost = 9.90;
}

// 💳 CHECKOUT
const handleCheckout = async () => {
  // panier vide
  if (cart.length === 0) {
    setErrorMessage("Votre panier est vide");
    return;
  }

  // validation champs
  if (
    !nom ||
    !email ||
    !telephone ||
    !codePostal ||
    !adresse
  ) {
    setErrorMessage("Veuillez remplir tous les champs");
    return;
  }

  // validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setErrorMessage(
      "Veuillez entrer une adresse e-mail valide"
    );
    return;
  }

  setErrorMessage("");
  setIsLoading(true);

setErrorMessage("");
setIsLoading(true);

// 💾 Mise à jour du client
await fetch("/api/client", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    user_id: userId,
    nom,
    email,
    telephone,
    adresse,
    code_postal: codePostal,
    ville,
    pays: "France",
  }),
});

  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
        userId,
        nom,
        email,
        telephone,
        codePostal,
        ville,
        adresse,
        shippingCost,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      setIsLoading(false);
      setErrorMessage("Erreur lors du paiement");
    }
  } catch (error) {
    setIsLoading(false);
    console.error(error);
    setErrorMessage(
      "Impossible de lancer le paiement"
    );
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
       className="bg-white rounded-3xl shadow-md border p-6 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 ease-in-out flex flex-col md:flex-row md:items-center md:justify-between gap-6"
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
                className="
               w-11
               h-11
               bg-gradient-to-r
               from-fuchsia-600
               to-purple-700
               text-white
               rounded-2xl
               font-bold
               text-lg
               shadow-md
               hover:shadow-xl
               hover:scale-105
               active:scale-95
               transition-all
               duration-300
              "
              >
                -
              </button>

              <span className="text-lg font-semibold">
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQuantity(index)}
                className="
               w-11
               h-11
               bg-gradient-to-r
               from-fuchsia-600
               to-purple-700
               text-white
               rounded-2xl
               font-bold
               text-lg
               shadow-md
               hover:shadow-xl
               hover:scale-105
               active:scale-95
               transition-all
               duration-300
               "
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* SUPPRIMER */}
     <button
      onClick={() => removeFromCart(index)}
      className="
     text-red-500
     font-medium
     transition-all
     duration-300
     hover:text-red-700
     hover:scale-105
     hover:underline
     active:scale-95
   "
 >
  Supprimer
</button>
      </div>
    ))}
  </div>

  {/* ================= RIGHT : CHECKOUT ================= */}
   <div className="w-full lg:col-span-2 lg:sticky lg:top-24 lg:min-w-[420px] bg-white rounded-3xl shadow-sm border p-6 md:p-8 space-y-6">

    {/* TOTAL */}
    <div className="bg-[#faf7ff] rounded-2xl border border-purple-100 p-5 shadow-sm" >
      <h2 className="text-2xl font-bold mb-4">
        Résumé commande
      </h2>
    </div>
  
   <div className="space-y-3 text-gray-700">

  <div className="flex justify-between">
    <span>Sous-total</span>
    <span>{total.toFixed(2)}€</span>
  </div>

  <div className="flex justify-between">
    <span>Poids colis</span>
    <span>{(totalWeight / 1000).toFixed(2)} kg</span>
  </div>

  <div className="flex justify-between">
    <span>Livraison</span>
    <span className="text-purple-500 font-semibold">
      {shippingCost.toFixed(2)}€
    </span>
  </div>

  <div className="flex justify-between">
    <span>TVA</span>
    <span>Incluse</span>
  </div>

  <div className="flex justify-between text-3xl font-bold text-purple-700 pt-5 border-t border-purple-200 mt-5">
    <span>Total</span>
    <span>{(total + shippingCost).toFixed(2)}€</span>
  </div>

</div>

    {/* FORMULAIRE */}
    <input
      type="text"
      placeholder="Nom complet"
      value={nom}
      onChange={(e) => setNom(e.target.value)}
     className="
     w-full
     border
     border-gray-200
     bg-white
     p-4
     rounded-2xl
     text-black
     placeholder-gray-400
     outline-none
     shadow-sm
     transition-all
     duration-300
     focus:border-purple-500
     focus:ring-2
     focus:ring-purple-200
     focus:shadow-md
    "
    />

    <input
      type="email"
      placeholder="Adresse e-mail"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
     className="
     w-full
     border
     border-gray-200
     bg-white
     p-4
     rounded-2xl
     text-black
     placeholder-gray-400
     outline-none
     shadow-sm
     transition-all
     duration-300
     focus:border-purple-500
     focus:ring-2
     focus:ring-purple-200
     focus:shadow-md
     "
    />

    <input
      type="tel"
      placeholder="Téléphone"
      value={telephone}
      onChange={(e) => setTelephone(e.target.value)}
     className="
     w-full
     border
     border-gray-200
     bg-white
     p-4
     rounded-2xl
     text-black
     placeholder-gray-400
     outline-none
     shadow-sm
     transition-all
     duration-300
     focus:border-purple-500
     focus:ring-2
     focus:ring-purple-200
     focus:shadow-md
    "
    />

    <input
      type="text"
      placeholder="Code postal"
      value={codePostal}
      onChange={async (e) => {
  const cp = e.target.value;

  setCodePostal(cp);

  if (cp.length === 5) {
    try {
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${cp}&limit=1`
      );

      const data = await res.json();

      if (data.features?.length > 0) {
        setVille(data.features[0].properties.city);
      }
    } catch (error) {
      console.error(error);
    }
  }
}}
      className="
      w-full
      border
     border-gray-200
     bg-white
     p-4
     rounded-2xl
     text-black
     placeholder-gray-400
     outline-none
     shadow-sm
     transition-all
     duration-300
     focus:border-purple-500
     focus:ring-2
     focus:ring-purple-200
     focus:shadow-md
    "
    />

    <input
  type="text"
  placeholder="Ville"
  value={ville}
  onChange={(e) => setVille(e.target.value)}
  className="
    w-full
    border
    border-gray-200
    bg-white
    p-4
    rounded-2xl
    text-black
    placeholder-gray-400
    outline-none
    shadow-sm
    transition-all
    duration-300
    focus:border-purple-500
    focus:ring-2
    focus:ring-purple-200
    focus:shadow-md
  "
/>

    <textarea
      placeholder="Adresse de livraison"
      value={adresse}
      onChange={(e) => setAdresse(e.target.value)}
     className="
     w-full
     border
     border-gray-200
     bg-white
     p-4
     rounded-2xl
     text-black
     placeholder-gray-400
     outline-none
     shadow-sm
     transition-all
     duration-300
     min-h-[120px]
     resize-none
     focus:border-purple-500
     focus:ring-2
     focus:ring-purple-200
     focus:shadow-md
    "
    />
  {errorMessage && (
  <p className="text-red-500 text-sm font-medium text-center">
    {errorMessage}
  </p>
)}
    {/* ACTIONS */}
   <button
  onClick={handleCheckout}
  disabled={isLoading}
  className={`w-full px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300 ${
  isLoading
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-gradient-to-r from-fuchsia-500 to-purple-600 shadow-lg shadow-purple-300/40 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-400/50 active:scale-95"
}`}
>
  {isLoading ? "⏳ Traitement..." : "💳 Passer au paiement"}
</button>

    <button
      onClick={clearCart}
      className="w-full bg-gray-200 px-6 py-4 rounded-xl hover:bg-gray-300 transition font-medium"
    >
      Vider le panier
    </button>

    <div className="grid grid-cols-2 gap-3 pt-2">

  <div className="bg-[#faf7ff] border border-purple-100 rounded-2xl p-3 text-center">
    <p className="text-xl">🔒</p>
    <p className="text-xs font-semibold mt-1">
      Paiement sécurisé
    </p>
  </div>

  <div className="bg-[#faf7ff] border border-purple-100 rounded-2xl p-3 text-center">
    <p className="text-xl">🚚</p>
    <p className="text-xs font-semibold mt-1">
      Livraison rapide
    </p>
  </div>

  <div className="bg-[#faf7ff] border border-purple-100 rounded-2xl p-3 text-center">
    <p className="text-xl">💜</p>
    <p className="text-xs font-semibold mt-1">
      Produits authentiques
    </p>
  </div>

  <div className="bg-[#faf7ff] border border-purple-100 rounded-2xl p-3 text-center">
    <p className="text-xl">⭐</p>
    <p className="text-xs font-semibold mt-1">
      Qualité premium
    </p>
  </div>

</div>
  </div>
</div>

        </>
      )}
    </div>
  );
}