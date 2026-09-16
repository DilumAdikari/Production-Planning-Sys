import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, TrendingUp, Calendar, AlertCircle, History } from 'lucide-react';
import API from '../api/axios';

const DailyOutputTrackingModal = ({ isOpen, onClose, batch, onOutputLogged }) => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [formData, setFormData] = useState({
    grnNo: '',
    passedQty: '',
    rejectedQty: 0,
    inspector: '',
    grnDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Daily GRN History එක load කිරීම
  const loadHistory = async () => {
    if (!batch?._id) return;
    setLoadingHistory(true);
    try {
      const res = await API.get(`/grn/loading/${batch._id}`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (isOpen && batch) {
      loadHistory();
      setFormData({
        grnNo: `GRN-${Date.now().toString().slice(-5)}`,
        passedQty: '',
        rejectedQty: 0,
        inspector: '',
        grnDate: new Date().toISOString().split('T')[0],
        remarks: ''
      });
      setError('');
    }
  }, [isOpen, batch]);

  if (!isOpen || !batch) return null;

  // Real-time Calculations
  const totalCompleted = history.reduce((sum, item) => sum + (item.passedQty || 0), 0);
  const totalRejected = history.reduce((sum, item) => sum + (item.rejectedQty || 0), 0);
  const remainingWip = Math.max(0, batch.cutQty - (totalCompleted + totalRejected));

  // Unique sewing days count & Daily average rate calculation
  const uniqueDays = new Set(history.map(h => new Date(h.grnDate).toISOString().split('T')[0])).size;
  const avgDailyOutput = uniqueDays > 0 ? Math.round(totalCompleted / uniqueDays) : 0;
  const estDaysLeft = avgDailyOutput > 0 ? Math.ceil(remainingWip / avgDailyOutput) : '—';

  const handleAddOutput = async (e) => {
    e.preventDefault();
    const enterQty = Number(formData.passedQty);

    if (enterQty <= 0) {
      setError('Output quantity must be greater than 0');
      return;
    }
    if (enterQty > remainingWip) {
      setError(`Quantity exceeds current remaining WIP (${remainingWip.toLocaleString()} pcs)`);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await API.post('/grn', {
        ...formData,
        loadingId: batch._id,
        passedQty: enterQty,
        rejectedQty: Number(formData.rejectedQty) || 0
      });
      loadHistory();
      onOutputLogged();
      setFormData(prev => ({
        ...prev,
        grnNo: `GRN-${Date.now().toString().slice(-5)}`,
        passedQty: '',
        remarks: ''
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record daily output');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-100 my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Subcontractor Daily Sewing Progress</h3>
              <p className="text-xs text-slate-400">
                Gate Pass: <span className="font-mono text-white">{batch.docNo}</span> | Style: <span className="text-blue-300 font-semibold">{batch.styleNo}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Total Cut Assigned</span>
              <strong className="text-base text-slate-800 font-bold">{batch.cutQty?.toLocaleString()} pcs</strong>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-emerald-700 block font-medium">Total Output Recv</span>
              <strong className="text-base text-emerald-700 font-bold">{totalCompleted.toLocaleString()} pcs</strong>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="text-amber-700 block font-medium">Remaining WIP</span>
              <strong className="text-base text-amber-700 font-bold">{remainingWip.toLocaleString()} pcs</strong>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
              <span className="text-blue-700 block font-medium">Daily Output Rate</span>
              <strong className="text-base text-blue-700 font-bold">{avgDailyOutput.toLocaleString()} pcs/day</strong>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
              <span className="text-purple-700 block font-medium">Est. Completion</span>
              <strong className="text-base text-purple-700 font-bold">
                {remainingWip === 0 ? 'Completed' : `${estDaysLeft} days left`}
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Form to Enter Daily Sewing Output */}
            <div className="lg:col-span-5 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Record Today's Finished Output
              </h4>

              {error && (
                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs mb-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleAddOutput} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">GRN / Delivery Slip No *</label>
                  <input
                    type="text"
                    required
                    value={formData.grnNo}
                    onChange={(e) => setFormData({ ...formData, grnNo: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg uppercase font-mono font-bold bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Date Produced *</label>
                    <input
                      type="date"
                      required
                      value={formData.grnDate}
                      onChange={(e) => setFormData({ ...formData, grnDate: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Passed Output *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={remainingWip}
                      placeholder={`Max ${remainingWip}`}
                      value={formData.passedQty}
                      onChange={(e) => setFormData({ ...formData, passedQty: e.target.value })}
                      className="w-full px-3 py-1.5 border border-emerald-300 rounded-lg bg-white font-bold text-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Rejected Pcs</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.rejectedQty}
                      onChange={(e) => setFormData({ ...formData, rejectedQty: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white text-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">QC Inspector *</label>
                    <input
                      type="text"
                      required
                      placeholder="Inspector name"
                      value={formData.inspector}
                      onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-600 mb-1">Remarks</label>
                  <input
                    type="text"
                    placeholder="Batch observations..."
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || remainingWip <= 0}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 transition"
                >
                  {submitting ? 'Saving...' : 'Add Daily Sewing Batch'}
                </button>
              </form>
            </div>

            {/* Right Column: Daily Sewing Output History Log */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-blue-600" />
                  Daily Sewing Delivery Logs ({history.length})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Plant: {batch.plantId?.name || batch.plant?.name}</span>
              </div>

              <div className="overflow-x-auto flex-1 max-h-[300px] overflow-y-auto">
                <table className="min-w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">GRN No</th>
                      <th className="px-3 py-2 text-emerald-700 font-bold">Passed Pcs</th>
                      <th className="px-3 py-2 text-rose-600">Rej</th>
                      <th className="px-3 py-2">QC Auditor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {loadingHistory ? (
                      <tr><td colSpan="5" className="text-center py-6 text-slate-400">Loading daily log history...</td></tr>
                    ) : history.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-6 text-slate-400">No output batches recorded yet.</td></tr>
                    ) : (
                      history.map((h) => (
                        <tr key={h._id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                            {new Date(h.grnDate).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2 font-mono font-semibold text-blue-600">{h.grnNo}</td>
                          <td className="px-3 py-2 font-bold text-emerald-600">+{h.passedQty?.toLocaleString()}</td>
                          <td className="px-3 py-2 text-rose-600">{h.rejectedQty || 0}</td>
                          <td className="px-3 py-2 text-slate-500">{h.inspector}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default DailyOutputTrackingModal;