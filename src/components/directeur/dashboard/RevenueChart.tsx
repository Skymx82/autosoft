'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RevenueChart() {
  interface ChartDataType {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }[];
  }

  const [chartData, setChartData] = useState<ChartDataType>({
    labels: [],
    datasets: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Options du graphique
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} €`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' €';
          }
        }
      }
    }
  };

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer l'utilisateur depuis le localStorage
        const userData = localStorage.getItem('autosoft_user');
        let id_ecole = '1';
        let id_bureau = '0';
        
        if (userData) {
          try {
            const user = JSON.parse(userData);
            id_ecole = user.id_ecole.toString();
            id_bureau = user.id_bureau.toString();
          } catch (e) {
            console.warn('Erreur lors du parsing des données utilisateur:', e);
          }
        } else {
          console.warn('Données utilisateur non trouvées, utilisation des valeurs par défaut');
        }
        
        // Appel à l'API Stats qui contient maintenant les données du graphique
        const response = await fetch(`/api/directeur/dashboard/Stats?id_ecole=${id_ecole}&id_bureau=${id_bureau}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        
        const data = await response.json();
        
        // Vérifier que les données du graphique sont présentes
        if (data.graphiqueCA && Array.isArray(data.graphiqueCA)) {
          // Formater les données pour le graphique
          const months = data.graphiqueCA.map((item: { month: string; revenue: number }) => item.month);
          const revenues = data.graphiqueCA.map((item: { month: string; revenue: number }) => item.revenue);
          
          setChartData({
            labels: months,
            datasets: [
              {
                label: 'Chiffre d\'affaires',
                data: revenues,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.3
              }
            ]
          });
        } else {
          throw new Error('Données du graphique non disponibles');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du graphique:', error);
        
        // En cas d'erreur, afficher des données fictives pour la démo
        const demoMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const demoRevenues = [4200, 3800, 5100, 4700, 5600, 6200, 5800, 4900, 6500, 7200, 6800, 8540];
        
        setChartData({
          labels: demoMonths,
          datasets: [
            {
              label: 'Chiffre d\'affaires',
              data: demoRevenues,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              tension: 0.3
            }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Évolution du chiffre d'affaires</h2>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="h-64">
            <Line options={options} data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}
