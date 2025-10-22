'use client';

import { useState, useEffect } from 'react';
import { FiAward, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface ExamStats {
  total_exams: number;
  passed: number;
  failed: number;
  success_rate: number;
  previous_rate: number;
  by_category: {
    category: string;
    success_rate: number;
    total: number;
  }[];
}

export default function ExamSuccessRate() {
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamStats();
  }, []);

  const fetchExamStats = async () => {
    try {
      const id_ecole = localStorage.getItem('id_ecole');
      const id_bureau = localStorage.getItem('id_bureau');
      
      const response = await fetch(
        `/directeur/dashboard/api/exam-stats?id_ecole=${id_ecole}&id_bureau=${id_bureau}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques d\'examen:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
          <FiAward className="mr-2 text-blue-600" />
          Taux de réussite aux examens
        </h3>
        <p className="text-center text-gray-500 py-8">Aucune donnée disponible</p>
      </div>
    );
  }

  const trend = stats.success_rate - stats.previous_rate;
  const isTrendingUp = trend >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
        <FiAward className="mr-2 text-blue-600" />
        Taux de réussite aux examens
      </h3>

      {/* Taux global */}
      <div className="text-center mb-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-5xl font-bold text-blue-600">
            {stats.success_rate.toFixed(1)}%
          </span>
          {isTrendingUp ? (
            <FiTrendingUp className="text-green-500 w-8 h-8" />
          ) : (
            <FiTrendingDown className="text-red-500 w-8 h-8" />
          )}
        </div>
        <p className="text-sm text-gray-600">
          {isTrendingUp ? '+' : ''}{trend.toFixed(1)}% par rapport au mois dernier
        </p>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <div>
            <p className="text-gray-500">Réussis</p>
            <p className="font-semibold text-green-600">{stats.passed}</p>
          </div>
          <div>
            <p className="text-gray-500">Échoués</p>
            <p className="font-semibold text-red-600">{stats.failed}</p>
          </div>
          <div>
            <p className="text-gray-500">Total</p>
            <p className="font-semibold text-gray-900">{stats.total_exams}</p>
          </div>
        </div>
      </div>

      {/* Par catégorie */}
      {stats.by_category && stats.by_category.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Par catégorie</h4>
          <div className="space-y-3">
            {stats.by_category.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="font-medium text-gray-900 w-12">{cat.category}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${cat.success_rate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {cat.success_rate.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500">{cat.total} examen(s)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
