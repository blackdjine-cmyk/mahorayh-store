"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProduitPage() {
  const { addToCart } = useCart();
  
  const images = [
    "https://image.noelshack.com/fichiers/2026/18/7/1777803577-le-pack.jpg",
    "https://image.noelshack.com/fichiers/2026/18/7/1777803558-body-lotion.png",
    "https://image.noelshack.com/fichiers/2026/18/7/1777803558-booster-eve-cremme.png",
    "https://image.noelshack.com/fichiers/2026/18/7/1777803558-face-cream.png",
    "https://image.noelshack.com/fichiers/2026/18/7/1777803577-oil.png",
    "https://image.noelshack.com/fichiers/2026/18/7/1777803595-facial-cleanser.png",
    "https://image.noelshack.com/fichiers/2026/18/7/1777803595-serum.png",
    "https://image.noelshack.com/fichiers/2026/18/7/1777803610-soap.png",
    "https://image.noelshack.com/fichiers/2026/18/7/1777803558-avt-apres-black.png",
    "https://image.noelshack.com/fichiers/2026/18/7/1777803576-metisse-avant.png",
    "https://image.noelshack.com/fichiers/2026/18/7/1777803576-m-tisse-apres.png",
  
  ];

   const [selected, setSelected] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);

  const nextImage = () => {
    setSelected((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelected((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseMove = (e: any) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${images[selected]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
      backgroundRepeat: "no-repeat",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* LEFT */}
         <div className="flex justify-center w-full">
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start w-full">

            {/* MINIATURES */}
             <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-w-full md:max-h-[420px]">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelected(index)}
                  className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer border transition ${
                    selected === index
                      ? "border-purple-600"
                      : "border-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* IMAGE + ZOOM */}
            <div className="relative flex gap-6">

              {/* IMAGE PRINCIPALE */}
              <div
                className="relative w-full max-w-[420px] aspect-square rounded-2xl overflow-hidden shadow-lg bg-[#f8f5ef] p-2"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
              >
                <img
                  src={images[selected]}
                  className="w-full h-full object-contain bg-white"
                />

                {/* FLECHE GAUCHE */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                >
                  ←
                </button>

                {/* FLECHE DROITE */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                >
                  →
                </button>
              </div>

              {/* ZOOM */}
              {showZoom && (
              <div
               className="hidden lg:block w-[420px] h-[420px] rounded-xl border shadow absolute left-full ml-6 top-0 z-10"
                style={zoomStyle}
                />
               )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            ⭐ Best-seller
          </span>

          <h1 className="text-3xl font-bold mt-4 mb-4">
            Routine Éclat au Curcuma
          </h1>

          <p className="text-gray-600 mb-6">
            Réduit les taches, illumine le teint et rend la peau éclatante.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-purple-600">
              29,99€
            </span>
            <span className="line-through text-gray-400">
              39,99€
            </span>
          </div>

          <ul className="space-y-2 mb-6 text-gray-700">
            <li>✔ Résultats visibles rapidement</li>
            <li>✔ Produit naturel</li>
            <li>✔ Convient à toutes les peaux</li>
          </ul>

          <button
            onClick={() =>
              addToCart({
                name: "Routine Éclat au Curcuma",
                price: 29.99,
                image: images[selected],
              })
            }
            className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            🛒 Ajouter au panier
          </button>

          <div className="mt-6 text-sm text-gray-500 space-y-1">
            <p>✔ Livraison rapide</p>
            <p>✔ Paiement sécurisé</p>
            <p>✔ Satisfait ou remboursé</p>
          </div>
        </div>

      </div>
    </div>
  );
}