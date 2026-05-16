"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProduitPage() {

  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState<any>(null);

  const [selectedModel, setSelectedModel] =
    useState<any>(null);

  const [selectedImage, setSelectedImage] =
    useState("");

  // 📦 FETCH DATA
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    // 📦 PRODUITS
    const { data: productsData } =
      await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    // 🎨 MODELES
    const { data: modelsData } =
      await supabase
        .from("product_models")
        .select("*");

    setProducts(productsData || []);
    setModels(modelsData || []);

    // PRODUIT PAR DEFAUT
    if (
      productsData &&
      productsData.length > 0
    ) {

      const firstProduct =
        productsData[0];

      setSelectedProduct(firstProduct);

      // PREMIER MODELE DU PRODUIT
      const firstModel =
        modelsData?.find(
          (model) =>
            model.product_id ===
            firstProduct.id
        );

      setSelectedModel(firstModel || null);
    }
  };

  // 🔄 CHANGER PRODUIT
  const changeProduct = (
    product: any
  ) => {

    setSelectedProduct(product);

    const relatedModel =
      models.find(
        (model) =>
          model.product_id ===
          product.id
      );

    setSelectedModel(
      relatedModel || null
    );

    setSelectedImage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!selectedProduct) {

    return (
      <div className="text-center py-20 text-2xl">
        Chargement...
      </div>
    );
  }

  // 🎨 MODELES LIES
  const relatedModels =
    models.filter(
      (model) =>
        model.product_id ===
        selectedProduct.id
    );

  // 🖼️ IMAGE ACTIVE
  const activeImage =
    selectedImage ||
    selectedModel?.model_image ||
    selectedProduct.image;

  // 💰 PRIX ACTIF
  const activePrice =
    selectedModel?.model_price ||
    selectedProduct.price;

  // 📝 DESCRIPTION ACTIVE
  const activeDescription =
    selectedModel?.model_description ||
    selectedProduct.description;

  return (

    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">

      {/* PRODUIT PRINCIPAL */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* IMAGE */}
        <div className="order-2 md:order-1">

          <div className="bg-[#f8f5ef] rounded-3xl p-4 shadow-lg">

            <div className="space-y-4">

              {/* IMAGE PRINCIPALE */}

              <img
                src={activeImage}
                className="w-full rounded-3xl shadow-xl"
              />

              {/* MINIATURES */}

              {selectedProduct.images &&
                selectedProduct.images.length > 0 && (

                <div className="flex gap-3 flex-wrap">

                  {selectedProduct.images.map(
                    (img: string, index: number) => (

                      <img
                        key={index}
                        src={img}
                        onClick={() => {

                          setSelectedModel({
                            ...selectedModel,
                            model_image: img,
                          });

                          setSelectedImage(img);

                        }}
                        className="w-24 h-24 object-cover rounded-2xl border-2 border-purple-500 cursor-pointer hover:scale-105 transition"
                      />

                    )
                  )}

                </div>

              )}

            </div>

          </div>

          {/* MODELES */}
          {relatedModels.length > 0 && (

            <div className="mt-8">

              <h3 className="text-xl font-bold mb-4">
                Choisir un modèle
              </h3>

              <div className="flex gap-4 flex-wrap">

                {relatedModels.map(
                  (model) => (

                    <button
                      key={model.id}
                      onClick={() => {

                        setSelectedModel(model);

                        setSelectedImage(
                          model.model_image
                        );

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });

                      }}
                      className={`border-2 rounded-2xl p-2 transition hover:scale-105 ${
                        selectedModel?.id ===
                        model.id
                          ? "border-purple-600"
                          : "border-gray-200"
                      }`}
                    >

                      <img
                        src={
                          model.model_image
                        }
                        className="w-24 h-24 object-cover rounded-xl"
                      />

                      <p className="text-sm font-medium mt-2">
                        {model.model_name}
                      </p>

                    </button>

                  )
                )}

              </div>

            </div>

          )}

        </div>

        {/* INFOS */}
        <div className="order-1 md:order-2">

          <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
            ⭐ Produit populaire
          </span>

          <h1 className="text-4xl font-bold mt-5 mb-3">
            {selectedModel
              ? `${selectedProduct.name} — ${selectedModel.model_name}`
              : selectedProduct.name}
          </h1>

          <p className="text-gray-500 mb-5">
            {selectedProduct.category}
          </p>

          {/* MODELE ACTIF */}
          {selectedModel && (

            <div className="mb-5">

              <span className="bg-black text-white px-4 py-2 rounded-full text-sm">
                Modèle :
                {" "}
                {
                  selectedModel.model_name
                }
              </span>

            </div>

          )}

          {/* PRIX */}
          <div className="flex items-center gap-4 mb-10">

            <span className="text-5xl font-bold text-purple-700">
              {Number(activePrice).toFixed(2)}€
            </span>

            <span className="text-3xl text-gray-400 line-through">
              {Number(
                selectedProduct.old_price
              ).toFixed(2)}€
            </span>

          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 text-lg mb-10">
            {activeDescription}
          </p>

          {/* PANIER */}
          <button
            onClick={() =>
              addToCart({
                name:
                  selectedModel
                    ? `${selectedProduct.name} - ${selectedModel.model_name}`
                    : selectedProduct.name,

                price: activePrice,

                image: activeImage,
              })
            }
            className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white py-5 rounded-2xl font-bold text-xl shadow-xl hover:scale-[1.02] transition"
          >
            🛒 Ajouter au panier
          </button>

          {/* INFOS */}
          <div className="mt-6 text-gray-500 space-y-2">

            <p>
              ✔ Livraison rapide
            </p>

            <p>
              ✔ Paiement sécurisé
            </p>

            <p>
              ✔ Satisfait ou remboursé
            </p>

          </div>

        </div>

      </div>

      {/* AUTRES PRODUITS */}

      <div className="mt-28">

        <h2 className="text-5xl font-bold text-center mb-16">
          Découvrez aussi
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {products
            .filter(
              (product) =>
                product.id !== selectedProduct.id
            )
            .map((product) => (

              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border hover:shadow-2xl transition duration-300"
              >

                <img
                  src={product.image}
                  className="w-full h-80 object-cover"
                />

                <div className="p-6">

                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    ✨ Naturel
                  </span>

                  <h3 className="text-2xl font-bold mt-4 mb-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-500 text-sm mb-3">
                    {product.category}
                  </p>

                  <p className="text-gray-600 mb-5">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">

                    <span className="text-4xl font-bold text-purple-700">
                      {Number(
                        product.price
                      ).toFixed(2)}€
                    </span>

                    <button
                      onClick={() => {

                        changeProduct(product);

                        setSelectedImage("");
                        setSelectedModel(null);

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