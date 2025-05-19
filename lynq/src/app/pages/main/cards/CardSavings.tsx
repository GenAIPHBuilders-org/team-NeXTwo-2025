'use client';

import { useState, useEffect } from 'react';
import { PiggyBank } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AgentInsights from '../../../components/AgentInsights';

interface CardSavingsProps {
  preview?: boolean;
  modal?: boolean;
}

export default function CardSavings({ preview, modal }: CardSavingsProps) {
  const [savingsData, setSavingsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user-data');
        const data = await response.json();
        setSavingsData(data.user.savings);
      } catch (error) {
        console.error('Error fetching savings data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />;
  }

  // Prepare chart data
  const chartData = savingsData ? [
    ...savingsData.week_1.map((item: any) => ({
      date: item.date,
      amount: item.amount
    })),
    ...savingsData.week_2.map((item: any) => ({
      date: item.date,
      amount: item.amount
    }))
  ] : [];

  if (preview) {
    return (
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-4">Savings Overview</h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (modal) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Savings Details</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Week 1</h3>
          <div className="overflow-x-auto mb-2">
            <table className="min-w-full divide-y divide-gray-200 mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savingsData?.week_1.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₱{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Week 2</h3>
          <div className="overflow-x-auto mb-2">
            <table className="min-w-full divide-y divide-gray-200 mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savingsData?.week_2.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₱{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <AgentInsights agentType="savings" title="Savings" />
      </div>
    );
  }

  // Default to preview if neither is set
  return (
    <div>
      <h2 className="text-xl font-bold text-blue-900 mb-4">Savings Overview</h2>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 