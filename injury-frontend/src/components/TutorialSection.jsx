const TutorialSection = ({ exercise }) => {
  if (!exercise) return null;

  return (
    <div className="w-full bg-transparent overflow-hidden">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-100 flex items-center gap-3">
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          Tutorial Video
        </h2>
        <span className="text-[10px] font-mono text-slate-500 tracking-tighter uppercase">
          Source: AI_Dataset_v2.1
        </span>
      </div>

      {/* VIDEO CONTAINER */}
      <div className="relative aspect-video mb-8 rounded-2xl overflow-hidden border border-slate-800 bg-black group/video shadow-2xl">
        <video
          src={exercise.videoUrl}
          controls
          className="w-full h-full object-cover transition-opacity duration-500 group-hover/video:opacity-90"
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Subtle Scanline Overlay for the video */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-50"></div>
      </div>

      {/* IMPORTANT NOTES SECTION */}
      <div className="relative bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-800 transition-all hover:border-slate-700">
        <div className="absolute top-0 left-6 -translate-y-1/2 bg-[#0a1628] px-3 py-0.5 border border-slate-800 rounded-full">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
              Analysis Notes
            </h3>
        </div>

        <ul className="space-y-3 mt-2">
          {exercise.notes.map((note, index) => (
            <li key={index} className="flex items-start gap-4 text-slate-300 text-sm leading-relaxed group">
              <span className="text-cyan-500/50 font-mono text-xs mt-0.5 group-hover:text-cyan-400 transition-colors">
                [0{index + 1}]
              </span>
              <span className="font-medium tracking-wide">
                {note}
              </span>
            </li>
          ))}
        </ul>
        
        {/* Technical Footer Accent */}
        <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center opacity-40">
            <div className="h-1 w-12 bg-cyan-500 rounded-full"></div>
            <span className="text-[8px] font-mono text-slate-500 uppercase">Neural Processing Optimized</span>
        </div>
      </div>
    </div>
  );
};

export default TutorialSection;