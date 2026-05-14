"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProduitPage() {

  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState(0);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [selectedModel, setSelectedModel] =
    useState("");

  const [selectedPrice, setSelectedPrice] =
    useState(0);

  // 📦 Charger produits
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

      setProducts(data || []);

      // Initialisation premier produit
      if (data && data.length > 0) {

        setSelectedImage(
          data[0].model_image ||
          data[0].image
        );

        setSelectedModel(
          data[0].model || ""
        );

        setSelectedPrice(
          data[0].model_price ||
          data[0].price
        );
      }
    }
  };

  const product = products[selectedProduct];

  if (!product) {
    return (
      <div className="text-center py-20 text-2xl">
        Chargement des produits...
      </div>
    );
  }

  // 🔄 Changer produit
  const changeProduct = (index: number) => {

    const newProduct = products[index];

    setSelectedProduct(index);

    setSelectedImage(
      newProduct.model_image ||
      newProduct.image
    );

    setSelectedModel(
      newProduct.model || ""
    );

    setSelectedPrice(
      newProduct.model_price ||
      newProduct.price
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">

      {/* SECTION PRODUIT */}
      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* IMAGE */}
        <div>

          <div className="bg-[#f8f5ef] rounded-3xl p-4 shadow-lg">

            <img
              src={selectedImage}
              className="w-full rounded-2xl object-cover"
            />

          </div>

          {/* MODÈLE */}
          {product.model && (

            <div className="mt-6">

              <h3 className="font-bold text-lg mb-4">
                Choisir un modèle
              </h3>

              <div className="flex gap-4">

                <button
                  onClick={() => {

                    setSelectedModel(
                      product.model
                    );

                    setSelectedImage(
                      product.model_image ||
                      product.image
                    );

                    setSelectedPrice(
                      product.model_price ||
                      product.price
                    );
                  }}
                  className="border-2 border-purple-600 rounded-2xl p-2 hover:scale-105 transition"
                >

                  <img
                    src={
                      product.model_image ||
                      product.image
                    }
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  <p className="text-sm mt-2 font-medium text-center">
                    {product.model}
                  </p>

                </button>

              </div>

            </div>

          )}

        </div>

        {/* INFOS */}
        <div>

          <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
            ⭐ Produit populaire
          </span>

          <h1 className="text-4xl font-bold mt-5 mb-2">
            {product.name}
          </h1>

          <p className="text-gray-500 mb-4">
            {product.category}
          </p>

          {/* MODÈLE ACTIF */}
          {selectedModel && (

            <div className="mb-4">

              <span className="bg-black text-white px-4 py-2 rounded-full text-sm">
                Modèle :
                {" "}
                {selectedModel}
              </span>

            </div>

          )}

          <p className="text-gray-600 text-lg mb-6">
            {product.description}
          </p>

          {/* PRIX */}
          <div className="flex items-center gap-4 mb-8">

            <span className="text-5xl font-bold text-purple-700">
              {Number(selectedPrice).toFixed(2)}€
            </span>

            <span className="text-3xl text-gray-400 line-through">
              {Number(
                product.old_price
              ).toFixed(2)}€
            </span>

          </div>

          {/* AVANTAGES */}
          <ul className="space-y-4 text-gray-700 text-lg mb-10">

            <li>
              ✔ Réduit les taches visibles
            </li>

            <li>
              ✔ Illumine naturellement le teint
            </li>

            <li>
              ✔ Convient aux peaux sensibles
            </li>

            <li>
              ✔ Formule naturelle
            </li>

          </ul>

          {/* BOUTON PANIER */}
          <button
            onClick={() =>
              addToCart({
                name:
                  selectedModel
                    ? `${product.name} - ${selectedModel}`
                    : product.name,

                price: selectedPrice,

                image: selectedImage,
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

          {products.map((produit, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border hover:shadow-2xl transition duration-300"
            >

              <img
                src={
                  produit.model_image ||
                  produit.image
                }
                className="w-full h-80 object-cover"
              />

              <div className="p-6">

                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  ✨ Naturel
                </span>

                <h3 className="text-2xl font-bold mt-4 mb-2">
                  {produit.name}
                </h3>

                <p className="text-gray-500 text-sm mb-2">
                  {produit.category}
                </p>

                {produit.model && (
                  <p className="text-sm text-gray-500 mb-2">
                    Modèle :
                    {" "}
                    {produit.model}
                  </p>
                )}

                <p className="text-gray-600 mb-5">
                  {produit.description}
                </p>

                <div className="flex items-center justify-between">

                  <span className="text-4xl font-bold text-purple-700">

                    {Number(
                      produit.model_price ||
                      produit.price
                    ).toFixed(2)}€

                  </span>

                  <button
                    onClick={() =>
                      changeProduct(index)
                    }
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