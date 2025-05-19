"use client"

import { useState, useEffect } from "react"
import { Lightbulb, Loader2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from "recharts"
import ReactMarkdown from "react-markdown"
import AgentInsights from "../../../components/AgentInsights"

interface CardInsightsProps {
  preview?: boolean
  modal?: boolean
}

interface InsightData {
  summary: string
  alerts: Array<{
    type: "warning" | "info" | "success"
    message: string
    action?: string
  }>
  insights: Array<{
    category: string
    items: string[]
  }>
}

// Extend the Window interface to include insightState
declare global {
  interface Window {
    insightState?: {
      insightOutput: string | null
      loading: boolean
      error: string | null
    }
  }
}

// Create a shared state context to share between preview and modal
const useSharedState = () => {
  // Use a module-level variable to persist state across component instances
  if (typeof window !== "undefined") {
    if (!window.insightState) {
      window.insightState = {
        insightOutput: null,
        loading: false,
        error: null,
      }
    }
    return window.insightState
  }
  return {
    insightOutput: null,
    loading: false,
    error: null,
  }
}

// Custom components for ReactMarkdown
const MarkdownComponents = {
  // Style headings
  h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold text-blue-900 mb-3" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold text-blue-800 mb-2" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-base font-semibold text-blue-800 mb-2" {...props} />,

  // Style paragraphs
  p: ({ node, ...props }: any) => <p className="mb-3 text-blue-800" {...props} />,

  // Style lists
  ul: ({ node, ...props }: any) => <ul className="mb-4 pl-5 space-y-1" {...props} />,
  ol: ({ node, ...props }: any) => <ol className="mb-4 pl-5 space-y-1 list-decimal" {...props} />,
  li: ({ node, ...props }: any) => (
    <li className="text-blue-800 flex items-start" {...props}>
      <span className="text-blue-500 mr-2 mt-1">•</span>
      <span>{props.children}</span>
    </li>
  ),

  // Style emphasis and strong
  em: ({ node, ...props }: any) => <em className="italic text-blue-700" {...props} />,
  strong: ({ node, ...props }: any) => <strong className="font-bold text-blue-900" {...props} />,

  // Style code blocks
  code: ({ node, inline, ...props }: any) =>
    inline ? (
      <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800 text-sm" {...props} />
    ) : (
      <code className="block bg-blue-100 p-3 rounded-md text-blue-800 text-sm my-3 overflow-x-auto" {...props} />
    ),

  // Style blockquotes
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-300 pl-4 italic text-blue-700 my-3" {...props} />
  ),

  // Style links
  a: ({ node, ...props }: any) => <a className="text-blue-600 hover:underline" {...props} />,

  // Style horizontal rules
  hr: ({ node, ...props }: any) => <hr className="my-4 border-blue-200" {...props} />,
}

// Function to extract a preview of the first section
const extractPreview = (markdown: string, maxLength = 150): string => {
  // Find the first section after a heading
  const sections = markdown.split(/\*\s+\*\*[^:]+:\*\*/)

  if (sections.length > 1) {
    // Get the first non-empty section
    const firstSection = sections[1].trim()

    // Truncate if needed
    if (firstSection.length > maxLength) {
      return firstSection.substring(0, maxLength) + "..."
    }
    return firstSection
  }

  // If no sections found, just return a truncated version of the markdown
  if (markdown.length > maxLength) {
    return markdown.substring(0, maxLength) + "..."
  }
  return markdown
}

