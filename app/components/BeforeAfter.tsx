import Link from "next/link";
export default function BeforeAfter() {
  return (
    <section className="bg-[#f8f5f2] py-20 px-6">
      
      <div className="max-w-6xl mx-auto text-center">
        
        {/* TITRE */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Des résultats visibles, sans compromis
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Notre routine agit en douceur pour corriger les taches, unifier le teint et révéler l’éclat naturel de votre peau.
        </p>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* AVANT */}
          <div className="bg-white p-5 rounded-[30px] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300">
            <img
              src="avant-image.png"
              alt="Avant traitement"
              className="rounded-xl w-full object-cover hover:scale-105 transition duration-500"
            />
            <div className="mt-5">

           <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-bold">
            AVANT
           </span>

           <div className="mt-6 space-y-4 text-gray-700 text-left max-w-[220px] mx-auto">

           <p>❌ Taches pigmentaires</p>

           <p>❌ Teint irrégulier</p>

           <p>❌ Manque d'éclat</p>

           </div>

            </div>
          </div>

         {/* APRES */}
         <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">

         <div className="relative">
         <img
         src="apres-image.png"
         alt="Après traitement"
         className="rounded-xl w-full object-cover hover:scale-105 transition duration-500"
         />

         </div>

         <div className="text-center mt-5">
         <span className="inline-block bg-green-100 text-green-700 font-bold px-5 py-2 rounded-full">
          APRÈS
         </span>
         </div>

         <div className="mt-6 space-y-4 text-gray-700 text-left max-w-[220px] mx-auto">
         <p>✅ Peau plus lumineuse</p>
         <p>✅ Teint uniforme</p>
         <p>✅ Éclat naturel</p>
         </div>

         </div>

        </div>

        {/* TEXTE RASSURANT */}
        <p className="text-center text-sm text-gray-500 mt-10">
          ✨ Résultats progressifs et naturels, sans agresser la peau
        </p>

        {/* MINI PREUVE */}
        <p className="text-xs text-gray-400 mt-2">
          ✔ Sans routine compliquée • ✔ Adapté aux peaux sensibles
        </p>

        {/* TEXTE DE CONFIANCE */}
         <p className="text-center text-sm text-gray-600 mt-8 font-medium">
         ✨ Des résultats visibles avec une utilisation régulière de la routine
         </p>

        {/* BOUTON */}
        <div className="mt-8">
        <Link href="/produit">
        <button className="bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
      ✨ Essayer la routine
        </button>
      </Link>
     </div>

      </div>
    </section>
  );
}