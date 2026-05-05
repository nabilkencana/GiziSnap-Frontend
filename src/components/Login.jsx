import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ChevronRight, ChevronLeft, AlertCircle, Leaf, Scan, Shield, TrendingUp } from 'lucide-react'

const GOALS = [
  { id: 'WEIGHT_LOSS',   label: 'Turun Berat Badan', emoji: '🥗', desc: 'Defisit kalori harian' },
  { id: 'DIABETES_CARE', label: 'Diabetes Care',      emoji: '🩺', desc: 'Kontrol karbohidrat' },
  { id: 'BODYBUILDING',  label: 'Pembentukan Otot',   emoji: '💪', desc: 'Tinggi protein' },
]

const FEATURES = [
  { icon: Scan,      title: 'Scan AI',      desc: 'Foto makanan, AI kenali nutrisinya' },
  { icon: Shield,    title: 'Data Lokal',    desc: '60+ makanan Indonesia terverifikasi' },
  { icon: TrendingUp,title: 'Lacak Harian',  desc: 'Monitor kalori, protein, karbo & lemak' },
]

function Field({ icon: Icon, type = 'text', placeholder, value, onChange, right }) {
  return (
    <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 gap-3 focus-within:border-[var(--primary)] focus-within:bg-white transition-colors shadow-sm">
      <Icon size={17} className="text-gray-400 flex-shrink-0" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent text-gray-900 text-[14px] font-medium placeholder-gray-400 outline-none"
      />
      {right}
    </div>
  )
}

