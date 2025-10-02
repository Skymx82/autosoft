"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  // États pour le formulaire de définition du mot de passe
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Vérifier si l'URL contient un token d'invitation
  useEffect(() => {
    // Afficher l'URL complète pour débogage
    console.log("URL complète:", window.location.href);
    
    // Fonction pour extraire les paramètres du fragment d'URL (après le #)
    const getHashParams = () => {
      if (!window.location.hash) return {};
      
      const hash = window.location.hash.substring(1);
      const params: Record<string, string> = {};
      
      hash.split("&").forEach(param => {
        const [key, value] = param.split("=");
        if (key && value) {
          params[key] = decodeURIComponent(value);
        }
      });
      
      return params;
    };
    
    // Fonction pour extraire les paramètres de l'URL (après le ?)
    const getQueryParams = () => {
      const params: Record<string, string> = {};
      const searchParams = new URLSearchParams(window.location.search);
      
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      return params;
    };
    
    const hashParams = getHashParams();
    const queryParams = getQueryParams();
    
    console.log("Hash params détaillés:", hashParams);
    
    // Détecter le token d'accès dans le fragment d'URL
    if (hashParams.access_token) {
      console.log("Token d'accès détecté dans le fragment d'URL!");
      setAccessToken(window.location.hash);
      setShowPasswordForm(true);
      return;
    }
    
    // Détecter le type d'invitation (fragment ou paramètres de requête)
    if (hashParams.type === "invite" || queryParams.type === "invite") {
      console.log("Invitation détectée!");
      console.log("Hash params:", hashParams);
      console.log("Query params:", queryParams);
      
      // Stocker l'URL complète pour la vérification
      setAccessToken(window.location.href);
      setShowPasswordForm(true);
    }
  }, []);
  // Fonction pour gérer la soumission du formulaire de mot de passe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation des mots de passe
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    if (!accessToken) {
      setError('Token d\'invitation manquant.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Vérifier si accessToken contient un fragment d'URL
      if (accessToken.includes('#')) {
        // Extraire les paramètres du fragment d'URL
        const fragmentIndex = accessToken.indexOf('#');
        const hash = accessToken.substring(fragmentIndex + 1);
        const params: Record<string, string> = {};
        
        hash.split("&").forEach(param => {
          const [key, value] = param.split("=");
          if (key && value) {
            params[key] = decodeURIComponent(value);
          }
        });
        
        console.log('Paramètres extraits du fragment d\'URL:', params);
        
        if (params.access_token) {
          console.log('Token d\'accès trouvé, tentative de création de session');
          
          // Utiliser le token d'accès pour créer une session
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token || ''
          });
          
          if (sessionError) {
            console.error('Erreur lors de la création de la session:', sessionError);
            throw sessionError;
          }
          
          console.log('Session créée avec succès, mise à jour du mot de passe');
          
          // Mettre à jour le mot de passe
          const { error } = await supabase.auth.updateUser({
            password
          });
          
          if (error) {
            console.error('Erreur lors de la mise à jour du mot de passe:', error);
            throw error;
          }
          
          console.log('Mot de passe mis à jour avec succès!');
        } else {
          throw new Error('Token d\'accès non trouvé dans le fragment d\'URL');
        }
      } else {
        throw new Error('Format de token non pris en charge');
      }
      
      setSuccess(true);
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err: any) {
      console.error('Erreur lors de la définition du mot de passe:', err);
      setError(err.message || 'Une erreur est survenue lors de la définition du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-center">
      {/* Navigation Bar */}
      <header className="w-full bg-white shadow-sm py-4 px-6 text-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">AutoSoft</h1>
          </div>
          <div className="flex gap-4">
            {!showPasswordForm && (
              <Link 
                href="/login" 
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        {showPasswordForm ? (
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-gray-800">
            <h1 className="text-2xl font-bold mb-6 text-center">Définir votre mot de passe</h1>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {success ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Votre mot de passe a été défini avec succès. Vous allez être redirigé vers la page de connexion...
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                >
                  {loading ? 'Chargement...' : 'Définir le mot de passe'}
                </button>
              </form>
            )}
          </div>
        ) : (
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
        )}
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
