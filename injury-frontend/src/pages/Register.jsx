import { useState } from "react";
import { registerUser } from "../services/authApi";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return regex.test(password);
  };
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "password") {
      if (!validatePassword(value)) {
        setPasswordError(
          "Password must be 8+ chars, include uppercase, number & special character"
        );
      } else {
        setPasswordError("");
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(form);
      navigate("/login", { state: { success: "Registration successful. Please log in." } });
    } catch (err) {
      const backendError =
        err.response?.data?.error || "Registration failed";

      setError(backendError);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f1f5f9 100%)"
      }}>

      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* LOGO AREA */}
        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-2xl bg-white shadow-sm border border-slate-100 mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create Account</h1>
          <p className="text-slate-500 mt-2">Join the AI Injury Detection community</p>
        </div>

        {/* REGISTRATION CARD */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white relative">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USERNAME */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
              <input
                name="username"
                placeholder="johndoe123"
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700 placeholder:text-slate-300"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700 placeholder:text-slate-300"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700 placeholder:text-slate-300"
              />
            </div>
            {/* ERROR MESSAGE */}
            {error && (
              <p className="text-sm text-red-500 font-semibold mt-2 ml-1">
                {error}
              </p>
            )}

            {passwordError && (
              <p className="text-sm text-red-500 font-semibold ml-1">
                {passwordError}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading || passwordError}
              className={`w-full py-4 mt-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all transform active:scale-95 flex items-center justify-center gap-2 ${loading
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700"
                }`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : "Register Now"}
            </button>
          </form>

          {/* FOOTER LINK */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </div>
        </div>

        {/* TRUST BADGE */}
        <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-[0.2em] font-medium">
          Secured by AI Biometric Shield
        </p>
      </div>
    </div>
  );
};

export default Register;
