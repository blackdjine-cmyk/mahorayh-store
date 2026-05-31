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

  const [reviews, setReviews] = useState<any[]>([]);
  const [client, setClient] = useState("");
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

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

      const featuredProduct =
     productsData.find(
    (product) => product.id === 1
   ) || productsData[0];

   setSelectedProduct(featuredProduct);

   const firstModel =
   modelsData?.find(
    (model) =>
      model.product_id ===
      featuredProduct.id
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

    const fetchReviews = async () => {
  const res = await fetch("/api/reviews");

  if (!res.ok) return;

  const data = await res.json();

  const filtered = data.filter(
    (review: any) =>review.product_id === selectedProduct.id
  );

  setReviews(filtered);
 };

 useEffect(() => {
  if (selectedProduct?.id) {
    fetchReviews();
  }
 }, [selectedProduct]);

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

       <div className="grid md:grid-cols-2 gap-12 items-start content-start w-full overflow-visible">

               {/* IMAGE PC */}
        <div className="hidden md:flex order-1 min-w-0">

          <div className="bg-[#f8f5ef] rounded-3xl p-4 shadow-lg w-full">

          <div className="grid grid-cols-[110px_1fr] gap-8 items-start">

              {selectedProduct.images &&
                selectedProduct.images.length > 0 && (

        <div
         className="
         flex
         flex-col
         gap-4
         shrink-0
         pt-2
         max-h-[520px]
         overflow-y-auto
         pr-3
         pl-2
         items-start
        "
      >
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

      <div className="order-1 md:order-2 w-full min-w-0 flex flex-col justify-start self-start overflow-visible">

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

         <div
  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold mb-6 ${
    selectedProduct.stock > 0
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {selectedProduct.stock > 0
    ? `✔ En stock (${selectedProduct.stock})`
    : "❌ Rupture de stock"}
</div>

         <div className="bg-[#faf7f2] rounded-2xl p-5 mb-8 space-y-3">
          <p>🚚 Livraison rapide</p>
          <p>🔒 Paiement sécurisé</p>
          <p>⭐ Satisfaction client</p>
          <p>💜 Adapté aux peaux noires et métissées</p>
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
 <div className="flex md:hidden gap-4 overflow-x-auto pt-2 pb-3 snap-x snap-mandatory scroll-smooth w-full px-4">
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
<div className="hidden md:grid grid-cols-3 gap-5 mt-3 max-w-[560px] mx-auto">
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
  disabled={selectedProduct.stock <= 0}
  onClick={() =>
    addToCart({
      id: selectedProduct.id,

      name:
        selectedModel
          ? `${selectedProduct.name} - ${selectedModel.model_name}`
          : selectedProduct.name,

      price: activePrice,

      image: activeImage,

      weight: selectedModel?.model_weight
           ? Number(selectedModel.model_weight)
           : Number(selectedProduct.weight || 0),
    })
    
  }
  className={`w-full mt-2 py-5 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 ${
    selectedProduct.stock > 0
      ? "bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white hover:scale-[1.02]"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  {selectedProduct.stock > 0
    ? "🛒 Ajouter au panier"
    : "❌ Produit indisponible"}
</button>

        </div>

      </div>

       {/* AVIS CLIENTS */}
<div className="mt-16">
  <h2 className="text-3xl font-bold mb-8">
    ⭐ Avis clients
  </h2>

 {/* BOUTON OUVRIR FORMULAIRE */}
{!showReviewForm && (
  <button
    onClick={() => setShowReviewForm(true)}
    className="mb-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-semibold"
  >
    ✍️ Laisser un avis
  </button>
)}

{/* FORMULAIRE */}
{showReviewForm && (
  <div className="bg-white rounded-3xl shadow p-6 mb-10">

    <input
      type="text"
      placeholder="Votre email"
      value={client}
      onChange={(e) => setClient(e.target.value)}
      className="w-full border rounded-xl px-4 py-3 mb-4"
    />

    <select
      value={note}
      onChange={(e) => setNote(Number(e.target.value))}
      className="w-full border rounded-xl px-4 py-3 mb-4"
    >
      <option value={5}>⭐⭐⭐⭐⭐</option>
      <option value={4}>⭐⭐⭐⭐</option>
      <option value={3}>⭐⭐⭐</option>
      <option value={2}>⭐⭐</option>
      <option value={1}>⭐</option>
    </select>

    <textarea
      placeholder="Votre avis..."
      value={commentaire}
      onChange={(e) => setCommentaire(e.target.value)}
      className="w-full border rounded-xl px-4 py-3 mb-4 h-32"
    />

    <div className="flex gap-3 flex-wrap">

      <button
        onClick={async () => {
          await fetch("/api/reviews", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product_id: selectedProduct.id,
              client,
              note,
              commentaire,
            }),
          });

          setClient("");
          setNote(5);
          setCommentaire("");

          fetchReviews();

          setShowReviewForm(false);
        }}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-semibold"
      >
        Envoyer mon avis
      </button>

      <button
        onClick={() => setShowReviewForm(false)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-2xl font-semibold"
      >
        Annuler
      </button>

    </div>

  </div>
)}

  {/* LISTE AVIS */}
  <div className="space-y-6">
    {reviews.map((review, index) => (
      <div
        key={index}
        className="bg-gray-50 rounded-3xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-lg">
            {review.client}
          </p>

          <p className="text-yellow-500">
            {"⭐".repeat(review.note)}
          </p>
        </div>

        <p className="text-gray-700">
          {review.commentaire}
        </p>
      </div>
    ))}
  </div>
</div>

               {/* AUTRES PRODUITS */}
      <div className="mt-28">

        <h2 className="text-5xl font-bold text-center mb-16">
          Découvrez aussi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">

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
       w-full
       max-w-[340px]
       min-h-[540px]
       bg-white
       rounded-3xl
       overflow-hidden
       shadow-lg
       border
       hover:shadow-2xl
       hover:-translate-y-2
       hover:scale-[1.01]
       transition-all
       duration-300
       "
     >

        {/* IMAGE CARTE */}
<div
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
    w-full
    h-56
    bg-[#f8f5ef]
    flex
    items-center
    justify-center
    overflow-hidden
    p-4
    cursor-pointer
  "
>
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
    hover:shadow-xl
    hover:scale-105
    active:scale-95
    transition-all
    duration-300
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