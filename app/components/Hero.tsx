import Link from "next/link";
export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#faf7f2] to-[#f3ede6] py-10 md:py-20 px-4 md:px-6">

      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl p-6 md:p-14">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* TEXTE */}
          <div>

            {/* BADGE */}
            <p className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔥 Produit le plus apprécié de nos clientes
            </p>

            {/* TITRE */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-3">
              Révélez l'éclat naturel de votre peau
            </h1>

            {/* SOUS TITRE */}
            <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-3">
              Routine Éclat au Curcuma
            </h2>

            {/* ETOILES */}
            <p className="text-yellow-600 font-semibold mb-6">
              ⭐⭐⭐⭐⭐ Produit préféré de nos clientes
            </p>

            {/* IMAGE MOBILE */}
            <div className="block md:hidden mb-6">
              <img
                src="https://image.noelshack.com/fichiers/2026/18/6/1777727887-le-pack.jpg"
                alt="Mahorayh Beauté"
                className="w-full rounded-[30px] shadow-xl"
              />
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Une routine au curcuma pensée pour réduire les taches,
              unifier le teint et révéler l’éclat naturel des peaux
              noires et métissées.
            </p>

            {/* BENEFICES */}
            <div className="space-y-3 text-gray-700 font-medium mb-8">
              <p>✨ Réduit visiblement les taches</p>
              <p>✨ Teint plus uniforme</p>
              <p>✨ Éclat naturel retrouvé</p>
            </div>

            {/* BLOCS CONFIANCE */}
            <div className="flex flex-wrap gap-4 mb-8">

              <div className="bg-purple-50 px-5 py-3 rounded-2xl shadow-sm">
                ⭐⭐⭐⭐⭐
                <br />
                <span className="text-sm">
                  Avis clients
                </span>
              </div>

              <div className="bg-green-50 px-5 py-3 rounded-2xl shadow-sm">
                🚚 Livraison rapide
              </div>

              <div className="bg-yellow-50 px-5 py-3 rounded-2xl shadow-sm">
                🔒 Paiement sécurisé
              </div>

            </div>

            {/* BOUTON */}
           <Link href="/produit">
           <button
            className="
            w-full
            md:w-auto
            bg-gradient-to-r
            from-fuchsia-600
           to-purple-700
           text-white
           px-12
           py-5
           rounded-full
           font-bold
           text-lg
           shadow-xl
           hover:scale-105
           hover:shadow-2xl
           transition-all
           duration-300
          "
         >
         ✨ Découvrir la routine
         </button>
        </Link>

            {/* PREUVES */}
             <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-gray-600 font-medium">
              <span>✔️ Résultats visibles</span>
              <span>✔️ Sans routine compliquée</span>
              <span>✔️ Peaux sensibles</span>
            </div>

          </div>

          {/* IMAGE DESKTOP */}
          <div className="hidden md:flex justify-center self-start">
            <img
              src="https://image.noelshack.com/fichiers/2026/18/6/1777727887-le-pack.jpg"
              alt="Mahorayh Beauté"
              className="w-full max-w-[520px] rounded-[30px] shadow-2xl"
            />
          </div>

        </div>

      </div>

    </section>
  );
}