"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProduitPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);

  const produits = [
    {
      name: "Routine Éclat au Curcuma",
      price: 29.99,
      oldPrice: 39.99,
      description:
        "Routine complète pour réduire les taches et illuminer la peau.",
      images: [
        "https://image.noelshack.com/fichiers/2026/18/7/1777803577-le-pack.jpg",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803558-body-lotion.png",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803558-booster-eve-cremme.png",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803558-face-cream.png",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803595-facial-cleanser.png",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803595-serum.png",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803610-soap.png",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803576-metisse-avant.png",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803576-m-tisse-apres.png",
      ],
    },

    {
      name: "Savon Curcuma Éclat",
      price: 14.99,
      oldPrice: 24.99,
      description:
        "Savon naturel au curcuma pour nettoyer et purifier la peau.",
      images: [
        "https://image.noelshack.com/fichiers/2026/18/7/1777803610-soap.png",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803577-le-pack.jpg",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803595-serum.png",
      ],
    },

    {
      name: "Huile Éclat Naturel",
      price: 19.99,
      oldPrice: 29.99,
      description:
        "Huile nourrissante pour une peau douce et lumineuse.",
      images: [
        "https://image.noelshack.com/fichiers/2026/18/7/1777803577-oil.png",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803558-face-cream.png",
        "https://image.noelshack.com/fichiers/2026/18/7/1777803577-le-pack.jpg",
      ],
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = produits[selectedProduct];

  const nextImage = () => {
    setSelectedImage((prev) =>
      (prev + 1) % product.images.length
    );
  };

  const prevImage = () => {
    setSelectedImage((prev) =>
      (prev - 1 + product.images.length) %
      product.images.length
    );
  };

  useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.log(error);
  } else {
    setProducts(data);
  }
};
console.log(products);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">

      {/* SECTION PRODUIT */}
      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* GAUCHE */}
        <div className="flex justify-center w-full">

          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start w-full">

            {/* MINIATURES */}
            <div className="flex md:flex-col gap-3 overflow-x-auto max-w-full">

              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition ${
                    selectedImage === index
                      ? "border-purple-600 scale-105"
                      : "border-gray-200"
                  }`}
                />
              ))}

            </div>

            {/* IMAGE PRINCIPALE */}
            <div className="relative w-full max-w-[500px]">

              <div className="relative rounded-3xl overflow-hidden bg-[#f8f5ef] p-3 shadow-lg">

                <img
                  src={product.images[selectedImage]}
                  className="w-full rounded-2xl object-cover"
                />

                {/* FLECHE GAUCHE */}
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white shadow p-3 rounded-full"
                >
                  ←
                </button>

                {/* FLECHE DROITE */}
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white shadow p-3 rounded-full"
                >
                  →
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* DROITE */}
        <div>

          <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
            ⭐ Produit populaire
          </span>

          <h1 className="text-4xl font-bold mt-5 mb-4">
            {product.name}
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            {product.description}
          </p>

          {/* PRIX */}
          <div className="flex items-center gap-4 mb-8">

            <span className="text-5xl font-bold text-purple-700">
              {product.price.toFixed(2)}€
            </span>

            <span className="text-3xl text-gray-400 line-through">
              {product.oldPrice.toFixed(2)}€
            </span>

          </div>

          {/* AVANTAGES */}
          <ul className="space-y-4 text-gray-700 text-lg mb-10">
            <li>✔ Réduit les taches visibles</li>
            <li>✔ Illumine naturellement le teint</li>
            <li>✔ Convient aux peaux sensibles</li>
            <li>✔ Formule naturelle inspirée des traditions</li>
          </ul>

          {/* BOUTON */}
          <button
            onClick={() =>
              addToCart({
                name: product.name,
                price: product.price,
                image: product.images[0],
              })
            }
            className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white py-5 rounded-2xl font-bold text-xl shadow-xl hover:scale-[1.02] transition"
          >
            🛒 Ajouter au panier
          </button>

          {/* INFOS */}
          <div className="mt-6 text-gray-500 space-y-2">
            <p>✔ Livraison rapide</p>
            <p>✔ Paiement sécurisé</p>
            <p>✔ Satisfait ou remboursé</p>
          </div>

        </div>

      </div>

      {/* AUTRES PRODUITS */}
      <div className="mt-28">

        <h2 className="text-5xl font-bold text-center mb-16">
          Découvrez aussi
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {produits.map((produit, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border hover:shadow-2xl transition duration-300"
            >

              <img
                src={produit.images[0]}
                className="w-full h-80 object-cover"
              />

              <div className="p-6">

                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  ✨ Naturel
                </span>

                <h3 className="text-2xl font-bold mt-4 mb-3">
                  {produit.name}
                </h3>

                <p className="text-gray-600 mb-5">
                  {produit.description}
                </p>

                <div className="flex items-center justify-between">

                  <span className="text-4xl font-bold text-purple-700">
                    {produit.price.toFixed(2)}€
                  </span>

                  <button
                    onClick={() => {
                      setSelectedProduct(index);
                      setSelectedImage(0);

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className="bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
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