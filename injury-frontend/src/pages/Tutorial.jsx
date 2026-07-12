import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TutorialSection from "../components/TutorialSection";
import { tutorials } from "../data/tutorials";
import Navbar from "../components/Navbar";

const Tutorial = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const exercise = state?.exercise;
  const [accepted, setAccepted] = useState(false);

  const handleStart = () => {
    if (!accepted) return;
    navigate("/record", { state: { exercise } });
  };

  const sideViewRequired = [
    "Pushups", "Bridges", "Leg Raises", "Mountain Climbers"
  ].includes(exercise);

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050b18]">
        <div className="text-center p-8 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl">
          <p className="text-xl font-semibold text-slate-100 font-mono tracking-tight">SYSTEM: NO DATA SELECTED</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-cyan-400 hover:text-cyan-300 font-bold uppercase text-xs tracking-[0.2em] transition-all">
            Return to Command Center
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050b18] via-[#0a1628] to-[#020617] text-slate-200 selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      <Navbar />

      {/* NEURAL GLOWS (Matches Dashboard) */}
      <div className="fixed top-[-100px] left-[10%] w-[400px] h-[400px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">

        {/* HEADER AREA */}
        <header className="pt-24 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700 backdrop-blur-md mb-6">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Technique Guide
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Mastering the <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">{exercise === "Jumping Squats" ? "Squats" : exercise}</span>
          </h1>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Watch the neural guide carefully. Precision in form is the primary factor in preventing muscular strain and long-term injury.
          </p>
        </header>

        {/* MAIN CONTENT GRID */}
        <main className="grid grid-cols-12 gap-10 items-start">

          {/* LEFT: VIDEO & NOTES CONTAINER */}
          <div className="col-span-12 lg:col-span-8 group relative">
            {/* Outer Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/30 to-blue-500/10 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-md"></div>

            {/* Main Card: Removed overflow-hidden so notes can grow */}
            <div className="relative bg-slate-900/40 backdrop-blur-xl p-4 md:p-6 rounded-[2.5rem] border border-slate-800 transition-all duration-500 group-hover:border-slate-700 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.1)]">

              {/* IMPORTANT: We moved TutorialSection OUTSIDE of the aspect-video div. 
       The aspect-video should only wrap the actual video element inside TutorialSection. 
    */}
              <TutorialSection exercise={tutorials[exercise]} />

              {/* Technical Label Below Everything */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                <div className="flex gap-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">FPS: 30</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Resolution: 1080P</span>
                </div>
                <div className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div> AI Reference Loaded
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: INSTRUCTIONS & SETUP */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* CAMERA ORIENTATION */}
            {sideViewRequired && (
              <div className="bg-amber-500/5 border border-amber-500/30 p-6 rounded-[2rem] backdrop-blur-sm group hover:border-amber-500/50 transition-all duration-300">
                <h3 className="text-amber-500 font-black mb-2 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <span className="text-lg">⚠</span> Camera Orientation
                </h3>
                <p className="text-[11px] text-amber-200/60 leading-relaxed font-bold">
                  FOR OPTIMAL AI ACCURACY, PLEASE PERFORM THIS UNIT IN A <span className="underline text-amber-400">SIDE-FACE POSITION</span>.
                </p>
              </div>
            )}

            {/* AI ENVIRONMENT SETUP */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-900/40 border border-indigo-500/30 p-8 rounded-[2rem] shadow-xl text-white backdrop-blur-md relative overflow-hidden group">
              {/* Decorative Scanline */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

              <h3 className="text-sm font-black mb-6 flex items-center gap-3 uppercase tracking-tighter">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/40 text-[10px] font-black border border-indigo-400">01</span>
                AI Detection Protocol
              </h3>
              <ul className="text-xs space-y-4 text-indigo-100/70 font-bold tracking-wide">
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full"></div> Place camera 6-8 feet away.
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full"></div> Ensure your full body is visible.
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full"></div> Avoid bright light directly behind you.
                </li>
              </ul>
            </div>

            {/* CONFIRMATION CARD */}
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
              <h3 className="text-slate-100 font-black mb-6 flex items-center gap-3 text-sm uppercase tracking-tighter">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black border border-cyan-500/30">02</span>
                Ready to Analyze?
              </h3>

              <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-2xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer w-6 h-6 opacity-0 absolute cursor-pointer"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center 
                    ${accepted ? 'bg-cyan-500 border-cyan-500' : 'bg-transparent border-slate-700 peer-hover:border-slate-500'}`}>
                    {accepted && <svg className="w-4 h-4 text-slate-900 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase leading-tight tracking-wider">
                  I confirm the neural guidance review.
                </span>
              </label>

              <button
                onClick={handleStart}
                disabled={!accepted}
                className={`w-full mt-8 py-5 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all transform active:scale-95 flex items-center justify-center gap-3 ${accepted
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:bg-cyan-400"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
              >
                {accepted && <div className="w-2 h-2 bg-slate-950 rounded-full animate-ping"></div>}
                Initialize AI Session
              </button>
            </div>
          </div>
        </main>

        {/* FOOTER NAV */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-all text-[10px] font-black tracking-[0.4em] uppercase py-2 px-6 border border-slate-800 rounded-full hover:border-cyan-500/30"
          >
            ← Terminate & Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;