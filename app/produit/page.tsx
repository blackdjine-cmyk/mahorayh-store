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

 const [isZoomOpen, setIsZoomOpen] =
  useState(false);

  const [touchStart, setTouchStart] =
  useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);
const handleTouchStart = (
  e: React.TouchEvent
) => {
  setTouchStart(
    e.touches[0].clientX
  );
};

const handleTouchEnd = (
  e: React.TouchEvent
) => {
  if (!touchStart) return;

  const touchEnd =
    e.changedTouches[0].clientX;

  const diff =
    touchStart - touchEnd;

  if (
    Math.abs(diff) < 35
  )
    return;

  const images =
    selectedProduct.images || [];

  if (
    images.length === 0
  )
    return;

  const currentIndex =
    images.indexOf(activeImage);

  if (diff > 0) {
    // swipe gauche → image suivante
    const nextIndex =
      (currentIndex + 1) %
      images.length;

    setSelectedImage(
      images[nextIndex]
    );
    window.scrollTo({
  top: 180,
  behavior: "smooth",
});
  } else {
    // swipe droite → image précédente
    const prevIndex =
      (currentIndex -
        1 +
        images.length) %
      images.length;

    setSelectedImage(
      images[prevIndex]
    );
    window.scrollTo({
  top: 180,
  behavior: "smooth",
});
  }

  setTouchStart(null);
};
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

  const relatedModels =
    models.filter(
      (model) =>
        model.product_id ===
        selectedProduct.id
    );

  const activeImage =
    selectedImage ||
    selectedModel?.model_image ||
    selectedProduct.image;

  const activePrice =
    selectedModel?.model_price ||
    selectedProduct.price;

  const activeDescription =
    selectedModel?.model_description ||
    selectedProduct.description;

  return (

    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 overflow-x-hidden">

      {/* PRODUIT PRINCIPAL */}

      <div className="grid md:grid-cols-2 gap-12 items-start w-full overflow-x-hidden">

               {/* IMAGE PC */}
        <div className="hidden md:flex order-1 min-w-0">

          <div className="bg-[#f8f5ef] rounded-3xl p-4 shadow-lg w-full">

          <div className="grid grid-cols-[110px_1fr] gap-8 items-start">

              {selectedProduct.images &&
                selectedProduct.images.length > 0 && (

               <div className="
               flex
               flex-col
               gap-4
               shrink-0
               pt-2
               h-[520px]
               overflow-y-auto
               pr-3
               pl-2
               items-start
              ">
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
                       className={`
                       w-20
                       h-20
                       object-cover
                       rounded-2xl
                       border-2
                       cursor-pointer
                       transition-all
                       duration-300
                       bg-white
                       p-1
                       flex-shrink-0
                       hover:scale-105
                     ${
                       activeImage === img
                       ? "border-purple-600 shadow-lg ring-2 ring-purple-200"
                        : "border-purple-300 hover:border-purple-500"
                      }
                    `}
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
               onClick={() => setIsZoomOpen(true)}
               className={`
                w-full
               max-w-[520px]
               h-auto
               rounded-3xl
               object-cover
               transition-transform
               duration-500
                ease-in-out
               hover:scale-150
               cursor-zoom-in
             `}
            />
              </div>

            </div>

          </div>

        </div>

        {/* INFOS */}
         <div className="order-1 md:order-2 w-full min-w-0 overflow-x-hidden">

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
           <div className="md:hidden w-full overflow-x-hidden">
         <div className="bg-[#f8f5ef] rounded-3xl p-4 shadow-lg mb-8 w-full">
         <div className="space-y-4">

         {/* IMAGE PRINCIPALE MOBILE */}
         <div
         className="w-full flex justify-center overflow-hidden"
         onTouchStart={handleTouchStart}
         onTouchEnd={handleTouchEnd}
>

       <img
       src={activeImage}
       onClick={() => setIsZoomOpen(true)}
       className={`
       w-full
       max-w-full
       rounded-3xl
       shadow-xl
       object-cover
       transition-transform
       duration-500
       ease-in-out
     `}
    />
       </div>

       {/* MINIATURES MOBILE */}
       {selectedProduct.images &&
        selectedProduct.images.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto py-1 pb-2">
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

                  window.scrollTo({
                  top: 250,
                  behavior: "smooth",
             });
           }}
                  className={`
                 w-24
                 h-24
                 object-contain
                 rounded-2xl
                 border-2
                 cursor-pointer
                 transition-all
                 duration-300
                 bg-white
                 p-1
                 flex-shrink-0
                 box-border
               ${
                  activeImage === img
                 ? "border-purple-600 shadow-lg ring-2 ring-purple-200"
                 : "border-purple-300 hover:border-purple-500"
                 }
              `}
                />
              )
            )}
          </div>
        )}
    </div>
  </div>
