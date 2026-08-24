import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@kumbhmela.gov.in');
  const [password, setPassword] = useState('Admin@123456');
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-lg">
            🛕
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Admin Control Portal</h2>
          <p className="text-xs text-amber-400 font-mono">Nashik Kumbh Mela Companion</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-2xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-101"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-700 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-amber-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Demo Admin Credentials:
          </div>
          <div>Email: <span className="font-mono text-slate-200">admin@kumbhmela.gov.in</span></div>
          <div>Password: <span className="font-mono text-slate-200">Admin@123456</span></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
