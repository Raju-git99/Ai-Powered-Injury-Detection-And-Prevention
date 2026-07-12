import { data, useNavigate } from "react-router-dom";
import ExerciseCard from "../components/ExerciseCard";
import { tutorials } from "../data/tutorials";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import squatImg from "../assets/jumping-squat.jpg";
import lungeImg from "../assets/lunges.jpg";
import pushupImg from "../assets/Pushups.jpg";
import bridgeImg from "../assets/bridges.jpg";
import legRaiseImg from "../assets/leg-raises.jpg";
import climberImg from "../assets/mountain-climbers.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [avgScore, setAvgScore] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access", data.token);

    fetch("http://127.0.0.1:8000/api/avg-form-score/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.json())
      .then((data) => {
        setAvgScore(data.avg_form_score);
      })
      .catch((err) => console.error("Failed to fetch average score:", err));
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/exercises/")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        const firstCategory = Object.keys(data.categories)[0];
        setSelectedCategory(firstCategory);
        setExercises(data.categories[firstCategory]);
      })
      .catch((err) => console.error("Failed to fetch exercises:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (exerciseName) => {
    navigate("/tutorial", {
      state: { exercise: exerciseName, tutorial: tutorials[exerciseName] },
    });
  };

  const getRiskLevel = (name) => {
    const highRisk = ["Squats", "Mountain Climbers"];
    const mediumRisk = ["Pushups", "Lunges"];

    if (highRisk.includes(name)) return "high";
    if (mediumRisk.includes(name)) return "medium";
    return "low";

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050b18] via-[#0a1628] to-[#020617] text-slate-200 selection:bg-cyan-500/30">
      <Navbar />

      {/* Neural Glow Background */}
      <div className="fixed top-[-150px] left-[20%] w-[500px] h-[500px] bg-cyan-500/20 blur-[160px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-150px] right-[20%] w-[500px] h-[500px] bg-blue-600/20 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <header className="pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700 backdrop-blur-md mb-6">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              AI-Powered Wellness
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Real-time Form{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
              Analysis
            </span>{" "}
            System
          </h1>

          {/* STATUS BAR */}
          <div className="max-w-2xl mx-auto mb-10 p-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl py-3 flex justify-around items-center text-[11px] font-medium uppercase tracking-widest text-slate-400 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]">

              <span className="flex items-center gap-2">
                System Time:
                <b className="text-cyan-400 font-mono tracking-normal text-xs">
                  {formattedTime}
                </b>
              </span>

              <span className="hidden sm:inline text-slate-700">|</span>

              <span>
                Avg Score: {""} <b className="text-cyan-400">
                  {avgScore !== null ? `${avgScore}%` : "-"}
                </b>
              </span>
            </div>
          </div>

          {/* CATEGORY BUTTONS */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setExercises(categories[category]);
                }}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 border
${selectedCategory === category
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                    : "bg-slate-900/60 border-slate-700 text-slate-400 hover:border-cyan-500 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              Synchronizing Neural Engine...
            </p>
          </div>
        ) : (
          <main className="pb-32">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">
                Workouts
              </h2>

              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-900/60 border border-slate-700 px-3 py-1 rounded-md backdrop-blur-md">
                {exercises.length} Units Available
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {exercises.map((exName) => {
                const currentRisk = getRiskLevel(exName);

                const exImage =
                  exName === "Jumping Squats"
                    ? squatImg
                    : exName === "Lunges"
                      ? lungeImg
                      : exName === "Pushups"
                        ? pushupImg
                        : exName === "Bridges"
                          ? bridgeImg
                          : exName === "Leg Raises"
                            ? legRaiseImg
                            : climberImg;

                return (
                  <div
                    key={exName}
                    onClick={() => handleSelect(exName)}
                    className="group relative transition-all duration-500"
                  >
                    {/* Glow border */}
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-400/60 via-blue-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-[2px]"></div>

                    <div className="relative bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-cyan-500/60 group-hover:shadow-[0_10px_40px_rgba(0,255,255,0.15)]">
                      <ExerciseCard
                        name={exName}
                        image={exImage}
                        risk={currentRisk}
                        onSelect={() => handleSelect(exName)}
                      />

                      <div className="absolute top-4 right-4 py-1 px-2 rounded bg-black/40 backdrop-blur-md border border-white/10">
                        <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-tighter">
                          {selectedCategory}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        )}
      </div>
    </div>

  );
};

export default Dashboard;