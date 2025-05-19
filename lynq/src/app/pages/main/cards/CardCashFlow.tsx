'use client';

import { useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AgentInsights from '../../../components/AgentInsights';

interface CardCashFlowProps {
  preview?: boolean;
  modal?: boolean;
}

export default function CardCashFlow({ preview, modal }: CardCashFlowProps) {
  const [cashflowData, setCashflowData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user-data');
        const data = await response.json();
        setCashflowData(data.user.cashflow);
      } catch (error) {
        console.error('Error fetching cashflow data:', error);
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
  const chartData = cashflowData ? [
    {
      week: 'Week 1',
      inflow: cashflowData.week_1.filter((item: any) => item.amount > 0).reduce((sum: number, item: any) => sum + item.amount, 0),
      outflow: Math.abs(cashflowData.week_1.filter((item: any) => item.amount < 0).reduce((sum: number, item: any) => sum + item.amount, 0))
    },
    {
      week: 'Week 2',
      inflow: cashflowData.week_2.filter((item: any) => item.amount > 0).reduce((sum: number, item: any) => sum + item.amount, 0),
      outflow: Math.abs(cashflowData.week_2.filter((item: any) => item.amount < 0).reduce((sum: number, item: any) => sum + item.amount, 0))
    }
  ] : [];

  if (preview) {
    return (
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-4">Cash Flow Overview</h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="inflow" fill="#3b82f6" name="Inflow" />
              <Bar dataKey="outflow" fill="#ef4444" name="Outflow" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (modal) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Cash Flow Details</h2>
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
                {cashflowData?.week_1.map((item: any, index: number) => (
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
                {cashflowData?.week_2.map((item: any, index: number) => (
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
        <AgentInsights agentType="cashflow" title="Cash Flow" />
      </div>
    );
  }

  // Default to preview if neither is set
  return (
    <div>
      <h2 className="text-xl font-bold text-blue-900 mb-4">Cash Flow Overview</h2>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="inflow" fill="#3b82f6" name="Inflow" />
            <Bar dataKey="outflow" fill="#ef4444" name="Outflow" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 