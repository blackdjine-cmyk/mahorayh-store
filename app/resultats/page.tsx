export default function ResultatsPage() {
  return (
    <section className="bg-[#f9f6f1] min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* TITRE */}
        <div className="text-center mb-16">

          <p className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            ✨ Résultats visibles
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Une peau plus nette,
            <span className="text-purple-700"> naturellement</span>
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Découvrez les résultats obtenus après plusieurs semaines
            d’utilisation de notre routine au curcuma.
          </p>

        </div>

        {/* AVANT APRÈS */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">

          {/* AVANT */}
          <div className="bg-white rounded-3xl shadow-md overflow-hidden">

            <img
              src="https://image.noelshack.com/fichiers/2026/18/7/1777803576-metisse-avant.png"
              className="w-full object-cover"
            />

            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">
                Avant
              </h3>

              <p className="text-gray-600">
                Taches visibles et teint irrégulier.
              </p>
            </div>

          </div>

          {/* APRÈS */}
          <div className="bg-white rounded-3xl shadow-md overflow-hidden">

            <img
              src="https://image.noelshack.com/fichiers/2026/18/7/1777803576-m-tisse-apres.png"
              className="w-full object-cover"
            />

            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2 text-purple-700">
                Après 3 semaines
              </h3>

              <p className="text-gray-600">
                Peau plus lumineuse et teint plus uniforme.
              </p>
            </div>

          </div>

        </div>

        {/* TEXTE */}
        <div className="bg-white rounded-3xl p-8 shadow-md text-center">

          <h2 className="text-3xl font-bold mb-6">
            Pourquoi ça fonctionne ?
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Notre routine associe des ingrédients naturels reconnus
            pour aider à réduire les taches, purifier la peau
            et révéler progressivement son éclat naturel,
            sans agresser les peaux noires et métissées.
          </p>

        </div>

      </div>
    </section>
  );
}