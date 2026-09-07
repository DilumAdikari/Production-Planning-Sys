import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import SriLankaMap from '../components/SriLankaMap';
import { Factory, Truck, CheckCircle2, Clock } from 'lucide-react';

const Dashboard = () => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    API.get('/analytics/plant-wip')
      .then((res) => setPlants(res.data))
      .catch((err) => console.error(err));
  }, []);

  const totalLoaded = plants.reduce((acc, p) => acc + (p.totalCutLoaded || 0), 0);
  const totalPassed = plants.reduce((acc, p) => acc + (p.totalPassed || 0), 0);
  const totalWip = plants.reduce((acc, p) => acc + (p.wipBalance || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Plants</p>
            <h4 className="text-2xl font-bold text-slate-900 mt-1">{plants.length}</h4>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Factory className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Loaded Pcs</p>
            <h4 className="text-2xl font-bold text-blue-600 mt-1">{totalLoaded.toLocaleString()}</h4>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Truck className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">GRN Passed</p>
            <h4 className="text-2xl font-bold text-emerald-600 mt-1">{totalPassed.toLocaleString()}</h4>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Active WIP</p>
            <h4 className="text-2xl font-bold text-amber-600 mt-1">{totalWip.toLocaleString()}</h4>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-5 h-5" /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SriLankaMap plants={plants} />
        </div>
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-3">Capacity vs WIP Load</h3>
          <div className="space-y-3 overflow-y-auto max-h-[380px]">
            {plants.map((p) => (
              <div key={p._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="font-bold text-amber-600">{(p.wipBalance || 0).toLocaleString()} pcs</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{p.district} • Cap: {p.capacity}/day</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;