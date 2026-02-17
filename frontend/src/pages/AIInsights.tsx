import { useState } from 'react';
import api from '../services/api';

interface Insight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'ask' | 'predict'>('insights');

  const generateInsights = async () => {
    setLoading(true);
    try {
      const response = await api.post('/ai/insights', {
        data: { revenue: 245000, customers: 1247, retention: 87 },
        context: 'Q4 business performance'
      });
      setInsights(response.data.insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const askAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/ai/ask', {
        question,
        context: 'business analytics'
      });
      setAnswer(response.data.result);
    } catch (error) {
      console.error('Failed to ask question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
        <p className="mt-2 text-gray-600">
          Leverage AI to gain deeper insights into your business data
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'insights'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Generate Insights
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ask'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ask AI
          </button>
          <button
            onClick={() => setActiveTab('predict')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'predict'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Predictions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              AI-Powered Business Insights
            </h3>
            <p className="text-gray-600 mb-4">
              Click the button below to generate AI insights based on your latest business data.
            </p>
            <button
              onClick={generateInsights}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Generating...' : 'Generate Insights'}
            </button>
          </div>

          {insights.length > 0 && (
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`card border-l-4 ${
                    insight.type === 'positive'
                      ? 'border-green-500 bg-green-50'
                      : insight.type === 'negative'
                      ? 'border-red-500 bg-red-50'
                      : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{insight.title}</h4>
                    <span className="text-sm text-gray-600">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-gray-700">{insight.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ask' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ask AI About Your Data
            </h3>
            <form onSubmit={askAI} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question
                </label>
                <textarea
                  className="input min-h-[100px]"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What are my top performing metrics this quarter?"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Processing...' : 'Ask AI'}
              </button>
            </form>
          </div>

          {answer && (
            <div className="card bg-gradient-to-br from-primary-50 to-purple-50">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 bg-primary-600 rounded-full p-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-2">AI Response:</p>
                  <p className="text-gray-700 mb-4">{answer.answer}</p>
                  
                  {answer.relatedInsights && answer.relatedInsights.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Related Insights:</p>
                      <ul className="space-y-1">
                        {answer.relatedInsights.map((insight: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-600">
                    Confidence: {Math.round(answer.confidence * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'predict' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Predictive Analytics
          </h3>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
            <p className="text-primary-900">
              🚀 <strong>Coming Soon:</strong> Advanced ML-powered predictions for revenue, customer growth, and market trends.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Revenue Forecast</h4>
              <p className="text-sm text-gray-600">
                Predict future revenue based on historical trends and seasonality
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Customer Churn Prediction</h4>
              <p className="text-sm text-gray-600">
                Identify customers at risk of churning before it happens
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Demand Forecasting</h4>
              <p className="text-sm text-gray-600">
                Optimize inventory and resources with accurate demand predictions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
