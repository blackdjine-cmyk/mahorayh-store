"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import produits from "../data/commandes.json";

export default function ProduitPage() {
  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState(0);

  const produit = produits[selectedProduct];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

      {/* TITRE */}
      <div className="text-center mb-10">
        <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
          ✨ Collection Mahorayh Beauté
        </span>

        <h1 className="text-4xl md:text-5xl font-bold mt-5 mb-4">
          Nos Produits
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez notre sélection de soins naturels conçus pour illuminer,
          nourrir et révéler l’éclat des peaux noires et métissées.
        </p>
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-[120px_1fr_1fr] gap-10 items-start">

        {/* MINIATURES */}
        <div className="flex lg:flex-col gap-4 overflow-x-auto">

          {produits.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedProduct(index)}
              className={`min-w-[80px] border-2 rounded-2xl overflow-hidden transition ${
                selectedProduct === index
                  ? "border-purple-600 scale-105 shadow-lg"
                  : "border-gray-200"
              }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover"
              />
            </button>
          ))}

        </div>

        {/* IMAGE */}
        <div className="bg-[#f8f5ef] rounded-[35px] p-4 shadow-lg">

          <img
            src={produit.image}
            alt={produit.name}
            className="w-full rounded-[25px] object-cover"
          />

        </div>

        {/* INFOS */}
        <div>

          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            ⭐ Produit populaire
          </span>

          <h2 className="text-4xl font-bold mt-5 mb-4">
            {produit.name}
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {produit.description}
          </p>

          {/* PRIX */}
          <div className="flex items-center gap-4 mb-8">

            <span className="text-4xl font-bold text-purple-700">
              {produit.price}€
            </span>

            <span className="text-gray-400 line-through text-xl">
              {(produit.price + 10).toFixed(2)}€
            </span>

          </div>

          {/* AVANTAGES */}
          <div className="space-y-3 mb-8 text-gray-700">

            <p>✔ Réduit les taches visibles</p>
            <p>✔ Illumine naturellement le teint</p>
            <p>✔ Convient aux peaux sensibles</p>
            <p>✔ Formule naturelle inspirée des traditions</p>

          </div>

          {/* BOUTON */}
          <button
            onClick={() =>
              addToCart({
                name: produit.name,
                price: produit.price,
                image: produit.image,
              })
            }
            className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white py-5 rounded-2xl font-semibold text-lg shadow-xl hover:scale-[1.02] transition"
          >
            🛒 Ajouter au panier
          </button>

          {/* INFOS */}
          <div className="mt-6 space-y-2 text-sm text-gray-500">

            <p>🚚 Livraison rapide</p>
            <p>🔒 Paiement sécurisé</p>
            <p>💜 Satisfait ou remboursé</p>

          </div>

        </div>

      </div>

      {/* SECTION PRODUITS */}
      <div className="mt-24">

        <h3 className="text-3xl font-bold text-center mb-10">
          Découvrez aussi
        </h3>

        <div className="grid md:grid-cols-3 gap-8">

          {produits.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-[32px] overflow-hidden border border-[#eee] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition duration-300"
            >

              <img
                src={item.image}
                alt={item.name}
                className="w-full h-72 object-cover bg-[#f8f5ef]"
              />

              <div className="p-6">

                <span className="inline-block mb-3 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                ✨ Naturel
               </span>
                <h4 className="text-2xl font-bold mb-2">
                  {item.name}
                </h4>

                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">

                  <span className="text-2xl font-bold text-purple-700">
                    {item.price}€
                  </span>

                  <button
                    onClick={() => setSelectedProduct(index)}
                    className="bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white px-5 py-2 rounded-2xl shadow-lg hover:scale-105 transition"
                  >
                    Voir
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}