export default function CardInsights({ preview, modal }: CardInsightsProps) {
  const [insightData, setInsightData] = useState<InsightData | null>(null)

  // Get shared state
  const sharedState = useSharedState()

  // Local state that syncs with shared state
  const [loading, setLoading] = useState(sharedState.loading)
  const [insightOutput, setInsightOutput] = useState<string | null>(sharedState.insightOutput)
  const [error, setError] = useState<string | null>(sharedState.error)

  // Update shared state when local state changes
  useEffect(() => {
    sharedState.loading = loading
    sharedState.insightOutput = insightOutput
    sharedState.error = error
  }, [loading, insightOutput, error, sharedState])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user-data")
        const data = await response.json()

        // Transform the data into the required format
        const transformedData: InsightData = {
          summary: data.summary,
          alerts: data.alerts || [],
          insights: data.insights || [],
        }

        setInsightData(transformedData)
      } catch (error) {
        console.error("Error fetching insights data:", error)
      } finally {
        if (!sharedState.loading) {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [sharedState.loading])

  const fetchInsights = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_type: "insights_agent" }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to fetch insights")
      }

      const data = await response.json()
      setInsightOutput(data.output)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading && !insightOutput) {
    return (
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 border border-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-blue-700">Fetching insights...</span>
        </div>
      </motion.div>
    )
  }

  // Preview mode (shown on dashboard)
  if (preview) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-xl font-bold text-blue-900 mb-4">Insights Overview</h2>

        {/* Show agent insights if available */}
        {insightOutput && (
          <motion.div
            className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-blue-900 mb-1 text-sm">Latest Insights</h4>
            <div className="text-blue-800 text-xs max-h-[80px] overflow-y-auto">
              {insightOutput && (
                <div className="prose prose-sm max-w-none">
                  {/* Show a preview in the dashboard */}
                  <ReactMarkdown components={MarkdownComponents}>{extractPreview(insightOutput)}</ReactMarkdown>
                  <p className="text-blue-500 text-xs mt-1">View all insights for more details...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Chart visualization */}
        {insightData?.insights && insightData.insights.length > 0 && (
          <div className="h-40 bg-blue-100 rounded-xl flex items-center justify-center">
            <ResponsiveContainer width="100%" height={120}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="80%"
                barSize={18}
                data={insightData.insights.map((cat, idx) => ({
                  name: cat.category,
                  value: cat.items.length,
                  fill: ["#2563eb", "#60a5fa", "#1e40af", "#3b82f6", "#93c5fd"][idx % 5],
                }))}
              >
                <RadialBar background dataKey="value" cornerRadius={8} />
                <Legend iconSize={12} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 8, border: "1px solid #dbeafe" }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary text */}
        <p className="text-blue-700 text-base mt-4">{insightData?.summary}</p>

        {/* Get Insights button */}
        <motion.button
          onClick={fetchInsights}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : insightOutput ? (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh Insights
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Get Insights
            </>
          )}
        </motion.button>
      </motion.div>
    )
  }

  // Modal view
  if (modal) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-2xl font-bold mb-4">Insights Details</h2>

        {/* Get Insights button in modal */}
        <motion.button
          onClick={fetchInsights}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : insightOutput ? (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh Insights
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Get Insights
            </>
          )}
        </motion.button>

        {/* Agent insights in modal - with ReactMarkdown */}
        {insightOutput && (
          <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h4 className="font-semibold text-blue-900 mb-4">AI Analysis</h4>
            <div className="bg-white rounded-lg border border-blue-100 p-6 shadow-sm">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown components={MarkdownComponents}>{insightOutput}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Summary</h3>
          <p className="text-blue-700 text-base mb-4">{insightData?.summary}</p>
        </div>

        {insightData?.alerts && insightData.alerts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Alerts</h3>
            <div className="space-y-3">
              {insightData.alerts.map((alert, index: number) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    alert.type === "warning"
                      ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                      : alert.type === "success"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="font-medium">{alert.message}</p>
                  {alert.action && <p className="mt-1 text-sm">{alert.action}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <AgentInsights agentType="insights" title="Insights" />
      </motion.div>
    )
  }

  // Default view (full card on dashboard)
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 border border-blue-100">
      {error && (
        <motion.div
          className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-semibold mb-1">Error</h4>
          <p>{error}</p>
        </motion.div>
      )}

      <div className="flex items-center mb-5">
        <motion.span className="bg-blue-100 p-2 rounded-full mr-4" whileHover={{ rotate: 15 }}>
          <Lightbulb className="h-7 w-7 text-blue-500" />
        </motion.span>
        <h2 className="text-2xl font-bold text-blue-900">Insights</h2>
      </div>

      <p className="text-blue-700 text-lg mb-6">{insightData?.summary}</p>

      {/* Get Insights button */}
      <motion.div className="mb-6">
        <motion.button
          onClick={fetchInsights}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : insightOutput ? (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh Insights
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Get Insights
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Display agent insights directly in the card - with ReactMarkdown */}
      {insightOutput && (
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h4 className="font-semibold text-blue-900 mb-4">Financial Analysis</h4>
          <div className="bg-white rounded-lg border border-blue-100 p-6 shadow-sm">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown components={MarkdownComponents}>{insightOutput}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      )}

      {/* Alerts section */}
      {insightData?.alerts && insightData.alerts.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">Alerts</h4>
          <div className="space-y-3">
            {insightData.alerts.map((alert, index: number) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${
                  alert.type === "warning"
                    ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                    : alert.type === "success"
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-blue-50 text-blue-800 border-blue-200"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <p className="font-medium">{alert.message}</p>
                {alert.action && <p className="mt-1 text-sm">{alert.action}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* RadialBarChart for Insights Categories */}
      {insightData?.insights && insightData.insights.length > 0 && (
        <div className="h-56 bg-blue-100 rounded-xl flex items-center justify-center">
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="80%"
              barSize={18}
              data={insightData.insights.map((cat, idx) => ({
                name: cat.category,
                value: cat.items.length,
                fill: ["#2563eb", "#60a5fa", "#1e40af", "#3b82f6", "#93c5fd"][idx % 5],
              }))}
            >
              <RadialBar background dataKey="value" cornerRadius={8} />
              <Legend iconSize={12} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip contentStyle={{ background: "#fff", borderRadius: 8, border: "1px solid #dbeafe" }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
