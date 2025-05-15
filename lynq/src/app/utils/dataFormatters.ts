import { UserData } from '../types/user';

export interface BudgetData {
  date: string;
  description: string;
  amount: number;
}

export interface CashFlowData {
  date: string;
  description: string;
  amount: number;
}

export interface SavingsData {
  date: string;
  description: string;
  amount: number;
}

export interface AgentOutput {
  summary: string;
  suggestions: string[];
  data: BudgetData[];
}

export interface CashFlowOutput {
  summary: string;
  trends: string[];
  weeklyData: {
    week: string;
    total: number;
    transactions: CashFlowData[];
  }[];
}

export interface SavingsOutput {
  summary: string;
  suggestions: string[];
  goals: {
    name: string;
    target: number;
    current: number;
    deadline: string;
  }[];
  transactions: SavingsData[];
}

export interface InsightsOutput {
  summary: string;
  insights: {
    category: string;
    items: string[];
  }[];
  alerts: {
    type: 'warning' | 'info' | 'success';
    message: string;
    action?: string;
  }[];
}

export const formatBudgetData = (userData: UserData): AgentOutput => {
  const { expenses, budget } = userData.user;
  
  // Calculate total monthly expenses
  const totalFixedExpenses = Object.values(expenses.fixed_monthly_expenses).reduce((sum, amount) => sum + amount, 0);
  const totalVariableExpenses = Object.values(expenses.variable_monthly_expenses).reduce((sum, amount) => sum + amount, 0);
  const totalDebtObligations = Object.values(expenses.debt_obligations).reduce((sum, amount) => sum + amount, 0);
  
  const totalMonthlyExpenses = totalFixedExpenses + totalVariableExpenses + totalDebtObligations;
  const monthlyIncome = userData.user.employment_income.monthly_income;
  
  return {
    summary: `Monthly Budget: ₱${monthlyIncome.toLocaleString()} | Expenses: ₱${totalMonthlyExpenses.toLocaleString()}`,
    suggestions: [
      `Current budget allocation: ${budget.categories.necessities}% necessities, ${budget.categories.wants}% wants, ${budget.categories.savings}% savings`,
      `Consider increasing savings rate to reach financial goals faster`,
      `Review variable expenses to optimize spending`
    ],
    data: [
      {
        date: 'Monthly',
        description: 'Fixed Expenses',
        amount: totalFixedExpenses
      },
      {
        date: 'Monthly',
        description: 'Variable Expenses',
        amount: totalVariableExpenses
      },
      {
        date: 'Monthly',
        description: 'Debt Obligations',
        amount: totalDebtObligations
      }
    ]
  };
};

export const formatCashFlowData = (userData: UserData): CashFlowOutput => {
  const { weekly_expenses, employment_income } = userData.user;
  const weeklyIncome = employment_income.monthly_income / 4;

  return {
    summary: `Weekly Income: ₱${weeklyIncome.toLocaleString()} | Tracking: ${userData.user.budget.tracking_frequency}`,
    trends: [
      'Consistent weekly spending patterns',
      'Fixed expenses remain stable',
      'Variable expenses show slight fluctuations'
    ],
    weeklyData: Object.entries(weekly_expenses).map(([week, data]) => {
      const fixedTotal = Object.values(data.fixed_expenses).reduce((sum, amount) => sum + amount, 0);
      const variableTotal = Object.values(data.variable_expenses).reduce((sum, amount) => sum + amount, 0);
      const total = fixedTotal + variableTotal;

      return {
        week: week.replace('_', ' ').toUpperCase(),
        total,
        transactions: [
          ...Object.entries(data.fixed_expenses).map(([category, amount]) => ({
            date: 'Fixed',
            description: category.charAt(0).toUpperCase() + category.slice(1),
            amount
          })),
          ...Object.entries(data.variable_expenses).map(([category, amount]) => ({
            date: 'Variable',
            description: category.charAt(0).toUpperCase() + category.slice(1),
            amount
          }))
        ]
      };
    })
  };
};

export const formatSavingsData = (userData: UserData): SavingsOutput => {
  const { savings, financial_goals } = userData.user;
  
  return {
    summary: `Emergency Fund: ₱${savings.emergency_fund.toLocaleString()} | Retirement: ₱${savings.retirement_account.toLocaleString()}`,
    suggestions: [
      'Continue building emergency fund',
      'Consider increasing retirement contributions',
      'Review savings goals regularly'
    ],
    goals: [
      {
        name: 'Emergency Fund',
        target: 50000, // 3 months of expenses
        current: savings.emergency_fund,
        deadline: 'Ongoing'
      },
      {
        name: 'Retirement Savings',
        target: 1000000,
        current: savings.retirement_account,
        deadline: 'Long-term'
      },
      ...financial_goals.short_term_goals.map(goal => ({
        name: goal,
        target: 50000,
        current: 0,
        deadline: 'Short-term'
      }))
    ],
    transactions: [
      {
        date: 'Current',
        description: 'Emergency Fund',
        amount: savings.emergency_fund
      },
      {
        date: 'Current',
        description: 'Retirement Account',
        amount: savings.retirement_account
      }
    ]
  };
};

export const formatInsightsData = (userData: UserData): InsightsOutput => {
  const { financial_habits_preferences, financial_goals, expenses } = userData.user;
  
  return {
    summary: `${userData.user.name}'s Financial Overview - ${financial_habits_preferences.budgeting_style} Budgeting Style`,
    insights: [
      {
        category: 'Financial Habits',
        items: [
          `Budgeting Style: ${financial_habits_preferences.budgeting_style}`,
          `Savings Behavior: ${financial_habits_preferences.savings_behavior}`,
          `Risk Tolerance: ${financial_habits_preferences.risk_tolerance}`
        ]
      },
      {
        category: 'Financial Goals',
        items: [
          ...financial_goals.short_term_goals,
          ...financial_goals.long_term_goals
        ]
      }
    ],
    alerts: [
      {
        type: 'info' as const,
        message: 'Monthly savings target: ₱' + financial_goals.savings_goals.target_amount.toLocaleString(),
        action: 'Track progress weekly'
      },
      {
        type: 'warning' as const,
        message: 'Upcoming major expense: ' + expenses.major_upcoming_expenses[0],
        action: 'Plan and save accordingly'
      },
      {
        type: 'success' as const,
        message: 'Emergency fund established',
        action: 'Continue regular contributions'
      }
    ]
  };
}; 