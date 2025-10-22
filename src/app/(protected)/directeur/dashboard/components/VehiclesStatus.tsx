'use client';

import { useState, useEffect } from 'react';
import { FiTruck, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface Vehicle {
  id_vehicule: number;
  immatriculation: string;
  marque: string;
  modele: string;
  statut: string;
  in_use: boolean;
  prochain_controle_technique: string;
}

export default function VehiclesStatus() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const id_ecole = localStorage.getItem('id_ecole');
      const id_bureau = localStorage.getItem('id_bureau');
      
      const response = await fetch(
        `/directeur/dashboard/api/vehicles-status?id_ecole=${id_ecole}&id_bureau=${id_bureau}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (vehicle: Vehicle) => {
    if (vehicle.statut === 'Maintenance') return 'bg-red-100 text-red-800';
    if (vehicle.in_use) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusLabel = (vehicle: Vehicle) => {
    if (vehicle.statut === 'Maintenance') return 'Maintenance';
    if (vehicle.in_use) return 'En service';
    return 'Disponible';
  };

  const isControleTechniqueExpiring = (date: string) => {
    const controleDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((controleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const activeVehicles = vehicles.filter(v => v.statut === 'Actif').length;
  const inUse = vehicles.filter(v => v.in_use).length;
  const maintenance = vehicles.filter(v => v.statut === 'Maintenance').length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiTruck className="mr-2 text-blue-600" />
          État des véhicules
        </h3>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{activeVehicles}</p>
          <p className="text-xs text-gray-600">Actifs</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{inUse}</p>
          <p className="text-xs text-gray-600">En service</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{maintenance}</p>
          <p className="text-xs text-gray-600">Maintenance</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucun véhicule enregistré</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id_vehicule}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiTruck className="text-gray-600 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {vehicle.immatriculation}
                  </p>
                  <p className="text-xs text-gray-500">
                    {vehicle.marque} {vehicle.modele}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isControleTechniqueExpiring(vehicle.prochain_controle_technique) && (
                  <FiAlertCircle className="text-orange-500 w-4 h-4" title="Contrôle technique à renouveler" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle)}`}>
                  {getStatusLabel(vehicle)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
