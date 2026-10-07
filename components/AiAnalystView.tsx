import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react';
import { DashboardData, AiInsightResponse } from '../types';
import { generateBusinessInsights } from '../services/geminiService';

interface AiAnalystViewProps {
  data: DashboardData;
}

export const AiAnalystView: React.FC<AiAnalystViewProps> = ({ data }) => {
  const [insights, setInsights] = useState<AiInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateBusinessInsights(data);
      setInsights(result);
    } catch (err) {
      setError("Failed to generate insights. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch or when data changes significantly
  useEffect(() => {
    fetchInsights();
  }, [data.tenantId]); // Re-fetch if tenant changes

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="text-indigo-600" />
            AI Analyst
          </h1>
          <p className="text-slate-500 mt-1">Powered by Gemini 2.5 Flash</p>
        </div>
        <button 
          onClick={fetchInsights} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm shadow-indigo-200"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? "Analyzing..." : "Refresh Analysis"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {loading && !insights && (
        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 border-dashed">
           <Sparkles className="text-indigo-400 animate-pulse mb-4" size={48} />
           <p className="text-slate-500 font-medium">Gemini is analyzing your data...</p>
        </div>
      )}

      {!loading && !insights && !error && (
         <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 border-dashed">
           <p className="text-slate-500">No insights available.</p>
        </div>
      )}

      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sentiment Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Business Sentiment</h3>
            <div className="flex flex-col items-center text-center py-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                insights.sentiment === 'Positive' ? 'bg-green-100 text-green-600' :
                insights.sentiment === 'Negative' ? 'bg-red-100 text-red-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                <TrendingUp size={32} />
              </div>
              <h2 className={`text-3xl font-bold ${
                insights.sentiment === 'Positive' ? 'text-green-700' :
                insights.sentiment === 'Negative' ? 'text-red-700' :
                'text-yellow-700'
              }`}>{insights.sentiment}</h2>
              <p className="text-slate-500 text-sm mt-2">Based on revenue and churn trends</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-indigo-500" size={20} />
              <h3 className="text-lg font-bold text-slate-800">Executive Summary</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-lg">
              {insights.summary}
            </p>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-3 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-xl shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-12 opacity-10">
               <BrainCircuit size={200} />
             </div>
             <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/30 rounded-lg backdrop-blur-sm border border-indigo-500/50">
                    <Sparkles size={24} className="text-indigo-300" />
                  </div>
                  Strategic Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {insights.recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-xl hover:bg-white/15 transition-colors">
                      <div className="flex items-start gap-3">
                         <div className="mt-1 min-w-[24px] h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                           {idx + 1}
                         </div>
                         <p className="text-indigo-50 font-medium leading-snug">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};