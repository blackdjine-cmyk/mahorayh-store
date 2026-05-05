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
          <div className="bg-[#f8f5f2] p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 text-left">
            <p className="text-yellow-500 mb-2">★★★★★</p>
            <p className="text-gray-700 mb-4">
              "J’avais des taches depuis des années… en 3 semaines ma peau est beaucoup plus nette. Franchement bluffée."
            </p>
            <p className="text-sm font-semibold text-gray-900">Aïcha</p>
            <p className="text-xs text-gray-500">Peau mixte</p>
          </div>

          {/* AVIS 2 */}
          <div className="bg-[#f8f5f2] p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 text-left">
            <p className="text-yellow-500 mb-2">★★★★★</p>
            <p className="text-gray-700 mb-4">
              "Ma peau est plus lumineuse et surtout plus uniforme. J’ai enfin trouvé une routine simple et efficace."
            </p>
            <p className="text-sm font-semibold text-gray-900">Fatou</p>
            <p className="text-xs text-gray-500">Peau sensible</p>
          </div>

          {/* AVIS 3 */}
          <div className="bg-[#f8f5f2] p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 text-left">
            <p className="text-yellow-500 mb-2">★★★★★</p>
            <p className="text-gray-700 mb-4">
              "J’ai testé plein de produits avant… celui-ci fait vraiment la différence. Ma peau est plus douce et éclatante."
            </p>
            <p className="text-sm font-semibold text-gray-900">Mariam</p>
            <p className="text-xs text-gray-500">Peau normale</p>
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