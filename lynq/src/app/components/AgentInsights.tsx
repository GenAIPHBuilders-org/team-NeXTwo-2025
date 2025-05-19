import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AgentInsightsProps {
  agentType: 'budget' | 'savings' | 'cashflow' | 'insights';
  title: string;
}

interface AgentResponse {
  output: string;
  status: 'success' | 'error';
  details?: {
    category?: string;
    recommendations?: string[];
    metrics?: Record<string, number>;
  };
}

const markdownComponents = {
  h1: (props: any) => <h1 className="text-2xl font-bold text-blue-900 mt-4 mb-2" {...props} />,
  h2: (props: any) => <h2 className="text-xl font-semibold text-blue-800 mt-4 mb-2" {...props} />,
  h3: (props: any) => <h3 className="text-lg font-semibold text-blue-700 mt-3 mb-1" {...props} />,
  p: (props: any) => <p className="my-2 leading-relaxed text-blue-900" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 space-y-1 my-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 space-y-1 my-2" {...props} />,
  li: (props: any) => <li className="text-blue-800" {...props} />,
  strong: (props: any) => <strong className="font-semibold text-blue-900" {...props} />,
  em: (props: any) => <em className="italic text-blue-700" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-blue-300 pl-4 italic text-blue-700 my-2" {...props} />,
  hr: () => <hr className="my-4 border-blue-200" />,
  code: (props: any) => <code className="bg-blue-100 px-1 rounded text-blue-900" {...props} />,
};

export default function AgentInsights({ agentType, title }: AgentInsightsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    setAgentResponse(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_type: `${agentType}_agent`,
          user_data: {
            timestamp: new Date().toISOString(),
            context: {
              budget: agentType === 'budget' ? 'current_budget_data' : undefined,
              savings: agentType === 'savings' ? 'current_savings_data' : undefined,
              cashflow: agentType === 'cashflow' ? 'current_cashflow_data' : undefined,
            }
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch insights');
      }

      const data = await response.json();
      setAgentResponse(data);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAgentOutput = () => {
    if (!agentResponse) return null;

    return (
      <div className="mt-4 space-y-6">
        {/* Main Output */}
        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
          <h4 className="font-bold text-blue-900 text-lg mb-4 border-b border-blue-200 pb-2">{title} Analysis</h4>
          <div className="prose prose-sm max-w-none text-blue-800">
            <ReactMarkdown components={markdownComponents} skipHtml>{agentResponse.output}</ReactMarkdown>
          </div>
        </div>

        {/* Additional Details if available */}
        {agentResponse.details && (
          <div className="space-y-4">
            {/* Category */}
            {agentResponse.details.category && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <span className="ml-2 text-gray-600">{agentResponse.details.category}</span>
              </div>
            )}

            {/* Recommendations */}
            {agentResponse.details.recommendations && agentResponse.details.recommendations.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="text-sm font-medium text-green-800 mb-2">Recommendations:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {agentResponse.details.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-green-700">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metrics */}
            {agentResponse.details.metrics && Object.keys(agentResponse.details.metrics).length > 0 && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <h5 className="text-sm font-medium text-purple-800 mb-2">Key Metrics:</h5>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(agentResponse.details.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-purple-700">{key}:</span>
                      <span className="text-sm font-medium text-purple-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <button
        onClick={fetchInsights}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating Insights...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Get {title} Insights</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          <h4 className="font-semibold mb-1">Error</h4>
          <p>{error}</p>
        </div>
      )}

      {renderAgentOutput()}
    </div>
  );
} 