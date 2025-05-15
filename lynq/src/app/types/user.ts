export interface UserData {
  user: {
    name: string;
    demographics: {
      age: number;
      gender: string;
      marital_status: string;
      dependents: number;
      location: {
        city: string;
        province: string;
        country: string;
      };
    };
    employment_income: {
      employment_status: string;
      job_title: string;
      income_sources: string[];
      monthly_income: number;
      income_frequency: string;
    };
    expenses: {
      fixed_monthly_expenses: {
        rent: number;
        utilities: number;
        subscriptions: number;
        insurance: number;
      };
      variable_monthly_expenses: {
        groceries: number;
        transportation: number;
        entertainment: number;
        dining: number;
        shopping: number;
      };
      debt_obligations: {
        credit_cards: number;
        loans: number;
        mortgages: number;
      };
      major_upcoming_expenses: string[];
    };
    financial_goals: {
      short_term_goals: string[];
      long_term_goals: string[];
      savings_goals: {
        target_amount: number;
        timeline: string;
      };
    };
    financial_habits_preferences: {
      budgeting_style: string;
      savings_behavior: string;
      risk_tolerance: string;
      preferred_alerts: string[];
    };
    banking_cashflow: {
      bank_accounts_linked: boolean;
      credit_cards_and_loans: string[];
    };
    budget: {
      categories: {
        necessities: number;
        wants: number;
        savings: number;
      };
      tracking_frequency: string;
    };
    savings: {
      emergency_fund: number;
      retirement_account: number;
    };
    weekly_expenses: {
      [key: string]: {
        fixed_expenses: {
          rent: number;
          utilities: number;
          subscriptions: number;
          groceries: number;
          transportation: number;
        };
        variable_expenses: {
          entertainment: number;
          dining: number;
          shopping: number;
        };
      };
    };
  };
} 