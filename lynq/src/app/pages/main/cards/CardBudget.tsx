'use client';

import { useState, useEffect } from 'react';
import { Wallet, CircleDollarSign, CalendarDays, FileText } from 'lucide-react';
import Modal from '../Modal';
import { formatBudgetData } from '../../../utils/dataFormatters';
import type { UserData } from '../../../types/user';
import type { AgentOutput } from '../../../utils/dataFormatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CardBudget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentOutput, setAgentOutput] = useState<AgentOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const response = await fetch('/api/user-data');
        const userData: UserData = await response.json();
        
        // Format the data for the budget card
        const formattedData = formatBudgetData(userData);
        setAgentOutput(formattedData);
      } catch (error) {
        console.error('Error fetching budget data:', error);
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
            <Wallet className="h-7 w-7 text-blue-500" />
          </span>
          <h2 className="text-2xl font-bold text-blue-900">Budget Overview</h2>
        </div>
        <p className="text-blue-700 text-lg group-hover:text-blue-900 transition-colors">
          {agentOutput?.summary || 'No budget data available'}
        </p>
        {/* Pie Chart for Budget Allocation */}
        {agentOutput?.data && agentOutput.data.length > 0 && (
          <div className="mt-6 h-56 bg-blue-100 rounded-xl flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={agentOutput.data}
                  dataKey="amount"
                  nameKey="description"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={35}
                  fill="#2563eb"
                  label={({ name }) => name}
                >
                  {agentOutput.data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={["#2563eb", "#60a5fa", "#1e40af", "#3b82f6", "#93c5fd"][idx % 5]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #dbeafe' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Budget Details"
      >
        <div className="space-y-8 bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl">
          <div className="flex items-start space-x-4">
            <span className="bg-blue-100 p-2 rounded-full flex-shrink-0 mt-1">
              <CircleDollarSign className="h-6 w-6 text-blue-600" />
            </span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
              <p className="text-blue-700 text-base">{agentOutput?.summary}</p>
            </div>
          </div>

          {agentOutput?.suggestions && agentOutput.suggestions.length > 0 && (
            <div className="flex items-start space-x-4">
              <span className="bg-blue-100 p-2 rounded-full flex-shrink-0 mt-1">
                <FileText className="h-6 w-6 text-blue-600" />
              </span>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Suggestions</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {agentOutput.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-blue-700 text-base">{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {agentOutput?.data && agentOutput.data.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <span className="bg-blue-100 p-2 rounded-full mr-2">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </span>
                <h4 className="font-semibold text-blue-900">Budget Items</h4>
              </div>
              <div className="overflow-x-auto bg-white rounded-xl shadow border border-blue-100">
                <table className="min-w-full divide-y divide-blue-100">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Description</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50">
                    {agentOutput.data.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                        <td className="px-5 py-3 text-base text-blue-700">{item.date}</td>
                        <td className="px-5 py-3 text-base text-blue-700">{item.description}</td>
                        <td className="px-5 py-3 text-base font-semibold text-blue-700">₱{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}