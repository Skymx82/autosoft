'use client';

export default function ComptableDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Comptable</h1>
      <div className="bg-red-100 p-4 rounded-lg border border-red-300">
        <p>Cette page est protégée et accessible uniquement aux comptables.</p>
        <p className="mt-2">Rôle requis: <span className="font-semibold">comptable</span></p>
      </div>
    </div>
  );
}
