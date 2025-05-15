'use client';

import { useState, useEffect } from 'react';
import { PiggyBank } from 'lucide-react';
import Modal from '../Modal';
import { formatSavingsData } from '../../../utils/dataFormatters';
import type { UserData } from '../../../types/user';
import type { SavingsOutput, SavingsData } from '../../../utils/dataFormatters';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function CardSavings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentOutput, setAgentOutput] = useState<SavingsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const response = await fetch('/api/user-data');
        const userData: UserData = await response.json();
        
        // Format the data for the savings card
        const formattedData = formatSavingsData(userData);
        setAgentOutput(formattedData);
      } catch (error) {
        console.error('Error fetching savings data:', error);
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
            <PiggyBank className="h-7 w-7 text-blue-500" />
          </span>
          <h2 className="text-2xl font-bold text-blue-900">Savings</h2>
        </div>
        <p className="text-blue-700 text-lg group-hover:text-blue-900 transition-colors">
          {agentOutput?.summary || 'No savings data available'}
        </p>
        {/* Area Chart for Savings Trend */}
        {agentOutput?.transactions && agentOutput.transactions.length > 0 && (
          <div className="mt-6 h-48 bg-blue-100 rounded-xl flex items-center justify-center">
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={agentOutput.transactions.slice().reverse()} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                <XAxis dataKey="date" tick={{ fill: '#2563eb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#2563eb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #dbeafe' }} />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" fill="#60a5fa" strokeWidth={3} dot={{ r: 3, fill: '#2563eb' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Savings Details"
      >
        <div className="space-y-8 bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl">
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
            <p className="text-blue-700 text-base">{agentOutput?.summary}</p>
          </div>

          {agentOutput?.goals && agentOutput.goals.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Savings Goals</h4>
              <div className="space-y-4">
                {agentOutput.goals.map((goal, index) => (
                  <div key={index} className="border border-blue-100 rounded-xl p-4 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-blue-900">{goal.name}</h5>
                      <span className="text-sm font-medium text-blue-600">
                        Target: ₱{goal.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${(goal.current / goal.target) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-blue-700">
                      <span>Current: ₱{goal.current.toLocaleString()}</span>
                      <span>Deadline: {goal.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {agentOutput?.suggestions && agentOutput.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Suggestions</h4>
              <ul className="list-disc pl-5 space-y-1">
                {agentOutput.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-blue-700 text-base">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {agentOutput?.transactions && agentOutput.transactions.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Recent Transactions</h4>
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
                    {agentOutput.transactions.map((transaction: SavingsData, index: number) => (
                      <tr key={index}>
                        <td className="px-5 py-3 text-base text-blue-700">{transaction.date}</td>
                        <td className="px-5 py-3 text-base text-blue-700">{transaction.description}</td>
                        <td className="px-5 py-3 text-base text-blue-700">₱{transaction.amount.toLocaleString()}</td>
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