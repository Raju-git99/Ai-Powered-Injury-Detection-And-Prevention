import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CameraPreview from "../components/CameraPreview";
import RecorderControls from "../components/RecorderControls";
import { analyzeVideo } from "../services/api";
import quoteBg from "../assets/quote-bg.jpg";
import profileIcon from "../assets/profile.png";

const AnalyzingSkeleton = () => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-slate-800 animate-pulse">
      <h3 className="text-xl font-black text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-3">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
        Neural Engine Processing...
      </h3>
      <div className="space-y-4">
        <div className="h-2 bg-slate-800 rounded-full w-full"></div>
        <div className="h-2 bg-slate-800 rounded-full w-3/4"></div>
        <div className="flex justify-center py-6">
          <div className="w-16 h-16 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

const Record = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const exercise = state?.exercise;

  const videoRef = useRef(null);
  const [uploadError, setUploadError] = useState("");
  const [videoBlob, setVideoBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [useUpload, setUseUpload] = useState(false);
  const [profile, setProfile] = useState(null);
  const [processedVideo, setProcessedVideo] = useState("");
  const [originalVideo, setOriginalVideo] = useState(null);

  const resetAnalysis = () => {
    setResult(null);
    setVideoBlob(null);
    setUseUpload(false);
    setUploadError("");
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/quote/")
      .then((res) => res.json())
      .then((data) => {
        setQuote(data.quote);
        setAuthor(data.author);
      })
      .catch(() => {
        setQuote("Train smart. Stay injury free.");
        setAuthor("AI Injury Detection");
      });
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.log("Profile fetch failed");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!exercise) navigate("/");
  }, [exercise, navigate]);

  const MAX_VIDEO_SIZE = 20 * 1024 * 1024;
  const MAX_VIDEO_DURATION = 30;

  const handleUploadVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_VIDEO_SIZE) {
      setUploadError("Video size must be less than 20MB");
      setVideoBlob(null);
      setUseUpload(false);
      e.target.value = null;
      return;
    }

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = URL.createObjectURL(file);

    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoElement.src);
      if (videoElement.duration > MAX_VIDEO_DURATION) {
        setUploadError("Video duration must be 30 seconds or less");
        setVideoBlob(null);
        setUseUpload(false);
        e.target.value = null;
        return;
      }
      setUploadError("");
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setResult(null);
      setVideoBlob(null);
      setTimeout(() => {
        setVideoBlob(file);
        setUseUpload(true);
      }, 0);
      e.target.value = null;
    };
  };

  const handleAnalyze = async () => {
    if (!videoBlob) return alert("Please record or upload a video");
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeVideo(videoBlob, exercise);
      setResult(res.data);
      console.log(res.data);

      // Original uploaded video
      setOriginalVideo(URL.createObjectURL(videoBlob));

      // Processed video from backend
      setProcessedVideo(
        `http://127.0.0.1:8000${res.data.processed_video}`
      );
    } catch (err) {
      console.log("Analysis failed:", err);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    // Standardized status box for non-success states (idle, no_pose, etc.)
    const statusBox = (title, msg, type) => {
      const isCritical = type === "red";
      const glowColor = isCritical ? "rgba(244, 63, 94, 0.4)" : "rgba(251, 191, 36, 0.4)";
      const textColor = isCritical ? "text-rose-400" : "text-amber-400";
      const borderColor = isCritical ? "border-rose-500/30" : "border-amber-500/30";

      return (
        <div>
          <div className={`bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] border ${borderColor} shadow-2xl relative overflow-hidden`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}
                style={{ boxShadow: `0 0 10px ${glowColor}` }}></div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textColor}`}>
                System Alert: {title}
              </p>
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
              "{msg}"
            </p>
            {/* Decorative Technical Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center opacity-30">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">Status: {result.status}</span>
              <div className={`h-1 w-8 ${isCritical ? 'bg-rose-900' : 'bg-amber-900'} rounded-full`}></div>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={resetAnalysis}
              className="px-12 py-3 bg-cyan-500 text-slate-950 rounded-xl font-black uppercase tracking-widest hover:bg-cyan-400"
            >
              Back To Recording
            </button>
          </div>
        </div>
      );
    };

    // Routing the logic based on result.status
    if (result.status === "idle") return statusBox("No Workout Detected", result.message, "yellow");
    if (result.status === "no_pose") return statusBox("No Person Detected", result.message, "red");
    if (result.status === "exercise_not_detected") return statusBox("No Exercise Detected", result.message, "yellow");
    if (result.status === "invalid_exercise") return statusBox("Invalid Exercise", result.message, "red");

    // SUCCESS CASE (Neural Analysis Report)
    const riskColor = result.risk_percent > 60 ? "text-rose-400" : result.risk_percent > 30 ? "text-amber-400" : "text-emerald-400";
    const riskBg = result.risk_percent > 60 ? "bg-rose-500" : result.risk_percent > 30 ? "bg-amber-500" : "bg-emerald-500";
    const originalVideo = result.original_video
      ? `http://127.0.0.1:8000${result.original_video}`
      : null;

    const processedVideo = result.processed_video
      ? `http://127.0.0.1:8000${result.processed_video}`
      : null;
    console.log(processedVideo);
    return (
      <div className="space-y-6">

        {/* VIDEO COMPARISON */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">

          {/* ORIGINAL VIDEO */}

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 w-full">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-3">
              Original Video
            </h4>

            {originalVideo ? (
              <video
                controls
                src={originalVideo}
                className="w-full h-80 object-contain rounded-xl"
              />
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-xs border border-dashed border-slate-700 rounded-xl">
                Original Video will appear here
              </div>
            )}
          </div>

          {/* PROCESSED VIDEO */}

          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 w-full">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-3">
              Processed Video
            </h4>

            {processedVideo ? (
              <video
                controls
                src={processedVideo}
                className="w-full h-80 object-contain rounded-xl"
              />
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-xs border border-dashed border-slate-700 rounded-xl">
                Processed Video will appear here
              </div>
            )}
          </div>

        </div>

        {/* EXISTING REPORT CARD */}

        <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <div className="w-12 h-12 border-t-2 border-r-2 border-cyan-500 rounded-tr-xl"></div>
          </div>

          <h3 className="text-xs font-black text-slate-100 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
            Neural Analysis Report
          </h3>

          <div className="space-y-5">
            <div className="bg-black/40 p-4 rounded-2xl border border-slate-800/50">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Stability Feedback</p>
              <p className={`text-sm font-black uppercase tracking-wide ${riskColor}`}>
                {result.fault}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Accuracy Score</span>
                <span className="text-xl font-black text-cyan-400 font-mono">{result.accuracy_score}%</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Safety Status</span>
                <span className={`text-[10px] font-black uppercase ${riskColor}`}>
                  {result.risk_percent < 30 ? "Optimal" : "Review Form"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Injury Risk Probability</span>
                <span className={`text-sm font-black ${riskColor}`}>{result.risk_percent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${riskBg} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                  style={{ width: `${result.risk_percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        {result && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setResult(null);
                setVideoBlob(null);

                if (useUpload) {
                  setUseUpload(false);
                }
              }}
              className="px-12 py-3 bg-cyan-500 text-slate-950 rounded-xl font-black uppercase tracking-widest hover:bg-cyan-400 transition"
            >
              Back To Recording
            </button>
          </div>
        )}
        {/* <div className="flex justify-center mt-6">
          <button
            onClick={resetAnalysis}
            className="px-8 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all"
          >
            Analyze Another Video
          </button>
        </div> */}
      </div>
    );

  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-[#050b18] via-[#0a1628] to-[#020617] text-slate-200 selection:bg-cyan-500/30 font-sans">
      <Navbar />

      {/* NEURAL GLOWS */}
      <div className="fixed top-[-100px] left-[10%] w-[400px] h-[400px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 w-full max-w-[1600px] mx-auto px-4 lg:px-6 h-[calc(100vh-64px)]">

        {/* LEFT SIDEBAR: PROFILE & QUOTE */}
        <div className="hidden lg:block lg:col-span-2 py-6 h-full">
          <div className="h-full rounded-[2.5rem] relative border border-slate-800 bg-slate-900/40 backdrop-blur-xl group">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: `url(${quoteBg})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050b18]/80 to-[#050b18]"></div>

            <div className="relative z-10 h-full flex flex-col justify-center p-6 text-center">
              <div className="mb-8">
                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4">Daily Insight</p>
                <p className="italic text-xs leading-relaxed text-slate-300 font-medium">"{quote}"</p>
                <p className="mt-3 text-[8px] tracking-[0.2em] uppercase text-slate-500 font-black">— {author}</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-4 rounded-3xl flex items-center gap-3 shadow-2xl mt-auto">
                <img src={profileIcon} className="w-10 h-10 rounded-full border-2 border-cyan-500 object-cover" alt="Profile" />
                <div className="overflow-hidden text-left">
                  <p className="text-[10px] font-black text-slate-100 truncate uppercase tracking-tighter">{profile?.name || "Loading..."}</p>
                  <button onClick={() => navigate("/profile")} className="text-[9px] font-bold text-cyan-500 hover:text-cyan-300 uppercase tracking-widest mt-1 transition-colors">Profile →</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN FEED AREA */}
        <div
          className={`col-span-12 ${result ? "lg:col-span-10" : "lg:col-span-7"
            } px-4 lg:px-8 py-6 flex flex-col h-full overflow-y-auto lg:overflow-visible`}
        >
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-lg font-black uppercase tracking-[0.3em] text-slate-100">
              Recording: <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{exercise === "Jumping Squats" ? "Squats" : exercise}</span>
            </h2>
            <div className="px-3 py-1 rounded bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Live Monitor</span>
            </div>
          </div>
          {!result && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-md"></div>

              <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border border-slate-800 transition-all">
                {useUpload && videoBlob ? (
                  <video key={videoBlob.name} src={URL.createObjectURL(videoBlob)} controls className="w-full h-full object-contain" />
                ) : <CameraPreview videoRef={videoRef} />}

                <div className="absolute top-6 left-6 flex gap-3">
                  <span className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-mono text-cyan-500 uppercase tracking-widest">FPS: 30</span>
                  <span className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-mono text-cyan-500 uppercase tracking-widest">Latency: 14MS</span>
                </div>
              </div>
            </div>
          )}
          {!result && (
            <div className="flex flex-col items-center gap-6 mt-8">
              <div className="flex items-center gap-4">
                {!useUpload && (
                  <RecorderControls videoRef={videoRef} onRecordingComplete={setVideoBlob} disabled={loading} />
                )}

                <label className={`h-12 px-8 flex items-center justify-center font-black text-[10px] tracking-widest uppercase rounded-2xl border transition-all cursor-pointer   
            ${loading ? "bg-slate-800 border-slate-700 text-slate-600" : "bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500 hover:text-cyan-400"}`}>
                  {useUpload ? "Change Video" : "Upload Video"}
                  <input type="file" accept="video/*" hidden disabled={loading} onChange={handleUploadVideo} />
                </label>

                {useUpload && (
                  <button onClick={() => { setUseUpload(false); setVideoBlob(null); }} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">
                    Exit Upload Mode
                  </button>
                )}
              </div>
              {uploadError && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest animate-pulse mt-4">{uploadError}</p>
              }
            </div>
          )}
          {result && (
            <div className="mt-8">
              {renderResult()}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        {!result && (
          <div className="col-span-12 lg:col-span-3 py-6 h-full flex flex-col gap-6 pr-2 lg:overflow-y-auto">

            {!result && (
              <button
                onClick={handleAnalyze}
                disabled={loading || !videoBlob}
                className={`w-full py-5 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase transition-all transform active:scale-95 shadow-2xl relative overflow-hidden group
    ${loading || !videoBlob
                    ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                    : "bg-cyan-500 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:bg-cyan-400"
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading && (
                    <div className="w-2 h-2 bg-slate-950 rounded-full animate-ping"></div>
                  )}
                  {loading ? "Initializing AI..." : "Analyze Session"}
                </span>
              </button>
            )}

            <div className="transition-all duration-700 h-full">

              {loading && <AnalyzingSkeleton />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Record;