export default function Hero() {
  return (
    <section className="bg-[#f5efe6] py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* TEXTE */}
         <div className="max-w-xl order-2 md:order-1">

          {/* BADGE */}
          <p className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            ✨ Soins naturels pour peaux noires & métissées
          </p>

          {/* TITRE */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Une peau éclatante, <br />
            <span className="text-yellow-600 italic font-semibold">
              naturellement
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-600 text-lg mb-6">
            Une routine au curcuma pensée pour réduire les taches, unifier le teint et révéler l’éclat naturel des peaux noires et métissées.
          </p>

          {/* BENEFICES */}
          <div className="mb-6 space-y-2 text-gray-700 font-medium">
            <p>✨ Réduit visiblement les taches</p>
            <p>✨ Teint plus uniforme</p>
            <p>✨ Éclat naturel retrouvé</p>
          </div>

          {/* BOUTON */}
          <button className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition duration-300">
            ✨ Découvrir la routine
          </button>

          {/* PREUVE */}
          <p className="text-sm text-gray-500 mt-4 flex flex-wrap gap-6 items-center">
            <span className="flex items-center gap-1">✔️ Résultats visibles</span>
            <span className="flex items-center gap-1">✔️ Sans routine compliquée</span>
            <span className="flex items-center gap-1">✔️ Peaux sensibles</span>
          </p>

        </div>

        {/* IMAGE */}
        <div className="relative order-1 md:order-2">
          <img
            src="https://image.noelshack.com/fichiers/2026/18/6/1777727887-le-pack.jpg"
            alt="Mahorayh Beauté produits"
            className="w-full object-cover rounded-[30px] shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
}