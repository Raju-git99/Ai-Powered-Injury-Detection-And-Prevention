const ExerciseCard = ({ name, image, onSelect, risk = "low" }) => {
  const getRiskDetails = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return { label: "Advanced Mobility", color: "text-rose-400", dots: 3 };
      case "medium":
        return { label: "Focus Required", color: "text-amber-400", dots: 2 };
      default:
        return { label: "Form Safety: Optimal", color: "text-emerald-400", dots: 1 };
    }
  };

  const riskDetails = getRiskDetails(risk);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className="relative group w-full"
    >

      {/* Neon Glow Border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-cyan-400/60 via-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 blur-[2px] transition duration-500"></div>

      {/* Card */}
      <div className="relative w-full bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 transition-all duration-500 p-4 flex flex-col overflow-hidden
  group-hover:border-cyan-500/60
  group-hover:shadow-[0_10px_40px_rgba(0,255,255,0.15)]
  group-hover:-translate-y-2">

        {/* Exercise Image */}
        <div className="relative w-full h-40 flex items-center justify-center bg-[#0f172a] rounded-xl overflow-hidden border border-slate-800 transition-colors group-hover:border-slate-700">
          <img
            src={image}
            alt={name}
            className="max-h-[80%] max-w-[80%] object-contain pointer-events-none transition-transform duration-700 group-hover:scale-110 filter brightness-110"
          />

          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
        </div>

        {/* Info */}
        <div className="mt-5 flex flex-col gap-2">
          <h3 className="font-bold text-slate-100 tracking-wide text-lg">
            {name}
          </h3>

          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              <div className="flex gap-1 mb-1">

                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm transition-all duration-500 ${i < riskDetails.dots
                        ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]"
                        : "text-slate-600"
                      }`}
                  >
                    ★
                  </span>
                ))}

              </div>

              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Est. Time: 4:30 min
              </span>
            </div>

            <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                Safety Status
              </p>

              <p className={`text-[10px] font-bold uppercase transition-colors duration-500 ${riskDetails.color}`}>
                {riskDetails.label}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom neon bar */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-700 group-hover:w-full"></div>

      </div>
    </div>

  );
};

export default ExerciseCard;
