import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Truck,
  UserCheck
} from 'lucide-react';
import AddOutputModal from '../components/AddOutputModal'; // හෝ ඔබ සතුව ඇති modal නම

const GrnReceipts = () => {
  const [grnList, setGrnList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active User session එක ලබා ගැනීම
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';

  // 1. Department එක අනුව Filter කර GRN ලැයිස්තුව ලබා ගැනීම
  const fetchGrnList = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/grn?department=${user?.department}&role=${user?.role}`);
      setGrnList(res.data);
    } catch (err) {
      console.error('Error fetching GRN records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrnList();
  }, []);

  // 2. GRN එකක් Delete කිරීම
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this GRN entry?')) return;
    try {
      await API.delete(`/grn/${id}`);
      fetchGrnList();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete GRN');
    }
  };

  // Search Filter
  const filteredGrn = grnList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.grnNo?.toLowerCase().includes(q) ||
      item.loadingId?.styleNo?.toLowerCase().includes(q) ||
      item.loadingId?.docNo?.toLowerCase().includes(q) ||
      item.qcInspector?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Daily Production Output & GRN Receipts
            </h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isAdmin 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
              {isAdmin ? 'All Departments' : user?.department}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Inspect finished garments received from sewing plants and record rejects against cut loadings.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Record GRN / Daily Output</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by GRN, Style, Gate Pass, Inspector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Total GRN Issued: <span className="text-slate-900 font-bold">{filteredGrn.length}</span>
        </div>
      </div>

      {/* GRN Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">GRN Details</th>
                <th className="px-4 py-3">Cut Gate Pass & Style</th>
                <th className="px-4 py-3">Sewing Plant</th>
                <th className="px-4 py-3 text-right">Passed Qty</th>
                <th className="px-4 py-3 text-right">Rejected</th>
                <th className="px-4 py-3">QC Inspector & Vehicle</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    Loading GRN receipts...
                  </td>
                </tr>
              ) : filteredGrn.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    No GRN receipts found for this department.
                  </td>
                </tr>
              ) : (
                filteredGrn.map((grn) => (
                  <tr key={grn._id} className="hover:bg-slate-50/80 transition">
                    {/* GRN No & Date */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{grn.grnNo}</div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(grn.receiptDate).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Batch DocNo & Style */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-blue-600">{grn.loadingId?.docNo || 'N/A'}</div>
                      <div className="text-[11px] text-slate-500">{grn.loadingId?.styleNo || 'N/A'}</div>
                    </td>

                    {/* Plant */}
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                      {grn.loadingId?.plantId?.name || 'Assigned Plant'}
                    </td>

                    {/* Passed Qty */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {grn.passedQty?.toLocaleString()} pcs
                      </span>
                    </td>

                    {/* Defect Qty */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {grn.rejectedQty > 0 ? (
                        <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {grn.rejectedQty} pcs
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold">0</span>
                      )}
                    </td>

                    {/* QC & Vehicle */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-slate-800">
                        <UserCheck className="w-3 h-3 text-slate-400" />
                        <span>{grn.qcInspector || 'Unassigned'}</span>
                      </div>
                      {grn.vehicleNo && (
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-0.5">
                          <Truck className="w-3 h-3 text-slate-400" />
                          <span>{grn.vehicleNo}</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(grn._id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="Delete GRN"
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

      {/* Output / GRN Modal */}
      {isModalOpen && (
        <AddOutputModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchGrnList();
          }}
        />
      )}
    </div>
  );
};

export default GrnReceipts;