import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ChevronRight, ChevronLeft, AlertCircle, Leaf, Scan, Shield, TrendingUp } from 'lucide-react'
import { apiFetch } from '../lib/api';

const GOALS = [
  { id: 'WEIGHT_LOSS',   label: 'Turun Berat Badan', emoji: '🥗', desc: 'Defisit kalori harian' },
  { id: 'DIABETES_CARE', label: 'Diabetes Care',      emoji: '🩺', desc: 'Kontrol karbohidrat' },
  { id: 'BODYBUILDING',  label: 'Pembentukan Otot',   emoji: '💪', desc: 'Tinggi protein' },
]

const FEATURES = [
  { icon: Scan,      title: 'Scan Makanan Instan', desc: 'Teknologi AI mengenali nutrisi dari foto' },
  { icon: Shield,    title: 'Database Lokal',      desc: '60+ makanan khas Indonesia terverifikasi' },
  { icon: TrendingUp,title: 'Lacak Harian',        desc: 'Monitor kalori, protein, karbohidrat & lemak' },
]

function Field({ icon: Icon, type = 'text', placeholder, value, onChange, right }) {
  return (
    <div className="group relative flex items-center bg-slate-50/50 border border-slate-200/60 rounded-2xl px-4 py-3.5 gap-3 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300 shadow-sm hover:border-slate-300">
      <Icon size={18} className="text-slate-400 flex-shrink-0 transition-colors group-focus-within:text-emerald-500" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent text-slate-800 text-[15px] font-medium placeholder-slate-400 outline-none w-full"
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
  const googleBtnRef = useRef(null)

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

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

  // ── Google Identity Services (GSI) handler ──────────────────────────────────
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError('');

    const doSignIn = () => {
      if (!window.google?.accounts?.id) {
        setError('Google SDK belum siap, coba lagi.');
        setGoogleLoading(false);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          const idToken = response.credential;
          if (!idToken) {
            setError('Tidak mendapat token dari Google.');
            setGoogleLoading(false);
            return;
          }
          try {
            const res = await apiFetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message ?? 'Login Google gagal');
            localStorage.setItem('gizisnapUser', JSON.stringify(data));
            onLogin(data);
          } catch (e) {
            setError(e.message ?? 'Gagal login dengan Google');
          } finally {
            setGoogleLoading(false);
          }
        },
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt();
    };

    // Load GSI script jika belum ada
    if (window.google?.accounts?.id) {
      doSignIn();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = doSignIn;
      script.onerror = () => {
        setError('Gagal memuat Google Sign-In SDK.');
        setGoogleLoading(false);
      };
      document.head.appendChild(script);
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
    <div className="flex flex-col lg:flex-row min-h-screen w-screen fixed inset-0 z-50 bg-slate-50 font-sans">

      {/* ── Desktop Left: Hero/Branding ── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-center relative overflow-hidden bg-slate-50">
        {/* Abstract Background Blurs */}
        <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-emerald-400/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-teal-300/20 rounded-full blur-[100px] mix-blend-multiply pointer-events-none" />
        <div className="absolute top-[30%] left-[20%] w-[25rem] h-[25rem] bg-green-200/20 rounded-full blur-[100px] mix-blend-multiply pointer-events-none" />

        {/* Floating elements to add depth */}
        <motion.div 
          animate={{ y: [0, -15, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[15%] w-16 h-16 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rotate-12" 
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[25%] left-[10%] w-20 h-20 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] -rotate-12" 
        />

        <div className="relative z-10 px-16 xl:px-24 max-w-2xl">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30 relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-[2px]" />
              <Leaf size={32} className="text-white relative z-10" />
            </div>
            <h1 className="text-[56px] xl:text-[64px] font-black text-slate-800 leading-[1.1] tracking-tight mb-5">
              Nutrisi Pintar,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                Hidup Sehat.
              </span>
            </h1>
            <p className="text-slate-500 text-[18px] font-medium leading-relaxed max-w-md">
              Lacak nutrisi harianmu dengan kecerdasan buatan. Scan makanan, pantau kalori, capai tujuan kesehatanmu lebih cepat.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="mt-12 grid gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div 
                key={title} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="group flex items-center gap-5 bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:bg-white/80 rounded-2xl px-5 py-4 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={20} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-slate-800 font-bold text-[15px]">{title}</p>
                  <p className="text-slate-500 text-[13px] mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Goal pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex gap-3 mt-10 flex-wrap">
            {GOALS.map(({ emoji, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white shadow-sm rounded-full px-4 py-2 hover:bg-white transition-colors cursor-default">
                <span className="text-sm">{emoji}</span>
                <span className="text-slate-600 text-[12px] font-bold">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10
                      bg-white lg:rounded-l-[2.5rem] lg:-ml-10 lg:shadow-[-20px_0_50px_rgba(0,0,0,0.05)]
                      relative z-20 overflow-x-hidden overflow-y-auto">

        {/* Back Button */}
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-8 left-6 lg:left-10 flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors z-30 text-[13px] font-bold tracking-wide"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">KEMBALI</span>
          </button>
        )}

        {/* Mobile decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 lg:hidden" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 lg:hidden" />

        {/* Mobile logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10 lg:hidden relative z-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-[32px] font-black text-slate-800 tracking-tight leading-none">GiziSnap</h1>
          <p className="text-slate-500 text-[14px] font-medium mt-2">Lacak nutrisimu dengan AI 🇮🇩</p>
        </motion.div>

        {/* Desktop form header */}
        <div className="hidden lg:block text-center mb-10 relative z-10">
          <h2 className="text-[28px] font-black text-slate-800 tracking-tight">
            {mode === 'login' ? 'Selamat Datang Kembali' : 'Mulai Perjalananmu'}
          </h2>
          <p className="text-slate-500 text-[15px] font-medium mt-2">
            {mode === 'login' ? 'Masuk untuk melanjutkan tracking nutrisimu' : 'Buat akun gratis dan mulai hidup sehat'}
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-[380px] relative z-10"
        >
          {/* Mode Tabs */}
          <div className="relative flex bg-slate-100/80 p-1.5 rounded-2xl mb-8 border border-slate-200/50">
            {/* Animated pill background */}
            <motion.div 
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-100"
              animate={{ left: mode === 'login' ? '6px' : 'calc(50% + 0px)' }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
            {[['login', 'Masuk'], ['register', 'Daftar']].map(([m, label]) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`relative flex-1 py-2.5 rounded-xl text-[14px] font-bold transition-colors z-10 ${
                  mode === m ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div key="login-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-4">
                <Field icon={Mail} type="email" placeholder="Alamat email" value={email}
                  onChange={e => { setEmail(e.target.value); resetError() }} />
                <Field icon={Lock} type={showPass ? 'text' : 'password'} placeholder="Kata sandi" value={password}
                  onChange={e => { setPassword(e.target.value); resetError() }}
                  right={
                    <button type="button" onClick={() => setShowPass(v => !v)} className="text-slate-400 hover:text-emerald-500 transition-colors p-1">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  } />
              </motion.div>
            ) : (
              step === 1 ? (
                <motion.div key="reg-step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="space-y-4">
                  <Field icon={User} type="text" placeholder="Nama lengkap" value={name}
                    onChange={e => { setName(e.target.value); resetError() }} />
                  <Field icon={Mail} type="email" placeholder="Alamat email" value={email}
                    onChange={e => { setEmail(e.target.value); resetError() }} />
                  <Field icon={Lock} type={showPass ? 'text' : 'password'} placeholder="Kata sandi minimal 6 karakter" value={password}
                    onChange={e => { setPassword(e.target.value); resetError() }}
                    right={
                      <button type="button" onClick={() => setShowPass(v => !v)} className="text-slate-400 hover:text-emerald-500 transition-colors p-1">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    } />
                </motion.div>
              ) : (
                <motion.div key="reg-step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-3">
                  <p className="text-slate-500 text-[14px] font-semibold mb-5 text-center">Apa tujuan utama kesehatanmu?</p>
                  {GOALS.map(g => (
                    <button key={g.id} onClick={() => setGoal(g.id)}
                      className={`group w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                        goal === g.id 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-[0_8px_20px_rgba(16,185,129,0.1)]' 
                          : 'border-slate-200/60 bg-white hover:border-emerald-200 hover:bg-emerald-50/20 hover:shadow-sm'
                      }`}>
                      <span className="text-[28px] drop-shadow-sm group-hover:scale-110 transition-transform">{g.emoji}</span>
                      <div className="flex-1">
                        <p className={`font-bold text-[15px] transition-colors ${goal === g.id ? 'text-emerald-700' : 'text-slate-800'}`}>{g.label}</p>
                        <p className="text-slate-500 text-[12px] font-medium mt-0.5">{g.desc}</p>
                      </div>
                      {goal === g.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Sparkles size={14} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                  <button onClick={() => setStep(1)} className="text-slate-400 text-[13px] font-bold w-full text-center mt-4 hover:text-slate-700 transition-colors py-2">
                    ← KEMBALI
                  </button>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 16 }} exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden">
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-[13px] font-semibold leading-snug">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={mode === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            className="group w-full mt-8 py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2
              bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_8px_25px_rgba(16,185,129,0.3)]
              disabled:opacity-70 hover:shadow-[0_12px_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <>
                <span className="relative z-10">{mode === 'login' ? 'Masuk Sekarang' : step === 1 ? 'Lanjutkan' : 'Selesai & Buat Akun'}</span>
                <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>

          {/* Divider & Google Login */}
          {(mode === 'login' || step === 1) && (
            <>
              <div className="flex items-center gap-4 mt-8 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Atau masuk dengan</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading}
                className="w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-3
                  bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md hover:border-slate-300 transition-all duration-300"
              >
                {googleLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-slate-200 border-t-emerald-500 rounded-full" />
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Lanjutkan dengan Google</span>
                  </>
                )}
              </motion.button>
            </>
          )}

          {/* Footer */}
          <p className="text-center text-slate-500 text-[14px] mt-8 font-medium">
            {mode === 'login' ? 'Pengguna baru?' : 'Sudah punya akun?'}
            <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-emerald-600 font-bold ml-1.5 hover:text-emerald-700 transition-colors underline decoration-emerald-200 underline-offset-4 hover:decoration-emerald-500">
              {mode === 'login' ? 'Daftar sekarang' : 'Masuk di sini'}
            </button>
          </p>
        </motion.div>

        {/* Desktop footer */}
        <p className="hidden lg:block text-slate-400 text-[12px] font-medium absolute bottom-8 z-10">
          © 2026 GiziSnap · AI Nutrition Tracker
        </p>
      </div>
    </div>
  )
}
