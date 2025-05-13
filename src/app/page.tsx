import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="w-full bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">AutoSoft</h1>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Bienvenue sur AutoSoft</h2>
          <p className="text-xl text-gray-600 mb-8">
            La solution complète pour la gestion de votre auto-école
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Gestion des élèves</h3>
              <p className="text-gray-600">Suivez facilement les progrès et les dossiers de vos élèves</p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Planning optimisé</h3>
              <p className="text-gray-600">Organisez les leçons et visualisez les disponibilités en temps réel</p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Comptabilité simplifiée</h3>
              <p className="text-gray-600">Gérez vos finances et générez des rapports détaillés</p>
            </div>
          </div>
          
          <div className="mt-12">
            <Link 
              href="/login" 
              className="px-6 py-3 rounded-md bg-blue-600 text-white text-lg hover:bg-blue-700 transition-colors"
            >
              Accéder à la plateforme
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-50 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p> {new Date().getFullYear()} AutoSoft - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
