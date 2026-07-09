import { useState } from "react";
import { loginUser } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Login = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showpassword, setShowpassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.success || "";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginUser(form);
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6"
            style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f1f5f9 100%)"
            }}>

            {/* BACKGROUND AMBIENT BLOBS */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* BRAND LOGO AREA */}
                <div className="text-center mb-10">
                    <div className="inline-block p-3 rounded-2xl bg-white shadow-sm border border-slate-100 mb-4 transition-transform hover:scale-110">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20a10.003 10.003 0 006.21-2.06l.053.09m-9.713-2.11c.421.144.871.21 1.33.21.46 0 .91-.066 1.33-.21m-2.66 0c-.39-1.21-.61-2.502-.61-3.84a10.003 10.003 0 014.21-8.15m4.21 8.15c0 1.338-.22 2.63-.61 3.84m-2.66 0c.42-.144.87-.21 1.33-.21.46 0 .91.066 1.33.21m-6.47-1.44c-.39-1.21-.61-2.502-.61-3.84 0-1.338.22-2.63.61-3.84m6.47 1.44c.39-1.21.61-2.502.61-3.84 0-1.338-.22-2.63-.61-3.84" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-2 font-medium">Log in to track your form analytics</p>
                </div>

                {/* LOGIN FORM CARD */}
                <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white relative ring-1 ring-slate-200/50">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* USERNAME INPUT */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                            <input
                                name="username"
                                placeholder="Enter your username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700 placeholder:text-slate-300 shadow-sm"
                            />
                        </div>

                        {/* PASSWORD INPUT */}
                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                {/* <span className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer uppercase tracking-tighter">Forgot?</span> */}
                            </div>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showpassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowpassword(!showpassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showpassword ? "👁️‍🗨️" : "👁️"}
                                </button>
                            </div>
                        </div>
                        {/* ERROR MESSAGE */}
                        {error && (
                            <p className="text-sm text-red-500 font-semibold mt-2 ml-1">
                                {error}
                            </p>
                        )}
                        {/* SUCCESS MESSAGE */}
                        {successMessage && (
                            <p className="text-sm text-green-600 font-semibold mt-2 ml-1">
                                {successMessage}
                            </p>
                        )}
                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 mt-2 rounded-2xl font-black text-sm tracking-widest uppercase transition-all transform active:scale-95 flex items-center justify-center gap-2 ${loading
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Secure Login"}
                        </button>
                    </form>

                    {/* REGISTRATION REDIRECT */}
                    <div className="mt-8 text-center text-sm font-medium text-slate-500">
                        New to AI Detection?{" "}
                        <span
                            className="text-blue-600 font-bold hover:underline cursor-pointer transition-colors"
                            onClick={() => navigate("/register")}
                        >
                            Register here
                        </span>
                    </div>
                </div>

                {/* SECURITY FOOTER */}
                <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-[0.2em] font-semibold">
                    Encrypted Biometric Gateway
                </p>
            </div>
        </div>
    );
};

export default Login;