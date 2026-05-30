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
          <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <img
              src="https://image.noelshack.com/fichiers/2026/18/6/1777746320-photo-metisse-avant.jpg"
              alt="Avant traitement"
              className="rounded-xl w-full object-cover hover:scale-105 transition duration-500"
            />
            <p className="text-sm text-gray-500 mt-4">
              Avant traitement
            </p>
          </div>

          {/* APRES */}
          <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <img
              src="https://image.noelshack.com/fichiers/2026/18/6/1777746407-photo-m-tisse-apres.jpg"
              alt="Après traitement"
              className="rounded-xl w-full object-cover hover:scale-105 transition duration-500"
            />
            <p className="text-sm text-gray-500 mt-4">
              Après 3 semaines
            </p>
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