"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState, useRef } from "react";
import { useCart } from "../context/CartContext";



export default function ProduitPage() {

  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [selectedModel, setSelectedModel] = useState<any>(null);

  const [selectedImage, setSelectedImage] = useState("");

  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const [reviews, setReviews] = useState<any[]>([]);
  const [client, setClient] = useState("");
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const miniaturesRef = useRef<HTMLDivElement>(null);
  const modelsRef = useRef<HTMLDivElement>(null); 
  const [showDescription, setShowDescription] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

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

   const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce(
          (sum, review) =>
            sum + review.note,
          0
        ) / reviews.length
      ).toFixed(1)
    : "5.0";

    const submitReview = async () => {
  if (!client || !commentaire) return;

  const res = await fetch("/api/reviews", {
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

  if (!res.ok) {
  const message = await res.text();
  alert(message);
  return;
}

  setClient("");
  setCommentaire("");
  setNote(5);
  setShowReviewForm(false);

  fetchReviews();
};
  
    return (
  <>
    <div className="max-w-[1400px] mx-auto px-6 py-8">

      <div
     className="
     grid
     grid-cols-1
     lg:grid-cols-[80px_500px_330px]
     gap-6
     lg:gap-[30px]
     justify-center
     "
    >

 {/* MINIATURES PC */}
<div
  className="
  hidden
  lg:flex
  relative
  h-[500px]
  flex-col
  items-center
  justify-center
  "
>

  <button
    onClick={() =>
      miniaturesRef.current?.scrollBy({
        top: -100,
        behavior: "smooth",
      })
    }
    className="
    absolute
    top-2
    left-1/2
    -translate-x-1/2
    z-20
    w-10
    h-10
    rounded-full
    bg-white/90
    shadow-lg
    border
    border-gray-200
    transition
    hover:scale-105
    "
  >
    ▲
  </button>

  <div
    ref={miniaturesRef}
    className="
    h-[380px]
    flex
    flex-col
    gap-3
    overflow-y-auto
    scrollbar-hide
    select-none
    items-center
    "
  >
    {selectedProduct.images?.map(
      (img: string, index: number) => (
        <img
          key={index}
          src={img}
          onClick={() => setSelectedImage(img)}
          draggable={false}
          className={`
            w-[70px]
            h-[70px]
            object-cover
            rounded-2xl
            cursor-pointer
            transition-all
            duration-200
            ${
              activeImage === img
                ? "border-2 border-purple-500 shadow-lg"
                : "border-2 border-gray-200"
            }
          `}
        />
      )
    )}
  </div>

  <button
    onClick={() =>
      miniaturesRef.current?.scrollBy({
        top: 100,
        behavior: "smooth",
      })
    }
    className="
    absolute
    bottom-2
    left-1/2
    -translate-x-1/2
    z-20
    w-10
    h-10
    rounded-full
    bg-white/90
    shadow-lg
    border
    border-gray-200
    transition
    hover:scale-105
    "
  >
    ▼
  </button>

</div>

{/* IMAGE */}
<div className="flex flex-col gap-6">

  <div
    className="
    relative
    bg-[#f8f5ef]
    rounded-3xl
    overflow-hidden
    shadow-lg
    flex
    items-center
    justify-center
    group
    mx-auto

    w-full
    h-[340px]

    lg:w-[500px]
    lg:h-[500px]

    lg:mx-0
    "
  >

    {/* FLÈCHES DE NAVIGATION */}

    <button
      onClick={(e) => {
        e.stopPropagation();

        const images =
          selectedProduct.images || [];

        const index =
          images.indexOf(activeImage);

        setSelectedImage(
          images[
            (index - 1 + images.length) %
            images.length
          ]
        );
      }}
      className="
      absolute
      left-3
      top-1/2
      -translate-y-1/2
      z-20

      w-10
      h-10

      lg:w-12
      lg:h-12

      rounded-full
      bg-white/80
      backdrop-blur
      shadow-lg

      opacity-100
      lg:opacity-0
      lg:group-hover:opacity-100

      transition
      "
    >
      ‹
    </button>

    <img
      src={activeImage}
      onClick={() => setIsZoomOpen(true)}
      className="
      w-full
      h-full
      object-contain
      cursor-zoom-in
      transition-transform
      duration-500
      group-hover:scale-[1.04]
      "
    />

    <button
      onClick={(e) => {
        e.stopPropagation();

        const images =
          selectedProduct.images || [];

        const index =
          images.indexOf(activeImage);

        setSelectedImage(
          images[
            (index + 1) %
            images.length
          ]
        );
      }}
      className="
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      z-20

      w-10
      h-10

      lg:w-12
      lg:h-12

      rounded-full
      bg-white/80
      backdrop-blur
      shadow-lg

      opacity-100
      lg:opacity-0
      lg:group-hover:opacity-100

      transition
      "
    >
      ›
    </button>

  </div>

  {/* MINIATURES MOBILE */}
  <div
    className="
    lg:hidden
    flex
    gap-3
    overflow-x-auto
    scrollbar-hide
    px-4
    pb-4
    "
  >
    {selectedProduct.images?.map(
      (img: string, index: number) => (
        <img
          key={index}
          src={img}
          onClick={() => setSelectedImage(img)}
          className={`
            w-20
            h-20
            rounded-2xl
            object-cover
            flex-shrink-0
            cursor-pointer
            ${
              activeImage === img
                ? "border-2 border-purple-500 shadow-lg"
                : "border border-gray-200"
            }
          `}
        />
      )
    )}
  </div>

</div>

{/* COLONNE DROITE */}
        <div className="flex flex-col gap-6">

          <div>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              ⭐ Produit populaire
            </span>

            <h1 className="text-4xl font-bold mt-4">
              {selectedProduct.name}
            </h1>
          </div>

          <div>
            <div className="text-5xl font-bold text-purple-600">
              {activePrice}€
            </div>

            <div className="mt-3 flex items-center gap-2">
  <span className="text-yellow-500 text-xl">
    ⭐⭐⭐⭐⭐
  </span>

  <span className="font-semibold">
    {averageRating}/5
  </span>

  <span className="text-gray-500">
    ({reviews.length} avis)
  </span>
</div>

<div className="mt-2 text-green-600">
  ✓ En stock
</div>
          </div>

{relatedModels.length > 0 && (
  <div className="bg-white rounded-3xl p-6 shadow-md overflow-hidden">

    <h3 className="font-semibold text-xl mb-5">
      Choisir un modèle
    </h3>

    <div className="relative">

      {/* Flèche gauche */}
      <button
        type="button"
        onClick={() =>
          modelsRef.current?.scrollBy({
            left: -220,
            behavior: "smooth",
          })
        }
        className="
          hidden lg:flex
          absolute
          left-0
          top-1/2
          -translate-y-1/2
          z-10
          w-9
          h-9
          rounded-full
          bg-white
          shadow-md
          border
          items-center
          justify-center
        "
      >
        ◀
      </button>

      {/* Liste des modèles */}
      <div
        ref={modelsRef}
        className="
          flex
          gap-4
          overflow-x-auto
          overflow-y-hidden
          scrollbar-hide
          snap-x
          snap-mandatory
          pb-3
          lg:px-10
        "
      >
        {relatedModels.map((model) => (

          <button
            key={model.id}
            onClick={() => {
              setSelectedModel(model);
              setSelectedImage("");

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className={`
              min-w-[180px]
              flex-shrink-0
              p-4
              rounded-2xl
              border-2
              shadow-sm
              transition-all
              duration-300
              text-left
              snap-start
              hover:shadow-lg

              ${
                selectedModel?.id === model.id
                  ? "border-purple-600 bg-purple-50 shadow-lg"
                  : "border-gray-200 bg-white"
              }
            `}
          >
            <div className="font-semibold">
              {model.model_name}
            </div>

            {model.price && (
              <div className="mt-2 text-purple-600 font-bold">
                {model.price}€
              </div>
            )}
          </button>

        ))}
      </div>

      {/* Flèche droite */}
      <button
        type="button"
        onClick={() =>
          modelsRef.current?.scrollBy({
            left: 220,
            behavior: "smooth",
          })
        }
        className="
          hidden lg:flex
          absolute
          right-0
          top-1/2
          -translate-y-1/2
          z-10
          w-9
          h-9
          rounded-full
          bg-white
          shadow-md
          border
          items-center
          justify-center
        "
      >
        ▶
      </button>

    </div>

  </div>
)} 

          <div className="bg-white rounded-3xl p-6 shadow-md space-y-3">
            <div>🚚 Livraison rapide</div>
            <div>🔒 Paiement sécurisé</div>
            <div>⭐ Satisfaction client</div>
            <div>💜 Adapté aux peaux noires et métissées</div>
          </div>

          <button
            onClick={() =>
              addToCart({
                id:
                  selectedModel?.id ||
                  selectedProduct.id,
                name:
                  selectedModel?.model_name ||
                  selectedProduct.name,
                price: activePrice,
                image: activeImage,
                quantity: 1,
              })
            }
            className="
              w-full
              py-5
              rounded-3xl
              bg-purple-600
              text-white
              text-xl
              font-bold
            "
          >
            Ajouter au panier
          </button>

        </div>

      </div>
</div>
    

{/* BLOC DESCRIPTION PRODUIT */}

 <div
  className="
    mt-16
    bg-gradient-to-br
    from-[#fffdf9]
    to-[#f9f4eb]

    rounded-3xl
    p-8

    border
    border-[#eadfcf]

    shadow-[0_15px_40px_rgba(0,0,0,0.08)]

    backdrop-blur-sm
  "
>
  <h2
    className="
      text-3xl
      font-bold
      mb-5
      text-[#1a1a1a]
    "
  >
    Description
  </h2>

  <p
    className="
      text-gray-700
      leading-8
      text-[17px]
    "
  >
    {selectedProduct.description?.slice(0, 220)}...
  </p>

  <button
    onClick={() => setDescriptionOpen(true)}
    className="
      mt-6
      text-purple-600
      font-semibold
      hover:text-purple-700
      transition
    "
  >
    Lire la fiche complète →
  </button>
</div>


{/*------- AVIS CLIENTS ----*/ }

<div
  className="
    mt-16
    max-w-[1100px]
    mx-auto

    bg-gradient-to-br
    from-[#fffdf9]
    to-[#f9f4eb]

    rounded-[36px]

    p-8

    border
    border-[#eadfcf]

    shadow-[0_15px_40px_rgba(0,0,0,0.08)]
  "
>

  <h2 className="text-3xl font-bold mb-6">
    Avis clients
  </h2>

  <div className="flex items-center gap-4 mb-6 flex-wrap">
    <span className="text-yellow-500 text-3xl">
      ⭐⭐⭐⭐⭐
    </span>

    <span className="text-2xl font-bold">
      {averageRating}/5
    </span>

    <span className="text-gray-500">
      ({reviews.length} avis)
    </span>
  </div>

  {reviews.length === 0 && (
    <p className="text-gray-500">
      Aucun avis pour le moment.
    </p>
  )}

<div className="mt-4 flex gap-4 flex-wrap">

  <button
    onClick={() =>
      setShowReviewForm(
        !showReviewForm
      )
    }
    className="
      px-6
      py-3
      rounded-2xl
      bg-purple-600
      text-white
      font-semibold
      hover:bg-purple-700
      transition
    "
  >
    Laisser un avis
  </button>

  <button
  onClick={() =>
    setShowReviews(!showReviews)
  }
  className="
    px-6
    py-3
    rounded-2xl
    border
    border-purple-600
    text-purple-600
    font-semibold
  "
>
 {showReviews
  ? "Masquer les avis"
  : `Voir les avis (${reviews.length})`}
</button>

</div>

{showReviewForm && (
  <div className="
    mt-6
    p-6
    rounded-3xl
    bg-gray-50
    space-y-4
  ">
    <input
      type="text"
      placeholder="Votre prénom"
      value={client}
      onChange={(e) =>
        setClient(e.target.value)
      }
      className="
        w-full
        border
        rounded-xl
        p-3
      "
    />

    <select
      value={note}
      onChange={(e) =>
        setNote(Number(e.target.value))
      }
      className="
        w-full
        border
        rounded-xl
        p-3
      "
    >
      <option value={5}>★★★★★</option>
      <option value={4}>★★★★</option>
      <option value={3}>★★★</option>
      <option value={2}>★★</option>
      <option value={1}>★</option>
    </select>

    <textarea
      placeholder="Votre avis"
      value={commentaire}
      onChange={(e) =>
        setCommentaire(
          e.target.value
        )
      }
      rows={4}
      className="
        w-full
        border
        rounded-xl
        p-3
      "
    />

  <button
  onClick={submitReview}
  className="
    px-6
    py-3
    rounded-xl
    bg-purple-600
    text-white
    font-semibold
    hover:bg-purple-700
    transition
  "
>
  Envoyer l'avis
</button> 

  </div>
)}

{showReviews && (
  <div className="mt-8">


    <div className="space-y-6">

    {reviews.map((review) => (
<div
  key={review.id}
  className="
    bg-white
    rounded-3xl
    p-6
    shadow-sm
    border
    border-gray-100
    max-w-[700px]
  "
>      
        <div className="flex items-center gap-3">
  <div className="font-bold text-lg">
    {review.client}
  </div>

  <span className="
    bg-green-100
    text-green-700
    px-3
    py-1
    rounded-full
    text-sm
    font-medium
  ">
    ✓ Vérifié
  </span>
</div>

       <div className="text-yellow-500 text-lg mt-2 mb-2">
          {"⭐".repeat(review.note)}
        </div>

        <p className="text-gray-700">
          {review.commentaire}
        </p>
      </div>
    ))}

  </div>
  </div>
)}

  </div>

 

    {/* DÉCOUVREZ AUSSI */}

<div className="mt-20">

  <h2 className="
    text-3xl
    font-bold
    mb-8
    text-center
  ">
    Découvrez aussi
  </h2>

   <div
  className="
  flex
  gap-5
  overflow-x-auto
  scrollbar-hide
  pb-4

  lg:grid
  lg:grid-cols-3
  lg:max-w-[1100px]
  lg:mx-auto
  "
>

    {products
      .filter(
        (product) =>
          product.id !== selectedProduct.id
      )
      .map((product) => (

        <div
          key={product.id}
          onClick={() =>
            changeProduct(product)
          }
        className="
min-w-[240px]
max-w-[290px]
lg:min-w-0

bg-[#fffdf9]

rounded-[32px]

border-2
border-[#e5d9c7]

shadow-[0_12px_40px_rgba(0,0,0,0.10)]

overflow-hidden

cursor-pointer

transition-all
duration-300

hover:-translate-y-1
hover:shadow-[0_18px_50px_rgba(0,0,0,0.14)]
"
        >

         <div className="overflow-hidden rounded-t-3xl">
  <img
    src={
      product.image ||
      product.images?.[0]
    }
    className="
    w-full
    h-64
    object-cover
    object-center
    transition-transform
    duration-500
    hover:scale-105
    "
  />
</div>

         <div className="p-4">

            <h3 className="
              font-bold
              text-lg
              mb-2
            ">
              {product.name}
            </h3>

             <div className="
              text-purple-600
              text-2xl
              font-bold
              mt-3
              ">
              {product.price}€
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
"
>

{/* FERMER */}
<button
onClick={() => setIsZoomOpen(false)}
className="
absolute
top-6
right-6
text-white
text-5xl
z-20
"
>
✕
</button>

{/* IMAGE PRECEDENTE */}
<button
onClick={(e) => {
e.stopPropagation();

const images =
selectedModel?.images ||
selectedProduct.images ||
[];

const index =
images.indexOf(activeImage);

if (index > 0) {
setSelectedImage(
images[index - 1]
);
}
}}
className="
absolute
left-8
top-1/2
-translate-y-1/2
w-14
h-14
rounded-full
bg-white/10
backdrop-blur
text-white
text-4xl
hover:bg-white/20
z-20
"
>
‹
</button>

<img
src={activeImage}
onClick={(e) => e.stopPropagation()}
className="
max-w-[90vw]
max-h-[90vh]
object-contain
"
/>

{/* IMAGE SUIVANTE */}
<button
onClick={(e) => {
e.stopPropagation();

const images =
selectedModel?.images ||
selectedProduct.images ||
[];

const index =
images.indexOf(activeImage);

if (
index <
images.length - 1
) {
setSelectedImage(
images[index + 1]
);
}
}}
className="
absolute
right-8
top-1/2
-translate-y-1/2
w-14
h-14
rounded-full
bg-white/10
backdrop-blur
text-white
text-4xl
hover:bg-white/20
z-20
"
>
›
</button>

</div>
)}

{/* =======================================
    MODAL DESCRIPTION COMPLÈTE PRODUIT
======================================= */}
{descriptionOpen && (
  <div className="
    fixed
    inset-0
    bg-black/60
    z-50
    flex
    items-center
    justify-center
    p-4
  ">
    <div className="
      bg-white
      rounded-3xl
      max-w-3xl
      w-full
      max-h-[85vh]
      overflow-y-auto
      p-8
      relative
    ">
      <button
        onClick={() =>
          setDescriptionOpen(false)
        }
        className="
          absolute
          top-5
          right-5
          text-2xl
        "
      >
        ✕
      </button>

      <h2 className="text-3xl font-bold mb-6">
        Description complète
      </h2>

      <p className="leading-8 text-gray-700">
        {selectedProduct.description}
      </p>
    </div>
  </div>
)}
  </>
);
   
    }