const GoogleIcon = () => (
  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

import { supabase } from '../lib/supabase';
import { apiFetch } from '../lib/api';

export default function Login({ onLogin, onBack }) {
  const [mode, setMode] = useState('login')
  const [step, setStep] = useState(1)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [goal, setGoal]         = useState('WEIGHT_LOSS')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError]       = useState('')

  const resetError = () => setError('')

  const handleLogin = async () => {
    if (!email || !password) { setError('Isi email dan kata sandi!'); return }
    setLoading(true); setError('')
    try {
      const resp = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.message ?? 'Login gagal')
      localStorage.setItem('gizisnapUser', JSON.stringify(data))
      onLogin(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true); setError('');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // You can specify redirectTo if you want them to come back to a specific URL after login
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      // Note: For OAuth, the redirect will happen automatically.
      // We will handle the session callback in App.jsx or Login.jsx mount.
    } catch (e) {
      setGoogleLoading(false);
      setError(e.message ?? 'Gagal menghubungi Supabase Google Auth');
    }
  };

  const handleRegister = async () => {
    if (step === 1) {
      if (!name || !email || !password) { setError('Semua kolom wajib diisi!'); return }
      if (password.length < 6) { setError('Kata sandi minimal 6 karakter'); return }
      setStep(2); setError(''); return
    }
    setLoading(true); setError('')
    try {
      const resp = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, goal }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.message ?? 'Registrasi gagal')
      localStorage.setItem('gizisnapUser', JSON.stringify(data))
      onLogin(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m) => { setMode(m); setStep(1); setError('') }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-screen fixed inset-0 z-50 bg-white">

      {/* ── Desktop Left: Hero/Branding ── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-center relative overflow-hidden bg-gray-50/50">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-300/20 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-200/20 rounded-full blur-[80px]" />

        <div className="relative z-10 px-16 xl:px-24 max-w-2xl">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary)] flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
              <Leaf size={30} className="text-white" />
            </div>
            <h1 className="text-[56px] xl:text-[64px] font-black text-gray-900 leading-[1.05] tracking-tight mb-5">
              Gizi<span className="text-[var(--primary)]">Snap</span>
            </h1>
            <p className="text-gray-500 text-[18px] font-medium leading-relaxed max-w-md">
              Lacak nutrisi harianmu dengan kecerdasan buatan.
              Scan makanan, pantau kalori, capai tujuan kesehatanmu.
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-12 grid gap-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-[14px]">{title}</p>
                  <p className="text-gray-500 text-[12px]">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Goal pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex gap-3 mt-10">
            {GOALS.map(({ emoji, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2">
                <span className="text-sm">{emoji}</span>
                <span className="text-gray-600 text-[11px] font-semibold">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10
                      lg:bg-white lg:border-l lg:border-gray-100 lg:shadow-[0_0_40px_rgba(0,0,0,0.03)]
                      relative overflow-hidden">

        {/* Back Button */}
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-8 left-6 lg:left-8 flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors z-20 text-sm font-semibold"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Kembali</span>
          </button>
        )}

        {/* Mobile decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 lg:hidden" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 lg:hidden" />

        {/* Mobile logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8 lg:hidden"
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary)] flex items-center justify-center mb-3 shadow-xl shadow-emerald-500/30">
            <Leaf size={30} className="text-white" />
          </div>
          <h1 className="text-[28px] font-black text-gray-900 tracking-tight">GiziSnap</h1>
          <p className="text-gray-500 text-[13px] font-medium mt-1">Lacak nutrisimu dengan AI 🇮🇩</p>
        </motion.div>

        {/* Desktop form header */}
        <div className="hidden lg:block text-center mb-8 relative z-10">
          <h2 className="text-[26px] font-black text-gray-900">
            {mode === 'login' ? 'Selamat Datang Kembali' : 'Mulai Perjalananmu'}
          </h2>
          <p className="text-gray-500 text-[14px] mt-2">
            {mode === 'login' ? 'Masuk untuk melanjutkan tracking nutrisimu' : 'Buat akun gratis dan mulai hidup sehat'}
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mode Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            {[['login', 'Masuk'], ['register', 'Daftar']].map(([m, label]) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                  mode === m ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div key="login-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-3">
                <Field icon={Mail} type="email" placeholder="Email kamu" value={email}
                  onChange={e => { setEmail(e.target.value); resetError() }} />
                <Field icon={Lock} type={showPass ? 'text' : 'password'} placeholder="Kata sandi" value={password}
                  onChange={e => { setPassword(e.target.value); resetError() }}
                  right={
                    <button type="button" onClick={() => setShowPass(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  } />
              </motion.div>
            ) : (
              <motion.div key="reg-step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-3">
                <p className="text-gray-500 text-[13px] font-semibold mb-4 text-center">Apa tujuan kesehatanmu?</p>
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => setGoal(g.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                      goal === g.id ? 'border-[var(--primary)] bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                    }`}>
                    <span className="text-2xl">{g.emoji}</span>
                    <div className="flex-1">
                      <p className="text-gray-900 font-bold text-[14px]">{g.label}</p>
                      <p className="text-gray-500 text-[11px]">{g.desc}</p>
                    </div>
                    {goal === g.id && <Sparkles size={14} className="text-[var(--primary)]" />}
                  </button>
                ))}
                <button onClick={() => setStep(1)} className="text-gray-400 text-[12px] w-full text-center mt-2 hover:text-gray-600 transition-colors">
                  ← Kembali
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mt-3">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-[12px] font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={mode === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full mt-5 py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2
              bg-[var(--primary)] text-white shadow-xl shadow-emerald-500/30
              disabled:opacity-60 hover:bg-[var(--primary-dark)] transition-all"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                {mode === 'login' ? 'Masuk' : step === 1 ? 'Lanjut' : 'Buat Akun'}
                <ChevronRight size={18} />
              </>
            )}
          </motion.button>

          {/* Divider & Google Login (Hanya tampil di login atau register step 1) */}
          {(mode === 'login' || step === 1) && (
            <>
              <div className="flex items-center gap-3 mt-5 mb-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Atau</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading}
                className="w-full py-3.5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-3
                  bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all mb-2"
              >
                {googleLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full" />
                ) : (
                  <>
                    <GoogleIcon />
                    Google
                  </>
                )}
              </motion.button>
            </>
          )}

          {/* Footer */}
          <p className="text-center text-gray-500 text-[12px] mt-4">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
            <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-[var(--primary)] font-bold ml-1 hover:text-emerald-600 transition-colors">
              {mode === 'login' ? 'Daftar gratis' : 'Masuk'}
            </button>
          </p>
        </motion.div>

        {/* Desktop footer */}
        <p className="hidden lg:block text-gray-400 text-[11px] mt-10 relative z-10">© 2026 GiziSnap · AI Nutrition Tracker</p>
      </div>
    </div>
  )
}
