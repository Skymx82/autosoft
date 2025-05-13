'use client';

export default function DirecteurDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Directeur</h1>
      <div className="bg-green-100 p-4 rounded-lg border border-green-300">
        <p>Cette page est protégée et accessible uniquement aux directeurs.</p>
        <p className="mt-2">Rôle requis: <span className="font-semibold">directeur</span></p>
      </div>
    </div>
  );
}
