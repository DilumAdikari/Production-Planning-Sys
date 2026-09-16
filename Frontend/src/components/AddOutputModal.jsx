import React, { useState } from 'react';
import { X, Lock, CheckCircle2 } from 'lucide-react';
import API from '../api/axios';

const AddOutputModal = ({ isOpen, onClose, batch, onOutputAdded }) => {
  if (!isOpen || !batch) return null;

  const currentOutput = batch.totalOutput || 0;
  const currentBalance = batch.balanceQty !== undefined ? batch.balanceQty : (batch.cutQty - currentOutput);

  const [formData, setFormData] = useState({
    grnNo: `GRN-${Date.now().toString().slice(-5)}`,
    passedQty: '',
    rejectedQty: 0,
    inspector: '',
    grnDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enterQty = Number(formData.passedQty);

    if (enterQty <= 0) {
      setError('Output quantity must be greater than 0');
      return;
    }

    if (enterQty > currentBalance) {
      setError(`Cannot add more than remaining balance (${currentBalance.toLocaleString()} pcs)`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await API.post('/grn', {
        ...formData,
        loadingId: batch._id,
        passedQty: enterQty,
        rejectedQty: Number(formData.rejectedQty)
      });
      onOutputAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record sewing output');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold">Record Sewing Output (GRN)</h3>
              <p className="text-[11px] text-slate-400">Add finished garments for this dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* READ ONLY: Dispatch Summary Info (Edit කරන්න බෑ) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Batch Details (Locked / Read Only)
              </span>
              <span className="font-mono font-bold text-blue-700 text-xs">{batch.docNo}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Style / Order:</span>
                <strong className="text-slate-800">{batch.styleNo}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Assigned Plant:</span>
                <strong className="text-slate-800">{batch.plant?.name || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Total Cut Dispatched:</span>
                <strong className="text-slate-900 font-bold">{batch.cutQty?.toLocaleString()} pcs</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Current Remaining WIP:</span>
                <strong className="text-amber-600 font-bold">{currentBalance.toLocaleString()} pcs</strong>
              </div>
            </div>
          </div>

          {/* EDITABLE FIELDS: Only Output Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GRN / Slip No *</label>
              <input
                type="text"
                required
                value={formData.grnNo}
                onChange={(e) => setFormData({ ...formData, grnNo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg uppercase font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Receipt Date *</label>
              <input
                type="date"
                required
                value={formData.grnDate}
                onChange={(e) => setFormData({ ...formData, grnDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Passed Output (Pcs) * <span className="text-slate-400 font-normal">(Max {currentBalance})</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max={currentBalance}
                placeholder={`Max ${currentBalance}`}
                value={formData.passedQty}
                onChange={(e) => setFormData({ ...formData, passedQty: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-emerald-700 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rejected / Defect (Pcs)</label>
              <input
                type="number"
                min="0"
                value={formData.rejectedQty}
                onChange={(e) => setFormData({ ...formData, rejectedQty: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-rose-600 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">QC Inspector Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Supun Dilruk (QC In-charge)"
              value={formData.inspector}
              onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Inspection Remarks / Notes</label>
            <input
              type="text"
              placeholder="e.g. 10 pcs re-sewn for skip stitch, balance accepted."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || currentBalance <= 0}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving Output...' : 'Confirm & Save Output'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOutputModal;