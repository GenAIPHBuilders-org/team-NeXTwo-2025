'use client';

import { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import Modal from '../Modal';
import { formatInsightsData } from '../../../utils/dataFormatters';
import type { UserData } from '../../../types/user';
import type { InsightsOutput } from '../../../utils/dataFormatters';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

export default function CardInsights() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentOutput, setAgentOutput] = useState<InsightsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const response = await fetch('/api/user-data');
        const userData: UserData = await response.json();
        
        // Format the data for the insights card
        const formattedData = formatInsightsData(userData);
        setAgentOutput(formattedData);
      } catch (error) {
        console.error('Error fetching insights data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 animate-pulse border border-blue-100">
        <div className="h-5 bg-blue-200 rounded w-3/4 mb-5"></div>
        <div className="h-5 bg-blue-100 rounded w-1/2"></div>
      </div>
    );
  }

  const getAlertColor = (type: 'warning' | 'info' | 'success') => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 text-left border border-blue-100 hover:border-blue-200 group"
      >
        <div className="flex items-center mb-5">
          <span className="bg-blue-100 p-2 rounded-full mr-4">
            <Lightbulb className="h-7 w-7 text-blue-500" />
          </span>
          <h2 className="text-2xl font-bold text-blue-900">Insights</h2>
        </div>
        <p className="text-blue-700 text-lg group-hover:text-blue-900 transition-colors">
          {agentOutput?.summary || 'No insights available'}
        </p>
        {/* RadialBarChart for Insights Categories */}
        {agentOutput?.insights && agentOutput.insights.length > 0 && (
          <div className="mt-6 h-56 bg-blue-100 rounded-xl flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="80%"
                barSize={18}
                data={agentOutput.insights.map((cat, idx) => ({
                  name: cat.category,
                  value: cat.items.length,
                  fill: ["#2563eb", "#60a5fa", "#1e40af", "#3b82f6", "#93c5fd"][idx % 5],
                }))}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={8}
                />
                <Legend iconSize={12} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #dbeafe' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        )}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Financial Insights"
      >
        <div className="space-y-8 bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl">
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
            <p className="text-blue-700 text-base">{agentOutput?.summary}</p>
          </div>

          {agentOutput?.alerts && agentOutput.alerts.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Alerts</h4>
              <div className="space-y-3">
                {agentOutput.alerts.map((alert, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                  >
                    <p className="font-medium">{alert.message}</p>
                    {alert.action && (
                      <p className="mt-1 text-sm">{alert.action}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {agentOutput?.insights && agentOutput.insights.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Detailed Insights</h4>
              <div className="space-y-4">
                {agentOutput.insights.map((category, index: number) => (
                  <div key={index} className="border border-blue-100 rounded-xl p-4 bg-white">
                    <h5 className="font-medium text-blue-900 mb-2">{category.category}</h5>
                    <ul className="list-disc pl-5 space-y-1">
                      {category.items.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="text-blue-700 text-base">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
} 