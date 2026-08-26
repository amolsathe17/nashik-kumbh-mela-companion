import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

const getStoredCreds = () => {
  try {
    const saved = localStorage.getItem('kumbh_admin_credentials');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return { email: 'admin@gmail.com', password: '123' };
};

const Login = () => {
  const stored = getStoredCreds();
  const [email, setEmail] = useState(stored.email || 'admin@gmail.com');
  const [password, setPassword] = useState(stored.password || '123');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/admin/overview');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative flex flex-col items-center justify-center p-4 py-12 sm:py-16">
      {/* Background Image stretched 100% width and height */}
      <img 
        src="/kumbh-bg.jpg" 
        alt="Kumbh Mela Background" 
        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />

      <div className="bg-slate-900/75 backdrop-blur-xl border border-white/20 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-5 relative z-10 my-auto">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500/90 to-orange-600/90 border border-white/30 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-xl backdrop-blur-md">
            🛕
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">Admin Control Portal</h2>
          <p className="text-xs text-amber-300 font-mono tracking-wider font-semibold drop-shadow">Nashik Kumbh Mela Companion</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/30 border border-red-400/50 rounded-2xl text-xs text-red-200 flex items-center gap-2 backdrop-blur-md">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-200 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-300 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-amber-400 backdrop-blur-md transition-all placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-300 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-amber-400 backdrop-blur-md transition-all placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold text-sm rounded-xl shadow-xl transition-transform hover:scale-101 active:scale-99 border border-amber-300/40"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
