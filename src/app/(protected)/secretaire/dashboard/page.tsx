'use client';

export default function SecretaireDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Secrétaire</h1>
      <div className="bg-purple-100 p-4 rounded-lg border border-purple-300">
        <p>Cette page est protégée et accessible uniquement aux secrétaires.</p>
        <p className="mt-2">Rôle requis: <span className="font-semibold">secretaire</span></p>
      </div>
    </div>
  );
}