</div>

             {/* MODÈLES PRODUITS */}
<div className="mt-8 w-full">
  <h3 className="text-2xl font-bold mb-5">
    Choisir un modèle
  </h3>

{/* MOBILE */}
 <div className="flex md:hidden gap-4 overflow-x-auto pt-2 pb-3 snap-x snap-mandatory scroll-smooth w-full px-1">
  {relatedModels.map((model) => (
    <button
      key={model.id}
      onClick={() => {
      setSelectedModel(model);
      setSelectedImage(model.model_image);

     window.scrollTo({
     top: 180,
     behavior: "smooth",
     });
    }}
     className={`
     w-[48%]
     min-w-[48%]
     bg-white
     border
     rounded-2xl
     p-4
     overflow-hidden
     flex-shrink-0
     snap-start
     transition-all
     duration-300
     hover:-translate-y-1
  ${
    selectedModel?.id === model.id
      ? "border-purple-600 shadow-2xl ring-2 ring-purple-200 scale-[1.02]"
      : "border-gray-200 hover:border-purple-300 hover:shadow-md"
  }
`}
    >
      <img
        src={model.model_image}
      className="w-full h-32 object-cover rounded-xl"
      />

      <p className="text-sm font-semibold mt-3 text-gray-800 text-center truncate">
        {model.model_name}
      </p>
    </button>
  ))}
</div>

{/* DESKTOP */}
<div className="hidden md:grid grid-cols-3 gap-5 mt-3 max-w-[560px]">
  {relatedModels.map((model) => (
    <button
      key={model.id}
      onClick={() => {
        setSelectedModel(model);
        setSelectedImage(model.model_image);
      }}
      className={`
        bg-white
        border
        rounded-2xl
        p-3
        overflow-hidden
        transition-all
        duration-300
        hover:-translate-y-1
        ${
          selectedModel?.id === model.id
            ? "border-purple-600 shadow-2xl ring-2 ring-purple-200 scale-[1.02]"
            : "border-gray-200 hover:border-purple-300 hover:shadow-md"
        }
      `}
    >
      <img
        src={model.model_image}
        alt={model.model_name}
        className="w-full aspect-square object-cover rounded-xl"
      />

      <p className="text-sm font-semibold mt-3 text-center text-gray-800 leading-tight">
        {model.model_name}
      </p>
    </button>
  ))}
</div>
</div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 text-lg mb-8 mt-6">
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
           className="w-full max-w-full mx-auto block bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white py-5 rounded-2xl font-bold text-xl shadow-xl hover:scale-[1.02] transition"
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto justify-items-center">

          {products
            .filter(
              (product) =>
                product.id !==
                selectedProduct.id
            )
            .map((product) => (

              <div
                key={product.id}
                className="
                  bg-white
                  rounded-3xl
                  overflow-hidden
                  shadow-lg
                  border
                  hover:shadow-2xl
                  transition
                  duration-300
                "
              >

                {/* IMAGE CARTE */}
                 <div className="w-full h-72 bg-[#f8f5ef] flex items-center justify-center overflow-hidden p-4">
             <img
                 src={product.image}
                 className="
                 max-w-full
                 max-h-full
                 object-contain
                 rounded-2xl
                 transition-transform
                 duration-300
                 hover:scale-105
                 "
              />
              </div>

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

                  <p
                 className="
                 text-gray-600
                 mb-5
                 min-h-[80px]
                 line-clamp-3
                 overflow-hidden
                 "
              >
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
                      className="
                        bg-gradient-to-r
                        from-fuchsia-600
                        to-purple-700
                        text-white
                        px-6
                        py-3
                        rounded-2xl
                        font-semibold
                        shadow-lg
                        hover:scale-105
                        transition
                      "
                    >
                      Voir
                    </button>

                  </div>

                </div>

              </div>

            ))}

        </div>

      </div>
{isZoomOpen && (
  <div
    onClick={() => setIsZoomOpen(false)}
    className="
      fixed
      inset-0
      bg-black/85
      z-50
      flex
      items-center
      justify-center
      p-4
      cursor-zoom-out
    "
  >
    <button
      onClick={() => setIsZoomOpen(false)}
      className="
        absolute
        top-6
        right-6
        text-white
        text-4xl
        font-bold
        z-50
      "
    >
      ✕
    </button>

    <img
      src={activeImage}
      onClick={(e) => e.stopPropagation()}
      className="
        max-w-full
        max-h-[90vh]
        object-contain
        rounded-3xl
        shadow-2xl
      "
    />
  </div>
)}
    </div>
  );
}