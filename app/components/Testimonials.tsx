export default function Testimonials() {
  return (
    <section className="bg-white py-20 px-6">

      <div className="max-w-6xl mx-auto text-center">

        {/* TITRE */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Elles ont retrouvé leur éclat ✨
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Des résultats visibles et naturels sur des peaux noires et métissées.
        </p>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* AVIS 1 */}

          <div className="bg-[#f8f5f2] p-6 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300 text-left border border-transparent hover:border-purple-200">
          <div className="flex items-center gap-2 mb-3">

         <p className="text-sm font-semibold text-gray-900">
           Aïcha
         </p>

         <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold shadow-sm">
         ✓ Vérifié
         </span>

        </div>                 
            <div className="flex items-center gap-1 text-yellow-500 mb-3">
              ★★★★★
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              "J’avais des taches depuis des années… en 3 semaines ma peau est beaucoup plus nette. Franchement bluffée."
            </p>

          </div>

          {/* AVIS 2 */}
          <div className="bg-[#f8f5f2] p-6 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300 text-left border border-transparent hover:border-purple-200">
           <div className="flex items-center gap-2 mb-3">

           <p className="text-sm font-semibold text-gray-900">
           Fatou
           </p>

          <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold shadow-sm">
           ✓ Vérifié
          </span>        
           

           </div>                 
            <div className="flex items-center gap-1 text-yellow-500 mb-3">
              ★★★★★
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              "Ma peau est plus lumineuse et surtout plus uniforme. J’ai enfin trouvé une routine simple et efficace."
            </p>

          </div>

          {/* AVIS 3 */}
          <div className="bg-[#f8f5f2] p-6 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300 text-left border border-transparent hover:border-purple-200">
           <div className="flex items-center gap-2 mb-3">

           <p className="text-sm font-semibold text-gray-900">
            Mariam
           </p>

           <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold shadow-sm">
            ✓ Vérifié
           </span>

            </div>                   
            <div className="flex items-center gap-1 text-yellow-500 mb-3">
              ★★★★★
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              "J’ai testé plein de produits avant… celui-ci fait vraiment la différence. Ma peau est plus douce et éclatante."
            </p>

          </div>

        </div>

        {/* TEXTE RASSURANT */}
        <p className="text-sm text-gray-500 mt-10">
          ✨ Résultats visibles dès les premières semaines
        </p>

      </div>
    </section>
  );
}