import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("today");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/history/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        const records = data.history || [];
        setHistory(records);
        setFilteredHistory(records);
      } catch {
        alert("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  useEffect(() => {
    if (filter === "All") {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(history.filter((h) => h.exercise === filter));
    }
  }, [filter, history]);

  const getFilteredByTime = (data) => {
    const now = new Date();
    return data.filter((item) => {
      const itemDate = new Date(item.created_at);
      if (timeRange === "today") {
        return (
          itemDate.getDate() === now.getDate() &&
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }
      if (timeRange === "week") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return itemDate >= sevenDaysAgo;
      }
      if (timeRange === "month") {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  };

  const exercises = ["All", ...new Set(history.map((h) => h.exercise))];
  const chartData = [...getFilteredByTime(filteredHistory)].reverse();

  return (
    <div className="min-h-screen bg-[#050b18] text-slate-200 selection:bg-cyan-500/30">
      <Navbar />

      {/* NEURAL GLOWS */}
      <div className="fixed top-[-100px] left-[10%] w-[400px] h-[400px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <header className="pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700 backdrop-blur-md mb-6">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Biometric Logs v2.1
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Exercise <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">History</span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            Review your neural form data and track your safety progress over time.
          </p>
        </header>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none px-6 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-300 focus:border-cyan-500 outline-none transition-all cursor-pointer min-w-[140px]"
            >
              {exercises.map((ex, i) => (
                <option key={i} value={ex} className="bg-slate-900">{ex}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none px-6 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-300 focus:border-cyan-500 outline-none transition-all cursor-pointer min-w-[140px]"
            >
              <option value="today" className="bg-slate-900">Today</option>
              <option value="week" className="bg-slate-900">This Week</option>
              <option value="month" className="bg-slate-900">This Month</option>
              <option value="all" className="bg-slate-900">All Time</option>
            </select>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Risk Level Trend</h3>
            <div className="h-1 w-12 bg-cyan-500 rounded-full"></div>
          </div>
          
          {chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis
                    dataKey="created_at"
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(d) => new Date(d).toLocaleDateString()}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '20px',
                      border: '1px solid #334155',
                      backgroundColor: '#0f172a',
                      color: '#f1f5f9',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                      fontSize: '12px',
                    }}
                    labelFormatter={(l) => new Date(l).toLocaleString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="risk_percent"
                    stroke="#06b6d4"
                    strokeWidth={4}
                    dot={{ r: 5, fill: '#06b6d4', strokeWidth: 2, stroke: '#050b18' }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#22d3ee' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No Biometric Data Found</p>
            </div>
          )}
        </div>

        {/* HISTORY LIST */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 ml-4 mb-6">Detailed Activity Logs</h3>
          {loading ? (
             <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
             </div>
          ) : (
            getFilteredByTime(filteredHistory).map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-md"></div>
                <div className="relative bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 flex justify-between items-center transition-all hover:border-slate-700">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-black text-slate-100 text-lg tracking-tight leading-none mb-2">{item.exercise}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.fault === "Good posture" ? "bg-emerald-500" : "bg-rose-500"}`}></div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${item.fault === "Good posture" ? "text-emerald-400" : "text-rose-400"}`}>
                          {item.fault}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-2xl font-black font-mono leading-none mb-1 ${item.risk_percent > 60 ? "text-rose-400" : "text-cyan-400"}`}>
                      {item.risk_percent}%
                    </p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;