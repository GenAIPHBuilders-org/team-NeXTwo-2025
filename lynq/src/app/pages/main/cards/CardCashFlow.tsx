'use client';

import { useState, useEffect } from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import Modal from '../Modal';
import { formatCashFlowData } from '../../../utils/dataFormatters';
import type { UserData } from '../../../types/user';
import type { CashFlowOutput, CashFlowData } from '../../../utils/dataFormatters';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function CardCashFlow() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentOutput, setAgentOutput] = useState<CashFlowOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const response = await fetch('/api/user-data');
        const userData: UserData = await response.json();
        
        // Format the data for the cash flow card
        const formattedData = formatCashFlowData(userData);
        setAgentOutput(formattedData);
      } catch (error) {
        console.error('Error fetching cash flow data:', error);
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

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 text-left border border-blue-100 hover:border-blue-200 group"
      >
        <div className="flex items-center mb-5">
          <span className="bg-blue-100 p-2 rounded-full mr-4">
            <TrendingUp className="h-7 w-7 text-blue-500" />
          </span>
          <h2 className="text-2xl font-bold text-blue-900">Cash Flow</h2>
        </div>
        <p className="text-blue-700 text-lg group-hover:text-blue-900 transition-colors">
          {agentOutput?.summary || 'No cash flow data available'}
        </p>
        {/* Placeholder for recharts bar chart */}
        <div className="mt-6 h-48 bg-blue-100 rounded-xl flex items-center justify-center">
          {agentOutput?.weeklyData && agentOutput.weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={agentOutput.weeklyData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                <XAxis dataKey="week" tick={{ fill: '#2563eb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#2563eb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#dbeafe' }} contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #dbeafe' }} />
                <Bar dataKey="total" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <span className="text-blue-400">No chart data</span>
          )}
        </div>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cash Flow Details"
      >
        <div className="space-y-8 bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl">
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
            <p className="text-blue-700 text-base">{agentOutput?.summary}</p>
          </div>

          {agentOutput?.trends && agentOutput.trends.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Trends</h4>
              <ul className="list-disc pl-5 space-y-1">
                {agentOutput.trends.map((trend: string, index: number) => (
                  <li key={index} className="text-blue-700 text-base">{trend}</li>
                ))}
              </ul>
            </div>
          )}

          {agentOutput?.weeklyData && agentOutput.weeklyData.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Weekly Breakdown</h4>
              <div className="space-y-4">
                {agentOutput.weeklyData.map((week, index: number) => (
                  <div key={index} className="border border-blue-100 rounded-xl p-4 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-blue-900">{week.week}</h5>
                      <span className="text-sm font-medium text-blue-600">
                        Total: ₱{week.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-blue-100">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Description</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                          {week.transactions.map((transaction: CashFlowData, tIndex: number) => (
                            <tr key={tIndex}>
                              <td className="px-4 py-2 text-base text-blue-700">{transaction.date}</td>
                              <td className="px-4 py-2 text-base text-blue-700">{transaction.description}</td>
                              <td className="px-4 py-2 text-base text-blue-700">₱{transaction.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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