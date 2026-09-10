import { useState, useEffect } from 'react';
import API from '../api/axios';
import CutLoadingModal from '../components/CutLoadingModal';
import { Plus, Trash2 } from 'lucide-react';

const CutLoading = () => {
  const [loadings, setLoadings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLoadings = async () => {
    try {
      const res = await API.get('/loading');
      setLoadings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLoadings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cut dispatch record?')) {
      try {
        await API.delete(`/loading/${id}`);
        fetchLoadings();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Factory Cut Loading & Dispatches</h2>
          <p className="text-xs text-slate-500">Log cut parts dispatched with gate pass numbers and subcontractor allocations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch New Cut Batch</span>
        </button>
      </div>

      {/* Dispatches Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-left">
              <tr>
                <th className="px-4 py-3">Doc / GP No</th>
                <th className="px-4 py-3">Style / Order No</th>
                <th className="px-4 py-3">Assigned Subcon Plant</th>
                <th className="px-4 py-3">Cut Qty (Pcs)</th>
                <th className="px-4 py-3">Dispatch Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loadings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-400">
                    No cut dispatches logged yet. Click "Dispatch New Cut Batch" to add.
                  </td>
                </tr>
              ) : (
                loadings.map((load) => (
                  <tr key={load._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{load.docNo}</td>
                    <td className="px-4 py-3">
                      <strong className="block text-slate-900">{load.styleNo}</strong>
                      <span className="text-[11px] text-slate-500">{load.garmentDesc}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">{load.plantId?.name || 'N/A'}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{load.plantId?.code}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 text-sm">
                      {load.cutQty.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(load.loadDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {load.status || 'In-Sewing'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(load._id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <CutLoadingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoadingAdded={fetchLoadings}
      />
    </div>
  );
};

export default CutLoading;