'use client';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Admin</h1>
      <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
        <p>Cette page est protégée et accessible uniquement aux administrateurs.</p>
        <p className="mt-2">Rôle requis: <span className="font-semibold">admin</span></p>
      </div>
    </div>
  );
}
