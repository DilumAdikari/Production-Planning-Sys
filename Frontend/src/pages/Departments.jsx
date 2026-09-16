import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Building2, Plus, Trash2, ShieldAlert } from 'lucide-react';

const Departments = () => {
  // Local storage එකෙන් දැනට login වූ user ගේ role එක පරීක්ෂා කිරීම
  const user = JSON.parse(localStorage.getItem('user') || '{"role": "admin"}');
  const isAdmin = user?.role === 'admin';

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    division: 'Cutting',
    inChargeName: '',
    phone: ''
  });

  const fetchDepartments = async () => {
    try {
      const res = await API.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDepartments();
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/departments', formData);
      setFormData({ code: '', name: '', division: 'Cutting', inChargeName: '', phone: '' });
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save department');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await API.delete(`/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Admin නොවෙයි නම් Access Denied පෙන්වීම
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-3">
        <ShieldAlert className="w-12 h-12 text-rose-500" />
        <h2 className="text-lg font-bold text-slate-800">Access Denied</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Department Master configuration is restricted strictly to System Administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Department Master Configuration
          </h2>
          <p className="text-xs text-slate-500">
            Configure internal cutting & production divisions to isolate work data per logged-in user
          </p>
        </div>
        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
          Admin Portal
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-blue-600" />
            Register Internal Department
          </h3>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dept Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. CUT-MEN-01"
                className="w-full px-3 py-2 border rounded-lg uppercase font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department / Line Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Menswear Cutting Bay A"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Division</label>
              <select
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Cutting">Cutting</option>
                <option value="Sewing">Sewing</option>
                <option value="Finishing">Finishing</option>
                <option value="Packing">Packing</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">In-Charge / Supervisor</label>
              <input
                type="text"
                value={formData.inChargeName}
                onChange={(e) => setFormData({ ...formData, inChargeName: e.target.value })}
                placeholder="e.g. Nuwan Kumara"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Intercom / Mobile</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. Ext 204 / 077..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 transition"
            >
              {loading ? 'Registering...' : 'Add Department'}
            </button>
          </form>
        </div>

        {/* Departments List Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <span className="font-bold text-xs text-slate-800">
              Configured Active Departments ({departments.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-left">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Department Name</th>
                  <th className="px-4 py-3">Division</th>
                  <th className="px-4 py-3">In-Charge</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      No departments registered yet. Use the form to register departments.
                    </td>
                  </tr>
                ) : (
                  departments.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">{d.code}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{d.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                          {d.division}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{d.inChargeName || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{d.phone || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(d._id)}
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
      </div>
    </div>
  );
};

export default Departments;