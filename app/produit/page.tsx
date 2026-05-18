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

    const { data: productsData } =
      await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    const { data: modelsData } =
      await supabase
        .from("product_models")
        .select("*");

    setProducts(productsData || []);
    setModels(modelsData || []);

    if (
      productsData &&
      productsData.length > 0
    ) {

      const firstProduct =
        productsData[0];

      setSelectedProduct(firstProduct);

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

<div className="grid md:grid-cols-2 gap-12 items-start">

{/* IMAGE PC */}
<div className="hidden md:flex order-1 min-w-0">

  <div className="bg-[#f8f5ef] rounded-3xl p-4 shadow-lg w-full">

    <div className="grid grid-cols-[80px_1fr] gap-6 items-start">

      {selectedProduct.images &&
        selectedProduct.images.length > 0 && (

        <div className="flex flex-col gap-5 shrink-0 pt-4">

          {selectedProduct.images.map(
            (
              img: string,
              index: number
            ) => (

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
                className="w-20 h-20 object-cover rounded-2xl border-2 border-purple-300 cursor-pointer hover:border-purple-600 hover:scale-105 transition duration-300 bg-white p-1"
              />

            )
          )}

        </div>

      )}

      <div
        className="overflow-hidden rounded-3xl shadow-xl"
        onMouseMove={(e) => {

          const target = e.currentTarget;
          const rect = target.getBoundingClientRect();

          const x =
            ((e.clientX - rect.left) / rect.width) * 100;

          const y =
            ((e.clientY - rect.top) / rect.height) * 100;

          const img = target.querySelector("img");

          if (img) {
            (img as HTMLImageElement).style.transformOrigin =
              `${x}% ${y}%`;
          }

        }}
      >

        <img
          src={activeImage}
          className="
            w-full
            max-w-[520px]
            h-auto
            rounded-3xl
            object-cover
            transition-transform
            duration-300
            hover:scale-150
            cursor-zoom-in
          "
        />

      </div>

    </div>

  </div>

</div>

      {/* MODELES */}
{relatedModels.length > 0 && (

   <div className="hidden md:block mt-8">

    <h3 className="text-2xl font-bold mb-5">
      Choisir un modèle
    </h3>

    <div className="flex gap-4 flex-wrap">

      {relatedModels.map((model) => (

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
          className={`bg-white border rounded-2xl p-3 transition-all duration-300 hover:border-purple-600 hover:shadow-lg hover:-translate-y-1 ${
            selectedModel?.id === model.id
              ? "border-purple-600 shadow-md"
              : "border-gray-200"
          }`}
        >

          <img
            src={model.model_image}
            className="w-20 h-20 object-cover rounded-xl"
          />

          <p className="text-sm font-semibold mt-3 text-gray-800 text-center">
            {model.model_name}
          </p>

        </button>

      ))}

    </div>

  </div>

)}

  {/* INFOS */}
  <div className="order-1 md:order-2">

    <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
      ⭐ Produit populaire
    </span>

    <h1 className="text-4xl font-bold leading-[1.1] mt-5 mb-3">

  <>
    {selectedProduct.name}
    <br />
    {selectedModel?.model_name}
  </>

</h1>

{/* MODELE ACTIF */}
       {selectedModel && (

      <div className="mb-5">

        <span className="bg-black text-white px-4 py-2 rounded-full text-sm">
          Modèle :
          {" "}
          {selectedModel.model_name}
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

    {/* IMAGE MOBILE */}
    <div className="md:hidden">

      <div className="bg-[#f8f5ef] rounded-3xl p-4 shadow-lg mb-8">

     <div className="space-y-4">

  {/* IMAGE PRINCIPALE MOBILE */}
  <img
    src={activeImage}
    className="w-full rounded-3xl shadow-xl"
  />

  {/* MINIATURES MOBILE */}
  {selectedProduct.images &&
    selectedProduct.images.length > 0 && (

    <div className="flex gap-3 overflow-x-auto">

      {selectedProduct.images.map(
        (
          img: string,
          index: number
        ) => (

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
            className="w-24 h-24 object-cover rounded-2xl border-2 border-purple-300 cursor-pointer"
          />

        )
      )}

    </div>

  )}

</div>

      </div>

    </div>


    {/* DESCRIPTION */}
    <p className="text-gray-600 text-lg mb-8">
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
                product.id !==
                selectedProduct.id
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