import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import RegisterPlantModal from '../components/RegisterPlantModal';
import { Plus, Trash2, MapPin } from 'lucide-react';

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlants = async () => {
    try {
      const res = await API.get('/plants');
      setPlants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      try {
        await API.delete(`/plants/${id}`);
        fetchPlants();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Subcontractor Sewing Plants</h2>
          <p className="text-xs text-slate-500">Manage external sewing factories, coordinates, and compliance.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Plant</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <div key={plant._id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">
                  {plant.code}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{plant.name}</h3>
                <p className="text-xs text-slate-500 flex items-center mt-0.5">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {plant.district} District
                </p>
              </div>
              <button onClick={() => handleDelete(plant._id)} className="text-slate-400 hover:text-rose-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg text-xs flex justify-between">
              <span className="text-slate-500">Daily Capacity:</span>
              <strong className="text-slate-800">{plant.capacity.toLocaleString()} pcs/day</strong>
            </div>

            {plant.machineryAudit && (
              <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg font-mono">
                {plant.machineryAudit}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modal Integration */}
      <RegisterPlantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlantAdded={fetchPlants}
      />
    </div>
  );
};

export default Plants;