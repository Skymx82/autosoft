'use client';

export default function MoniteurDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Moniteur</h1>
      <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
        <p>Cette page est protégée et accessible uniquement aux moniteurs.</p>
        <p className="mt-2">Rôle requis: <span className="font-semibold">moniteur</span></p>
      </div>
    </div>
  );
}
