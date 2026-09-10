import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import API from '../api/axios';

const RegisterPlantModal = ({ isOpen, onClose, onPlantAdded }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    district: 'Gampaha',
    capacity: '',
    phone: '',
    lat: '7.0840',
    lng: '80.0098',
    googleMapUrl: 'https://maps.google.com/?q=7.084,80.009',
    machineryAudit: '',
    complianceDocUrl: 'Compliance_Audit_2026.pdf'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/plants', formData);
      onPlantAdded(); // List එක refresh කරන්න
      onClose(); // Modal එක close කරන්න
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save plant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Register Subcontractor Sewing Plant</h3>
            <p className="text-xs text-slate-400">Add plant capacity, coordinates, machinery audits and compliance docs</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Plant Code *</label>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. PL-KANDY-01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Plant / Subcontractor Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Apex Stitch Lanka (Pvt) Ltd"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">District / City *</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Gampaha">Gampaha</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Galle">Galle</option>
                <option value="Kegalle">Kegalle</option>
                <option value="Ratnapura">Ratnapura</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Daily Capacity (Garments/Day) *</label>
              <input
                type="number"
                name="capacity"
                required
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g. 2500"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+94 33 2284920"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Coordinates Box */}
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 space-y-3">
            <span className="font-bold text-blue-900 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Google Location & Coordinates</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Latitude (SL: ~6.0 to 9.5)</label>
                <input
                  type="number"
                  step="any"
                  name="lat"
                  required
                  value={formData.lat}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Longitude (SL: ~79.8 to 81.8)</label>
                <input
                  type="number"
                  step="any"
                  name="lng"
                  required
                  value={formData.lng}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Google Maps URL / Location Pin</label>
              <input
                type="url"
                name="googleMapUrl"
                value={formData.googleMapUrl}
                onChange={handleChange}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Machine Breakdown / Line Details</label>
            <textarea
              name="machineryAudit"
              rows="2"
              value={formData.machineryAudit}
              onChange={handleChange}
              placeholder="e.g. Single Needle: 60, 4-Thread Overlock: 25, Flatlock: 12, Button Hole/Attach: 6, Feed-off-Arm: 4"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Factory Compliance & Audit PDF Document</label>
            <input
              type="file"
              accept=".pdf"
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-[10px] text-slate-400 mt-1">Upload audit certification, WRAP/SEDEX certificate or Subcontracting Agreement.</p>
          </div>

          {/* Buttons */}
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPlantModal;