const HistoryCard = ({ item }) => {
  const isOptimal = item.risk_percent < 30;
  const isCritical = item.risk_percent > 60;

  const riskColor = isOptimal 
    ? "text-emerald-400" 
    : isCritical 
    ? "text-rose-400" 
    : "text-amber-400";

  return (
    <div className="relative group overflow-hidden">
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br opacity-20 group-hover:opacity-40 transition blur-lg rounded-[2rem] 
        ${isOptimal ? 'from-emerald-500' : isCritical ? 'from-rose-500' : 'from-amber-500'}`}></div>
      
      <div className="relative bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 transition-all hover:border-slate-700">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-black text-slate-100 tracking-tight">{item.exercise}</h3>
          <span className="text-[10px] font-mono text-slate-500 bg-black/40 px-2 py-1 rounded border border-slate-800">
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Feedback</p>
            <p className="text-xs text-slate-300 italic font-medium">"{item.fault}"</p>
          </div>
          
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Risk Index</p>
            <p className={`text-2xl font-black font-mono leading-none ${riskColor}`}>
              {item.risk_percent}%
            </p>
          </div>
        </div>
        
        {/* Decorative footer line */}
        <div className="mt-4 h-[1px] w-full bg-slate-800 relative overflow-hidden">
           <div 
             className={`absolute left-0 top-0 h-full transition-all duration-1000 
               ${isOptimal ? 'bg-emerald-500' : isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}
             style={{ width: `${item.risk_percent}%` }}
           ></div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;