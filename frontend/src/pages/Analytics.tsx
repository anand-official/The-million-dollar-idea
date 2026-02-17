import { useState, useEffect } from 'react';
import api from '../services/api';

interface AnalyticsItem {
  _id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  data: {
    metrics: Array<{
      key: string;
      value: number;
      unit?: string;
      trend?: string;
    }>;
  };
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'sales',
    metrics: [
      { key: 'Revenue', value: 0, unit: 'USD', trend: 'up' },
      { key: 'Customers', value: 0, unit: '', trend: 'stable' }
    ]
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnalytics = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/analytics', {
        name: formData.name,
        type: formData.type,
        data: {
          metrics: formData.metrics,
          timeRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            end: new Date()
          }
        }
      });
      setShowCreateForm(false);
      fetchAnalytics();
      setFormData({
        name: '',
        type: 'sales',
        metrics: [
          { key: 'Revenue', value: 0, unit: 'USD', trend: 'up' },
          { key: 'Customers', value: 0, unit: '', trend: 'stable' }
        ]
      });
    } catch (error) {
      console.error('Failed to create analytics:', error);
    }
  };

  const updateMetric = (index: number, field: string, value: any) => {
    const newMetrics = [...formData.metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setFormData({ ...formData, metrics: newMetrics });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Track and analyze your business metrics</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          {showCreateForm ? 'Cancel' : '+ New Analytics'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Analytics</h3>
          <form onSubmit={handleCreateAnalytics} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analytics Name
              </label>
              <input
                type="text"
                required
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Q4 Sales Report"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="financial">Financial</option>
                <option value="operational">Operational</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metrics
              </label>
              {formData.metrics.map((metric, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="input flex-1"
                    value={metric.key}
                    onChange={(e) => updateMetric(index, 'key', e.target.value)}
                    placeholder="Metric name"
                  />
                  <input
                    type="number"
                    className="input w-32"
                    value={metric.value}
                    onChange={(e) => updateMetric(index, 'value', parseFloat(e.target.value))}
                    placeholder="Value"
                  />
                  <select
                    className="input w-32"
                    value={metric.trend}
                    onChange={(e) => updateMetric(index, 'trend', e.target.value)}
                  >
                    <option value="up">↑ Up</option>
                    <option value="down">↓ Down</option>
                    <option value="stable">→ Stable</option>
                  </select>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  metrics: [...formData.metrics, { key: '', value: 0, unit: '', trend: 'stable' }]
                })}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Add Metric
              </button>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Analytics
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {analytics.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first analytics report</p>
            <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
              Create Analytics
            </button>
          </div>
        ) : (
          analytics.map((item) => (
            <div key={item._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • 
                    Created {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'completed' ? 'bg-green-100 text-green-800' :
                  item.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>

              {item.data.metrics && item.data.metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {item.data.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">{metric.key}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {metric.value.toLocaleString()}
                        {metric.unit && ` ${metric.unit}`}
                      </p>
                      {metric.trend && (
                        <span className={`text-sm ${
                          metric.trend === 'up' ? 'text-green-600' :
                          metric.trend === 'down' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
