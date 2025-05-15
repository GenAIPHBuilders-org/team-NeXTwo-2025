'use client';

import { useState } from 'react';
import CardBudget from './cards/CardBudget';
import CardCashFlow from './cards/CardCashFlow';
import CardSavings from './cards/CardSavings';
import CardInsights from './cards/CardInsights';
import { UserCircle } from 'lucide-react';

export default function Dashboard() {
  const [profileOpen, setProfileOpen] = useState(false);
  // Example user data (replace with real data as needed)
  const user = {
    name: 'Max Watson',
    location: 'Los Angeles, CA',
    email: 'max.watson@email.com',
    joined: 'Jan 2022',
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-6xl mx-auto relative">
        {/* Profile Icon */}
        <button
          className="absolute top-0 right-0 mt-2 mr-2 z-20 bg-white/60 hover:bg-white/80 rounded-full p-2 shadow-lg border border-blue-100 transition"
          onClick={() => setProfileOpen((v) => !v)}
        >
          <UserCircle className="h-9 w-9 text-blue-700" />
        </button>
        {/* Profile Popover */}
        {profileOpen && (
          <div className="absolute top-14 right-2 z-30 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-6 min-w-[220px] flex flex-col gap-2 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <UserCircle className="h-10 w-10 text-blue-700" />
              <div>
                <div className="font-bold text-blue-900 text-lg">{user.name}</div>
                <div className="text-blue-600 text-sm">{user.location}</div>
              </div>
            </div>
            <div className="text-blue-800 text-sm">{user.email}</div>
            <div className="text-blue-500 text-xs mt-2">Joined: {user.joined}</div>
          </div>
        )}
        <h1 className="text-4xl font-extrabold text-blue-900 mb-10 text-center tracking-tight drop-shadow-sm">Financial Dashboard</h1>
        <div className="bg-white/80 rounded-3xl shadow-xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          <CardBudget />
          <CardCashFlow />
          <CardSavings />
          <CardInsights />
        </div>
      </div>
    </div>
  );
} 