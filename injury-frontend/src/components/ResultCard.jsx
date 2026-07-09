const ResultCard = ({ result }) => {
  const risk = result.risk_percent;

  // Define technical status labels and theme colors based on risk levels
  const getStatusDetails = (percent) => {
    if (percent < 30) return { 
      label: "OPTIMAL FORM", 
      color: "text-emerald-400", 
      glow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]", 
      border: "border-emerald-500/30" 
    };
    if (percent < 60) return { 
      label: "MODERATE RISK", 
      color: "text-amber-400", 
      glow: "shadow-[0_0_15px_rgba(251,191,36,0.3)]", 
      border: "border-amber-500/30" 
    };
    return { 
      label: "CRITICAL ALIGNMENT", 
      color: "text-rose-400", 
      glow: "shadow-[0_0_15px_rgba(244,63,94,0.3)]", 
      border: "border-rose-500/30" 
    };
  };

  const status = getStatusDetails(risk);

  return (
    <div className={`mt-8 p-8 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-xl border ${status.border} ${status.glow} transition-all duration-700 relative overflow-hidden group`}>
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

      <header className="flex justify-between items-center mb-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Neural Analysis Result
        </h2>
        <div className={`px-2 py-0.5 rounded text-[8px] font-bold border ${status.color} ${status.border} uppercase tracking-widest`}>
          Live Scan v2.4
        </div>
      </header>

      <div className="flex flex-col items-center gap-4">
        {/* Risk Percentage Circle/Display */}
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 -rotate-90">
            <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-800" />
            <circle 
              cx="48" 
              cy="48" 
              r="44" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none"
              strokeDasharray="276" 
              strokeDashoffset={276 - (276 * risk) / 100}
              className={`${status.color} transition-all duration-1000 ease-out`} 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black font-mono ${status.color}`}>{risk}%</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Risk Score</span>
          </div>
        </div>

        <div className="text-center mt-2">
          <p className={`text-sm font-black uppercase tracking-[0.2em] mb-2 ${status.color}`}>
            {status.label}
          </p>
          
          <div className="inline-block px-4 py-3 bg-black/40 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">AI Feedback</p>
             <p className="text-xs text-slate-100 font-medium italic tracking-wide">
               "{result.fault}"
             </p>
          </div>
        </div>
      </div>

      {/* Technical footer bit */}
      <div className="mt-8 pt-4 border-t border-slate-800/50 flex justify-between items-center opacity-40">
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
          Processing Latency: 14ms
        </span>
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-slate-700 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;