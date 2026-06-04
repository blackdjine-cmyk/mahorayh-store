export default function PolitiqueConfidentialitePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">

        <h1 className="text-4xl font-bold text-center text-purple-700 mb-12">
          🔒 Politique de confidentialité
        </h1>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            📋 Collecte des données
          </h2>

          <p className="text-lg leading-8">
            Dans le cadre de son activité, Mahorayh Beauté collecte certaines
            données personnelles nécessaires au traitement des commandes,
            à la gestion du compte client et au service après-vente.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            📦 Données collectées
          </h2>

          <p className="text-lg leading-8">
            Les informations pouvant être collectées sont notamment :
          </p>

          <ul className="list-disc pl-8 mt-4 space-y-2 text-lg">
            <li>Nom et prénom</li>
            <li>Adresse de livraison</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone</li>
            <li>Historique des commandes</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            🎯 Utilisation des données
          </h2>

          <p className="text-lg leading-8">
            Les données collectées sont utilisées uniquement pour :
          </p>

          <ul className="list-disc pl-8 mt-4 space-y-2 text-lg">
            <li>Traiter les commandes</li>
            <li>Assurer le suivi des livraisons</li>
            <li>Répondre aux demandes du service client</li>
            <li>Améliorer l'expérience utilisateur</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            🔐 Protection des données
          </h2>

          <p className="text-lg leading-8">
            Mahorayh Beauté met en œuvre toutes les mesures raisonnables
            afin de protéger les données personnelles contre tout accès,
            utilisation ou divulgation non autorisés.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            ⏳ Conservation des données
          </h2>

          <p className="text-lg leading-8">
            Les données personnelles sont conservées uniquement pendant
            la durée nécessaire à la gestion des commandes et aux
            obligations légales applicables.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            ⚖️ Vos droits
          </h2>

          <p className="text-lg leading-8">
            Conformément au RGPD, vous disposez d'un droit :
          </p>

          <ul className="list-disc pl-8 mt-4 space-y-2 text-lg">
            <li>D'accès à vos données</li>
            <li>De rectification</li>
            <li>De suppression</li>
            <li>D'opposition au traitement</li>
            <li>De portabilité des données</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            🍪 Cookies
          </h2>

          <p className="text-lg leading-8">
            Le site peut utiliser des cookies nécessaires à son bon
            fonctionnement et à l'amélioration de l'expérience utilisateur.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            📧 Contact RGPD
          </h2>

          <p className="text-lg leading-8">
            Pour toute demande concernant vos données personnelles :
          </p>

          <p className="mt-4 text-xl font-bold text-purple-700">
            📧 mahorayhbeaute@gmail.com
          </p>
        </section>

      </div>

    </main>
  );
}