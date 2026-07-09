import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../services/profileApi";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/profile.png"; // Use your existing asset

const ViewProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    age: "",
    height_cm: "",
    weight_kg: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [Saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    if (Saved) setSaved(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUserProfile(profile);
      setSaved(true);
      setError("");
    } catch (err) {
      setError("Failed to update biometric data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b18] text-slate-200 selection:bg-cyan-500/30">
      <Navbar />

      {/* NEURAL GLOW BACKGROUNDS */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4">
        
        {/* HEADER SECTION */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700 backdrop-blur-md mb-6">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Biometric Profile v2.1
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            User <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Identification</span>
          </h1>
          <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium">
            Maintain accurate biometric parameters to optimize neural form detection accuracy.
          </p>
        </header>

        {/* MAIN PROFILE CARD */}
        <div className="relative w-full max-w-2xl group">
          {/* Outer Glow on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
          
          <div className="relative bg-slate-900/60 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-2xl transition-all">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              
              {/* LEFT: AVATAR SECTION */}
              <div className="md:col-span-4 flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"></div>
                  <img 
                    src={profileIcon} 
                    alt="Avatar" 
                    className="relative w-32 h-32 rounded-full border-2 border-slate-700 p-1 object-cover" 
                  />
                  
                </div>
                <div className="text-center">
                   <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                   <p className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">DATA SYNCED</p>
                </div>
              </div>

              {/* RIGHT: DATA FIELDS */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Full Name */}
                <div className="group/field">
                  <label className="block text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 ml-1 transition-colors group-focus-within/field:text-cyan-400">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={profile.name || ""}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 outline-none transition-all text-slate-200 font-medium placeholder:text-slate-700"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Gender */}
                  <div className="group/field">
                    <label className="block text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 ml-1 group-focus-within/field:text-cyan-400">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={profile.gender || ""}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 outline-none text-slate-200 font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div className="group/field">
                    <label className="block text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 ml-1 group-focus-within/field:text-cyan-400">
                      Age
                    </label>
                    <input
                      name="age"
                      type="number"
                      value={profile.age || ""}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 outline-none text-slate-200 font-medium"
                      placeholder="Years"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Height */}
                  <div className="group/field">
                    <label className="block text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 ml-1 group-focus-within/field:text-cyan-400">
                      Height (cm)
                    </label>
                    <input
                      name="height_cm"
                      type="number"
                      value={profile.height_cm || ""}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 outline-none text-slate-200 font-medium"
                    />
                  </div>

                  {/* Weight */}
                  <div className="group/field">
                    <label className="block text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 ml-1 group-focus-within/field:text-cyan-400">
                      Weight (kg)
                    </label>
                    <input
                      name="weight_kg"
                      type="number"
                      value={profile.weight_kg || ""}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 outline-none text-slate-200 font-medium"
                    />
                  </div>
                </div>

                {/* Feedback Messages */}
                {error && <p className="text-xs font-bold text-rose-500 tracking-wide bg-rose-500/5 p-3 rounded-lg border border-rose-500/20">{error}</p>}
                {Saved && <p className="text-xs font-bold text-emerald-400 tracking-wide bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20">System updated successfully.</p>}

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all shadow-2xl relative overflow-hidden group/btn ${
                    loading
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] active:scale-[0.98]"
                  }`}
                >
                  <span className="relative z-10">{loading ? "Processing..." : "Commit Changes"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* BACK BUTTON */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="text-[10px] font-black text-slate-500 hover:text-cyan-400 uppercase tracking-[0.4em] transition-all flex items-center gap-3 py-2 px-6 border border-slate-800 rounded-full hover:border-cyan-500/30 backdrop-blur-md"
            >
              ← Terminate Session
            </button>
          </div>
        </div>
        
        <p className="mt-10 text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          End-to-end encrypted biometric storage active
        </p>
      </div>
    </div>
  );
};

export default ViewProfile;