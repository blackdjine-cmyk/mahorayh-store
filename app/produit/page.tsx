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
  
    return (
  <>
    <div className="max-w-[1400px] mx-auto px-6 py-8">

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "90px 650px 400px",
    gap: "30px",
  }}
>

    {/* MINIATURES */}
   <div
   className="
   relative
   w-[88px]
   h-[500px]
   flex
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
   z-10
   w-12
   h-12
   rounded-full
   bg-white/90
   backdrop-blur
   shadow-lg
   border
   border-gray-200
   hover:scale-105
   hover:shadow-xl
   transition-all
   duration-300
  "
>
  ▲
</button>

 <div
  ref={miniaturesRef}
  className="
    flex
    flex-col
    gap-3
    mt-10
    mb-10
    overflow-y-auto
    scrollbar-hide
    select-none
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
    select-none
    outline-none
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
   z-10
   w-12
   h-12
   rounded-full
   bg-white/90
   backdrop-blur
   shadow-lg
   border
   border-gray-200
   hover:scale-105
   hover:shadow-xl
   transition-all
   duration-300
  "
>
  ▼
</button>

</div>

        {/* IMAGE PRINCIPALE */}
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
         "
         style={{
         width: "500px",
         height: "500px",
         }}
        >

         {/* flèches temporairement désactivées */}

         <img
         src={activeImage}
         onClick={() => setIsZoomOpen(true)}
         className="
         w-full
         h-full
         object-contain
         cursor-zoom-in
         "
       />

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

            <div className="mt-2 text-green-600">
              ✓ En stock
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md">

            <h3 className="font-semibold text-xl mb-4">
              Choisir un modèle
            </h3>

            <div className="flex flex-wrap gap-3">

              {relatedModels.map((model) => (

                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    setSelectedImage("");
                  }}
                  className={`
                    px-4
                    py-3
                    rounded-2xl
                    border-2
                    ${
                      selectedModel?.id === model.id
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200"
                    }
                  `}
                >
                  {model.model_name}
                </button>

              ))}

            </div>

          </div>

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
  </>
);
   
    }