import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import API from '../api/axios';

const CutLoadingModal = ({ isOpen, onClose, onLoadingAdded }) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    docNo: '',
    department: 'CUT-MEN-01 - Cutting Division 01 (Menswear)',
    plantId: '',
    styleNo: '',
    garmentDesc: '',
    cutQty: '',
    loadDate: today,
    targetDate: '',
    ratioBreakdown: '',
    remarks: ''
  });

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dropdown එකට registered plants load කිරීම
  useEffect(() => {
    if (isOpen) {
      API.get('/plants')
        .then((res) => {
          setPlants(res.data);
          if (res.data.length > 0 && !formData.plantId) {
            setFormData((prev) => ({ ...prev, plantId: res.data[0]._id }));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/loading', formData);
      onLoadingAdded();
      onClose();
      // Form reset
      setFormData({
        docNo: '',
        department: 'CUT-MEN-01 - Cutting Division 01 (Menswear)',
        plantId: plants[0]?._id || '',
        styleNo: '',
        garmentDesc: '',
        cutQty: '',
        loadDate: today,
        targetDate: '',
        ratioBreakdown: '',
        remarks: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch cut batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">New Cut Loading & Dispatch</h3>
            <p className="text-xs text-blue-100">Dispatch cut garment panels to subcontractor sewing plant</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Loading Doc / Gate Pass No *</label>
              <input
                type="text"
                name="docNo"
                required
                value={formData.docNo}
                onChange={handleChange}
                placeholder="e.g. LD-2026-0491"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase font-mono font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Origin Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="CUT-MEN-01 - Cutting Division 01 (Menswear)">CUT-MEN-01 - Cutting Division 01 (Menswear)</option>
                <option value="CUT-LAD-02 - Ladieswear Cutting">CUT-LAD-02 - Ladieswear Cutting</option>
                <option value="CUT-ACT-03 - Knits & Activewear Cutting">CUT-ACT-03 - Knits & Activewear Cutting</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Style / Order Number *</label>
              <input
                type="text"
                name="styleNo"
                required
                value={formData.styleNo}
                onChange={handleChange}
                placeholder="e.g. STY-POLO-8840"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold uppercase"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Garment Item / Description *</label>
              <input
                type="text"
                name="garmentDesc"
                required
                value={formData.garmentDesc}
                onChange={handleChange}
                placeholder="e.g. Men's Cotton Pique Polo Shirt"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subcontractor Plant *</label>
              <select
                name="plantId"
                required
                value={formData.plantId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {plants.length === 0 ? (
                  <option value="">No plants registered</option>
                ) : (
                  plants.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.code} - {p.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cut Quantity (Pcs) *</label>
              <input
                type="number"
                name="cutQty"
                required
                min="1"
                value={formData.cutQty}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-blue-600 text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Loading Date *</label>
              <input
                type="date"
                name="loadDate"
                required
                value={formData.loadDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Color & Size Ratio Breakdown</label>
              <input
                type="text"
                name="ratioBreakdown"
                value={formData.ratioBreakdown}
                onChange={handleChange}
                placeholder="e.g. Navy (S:100, M:200, L:200), Black (S:150, M:250)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expected Completed Date</label>
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Special Sewing & Quality Instructions</label>
            <textarea
              name="remarks"
              rows="2"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="e.g. Use DTM 120 spun thread. Collar rib attached with 4-thread overlock. Standard AQL 1.5 inspection upon delivery."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 transition"
            >
              {loading ? 'Dispatching...' : 'Dispatch Cut Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CutLoadingModal;