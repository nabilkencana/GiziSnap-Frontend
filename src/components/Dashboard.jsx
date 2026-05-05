import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame, Droplets, Beef, Wheat, Settings2,
  AlertTriangle, Trophy, Star, UtensilsCrossed,
  LogOut, Trash2, Plus, Minus, BarChart3, GlassWater,
  CheckCircle2, TrendingUp, Zap, Clock, RefreshCw,
  Sun, Moon, CloudSun
} from 'lucide-react'

// ─── Helpers ────────────────────────────────────────────────────────────────
function getTargetProtein(persona, tc) {
  if (persona === 'diabetes') return 60;
  if (persona === 'bodybuilder') return 185;
  return Math.round(tc * 0.3 / 4);
}
function getTargetCarbs(persona, tc) {
  if (persona === 'diabetes') return 130;
  if (persona === 'bodybuilder') return 280;
  return Math.round(tc * 0.45 / 4);
}
function getTargetFat(persona, tc) {
  if (persona === 'diabetes') return 65;
  if (persona === 'bodybuilder') return 70;
  return Math.round(tc * 0.25 / 9);
}

function getPersonaColor(persona, cal, tc) {
  const pct = cal / tc;
  if (persona === 'weightloss') return pct > 1 ? '#ef4444' : '#8b5cf6';
  if (persona === 'diabetes') return '#f43f5e';
  return '#3b82f6';
}

function getCalorieLabel(persona, cal, tc) {
  const sisa = Math.max(tc - cal, 0)
  const pct = cal / tc;
  if (persona === 'weightloss') return pct > 1 ? 'Melebihi' : `Sisa ${sisa}`;
  return `${Math.round(pct * 100)}%`;
}

// ─── SVG Circular Progress ────────────────────────────────────────────────────
function CircularProgress({ value, max, size = 130, stroke = 11, color = '#10b981', label }) {
  const r    = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct  = Math.min(value / max, 1) || 0
  const dash = circ * pct
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.3, ease: 'easeOut', delay: 0.2 }}
          style={{ filter: `drop-shadow(0 4px 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[26px] font-black text-gray-800 leading-none">{Math.round(value)}</span>
        <span className="text-[10px] text-gray-400 font-bold mt-1">/ {max} kcal</span>
        {label && <span className="text-[11px] font-black mt-1 bg-gray-50 px-2 py-0.5 rounded-md" style={{ color }}>{label}</span>}
      </div>
    </div>
  )
}

// ─── Macro Widget ─────────────────────────────────────────────────────────────
function MacroWidget({ label, value, max, unit, icon: Icon, colorClass, bgClass, progressColor }) {
  const pct = Math.min((value / max) * 100, 100) || 0
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-5 flex flex-col gap-4 relative overflow-hidden transition-all">
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 ${bgClass} rounded-2xl flex items-center justify-center shadow-sm`}>
          <Icon size={20} className={colorClass} />
        </div>
        <div className="text-right">
          <span className="text-[20px] font-black text-gray-800">{Math.round(value)}</span>
          <span className="text-[11px] text-gray-400 font-bold uppercase ml-0.5">{unit}</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 mb-2">
          <span>{label}</span>
          <span>{Math.round(max)}{unit}</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full rounded-full" style={{ background: progressColor }} />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Segmented Control ────────────────────────────────────────────────────────
function SegmentedControl({ tabs, active, onChange }) {
  return (
    <div className="flex p-1.5 bg-gray-100/80 backdrop-blur-md rounded-2xl border border-white">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} className="relative flex-1 py-2.5 text-[13px] font-bold transition-colors z-10">
          {active === tab.id && (
             <motion.div layoutId="activeTab" className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
          )}
          <span className={`relative z-10 flex items-center justify-center gap-2 ${active === tab.id ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
             <tab.icon size={16}/> {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}

// ─── Weekly bar chart ─────────────────────────────────────────────────────────
function WeeklyChart({ data, targetCalories }) {
  if (!data?.length) return null
  const maxVal = Math.max(...data.map(d => d.totalCalories), targetCalories, 1)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[14px] font-bold text-gray-700">Tren 7 Hari</p>
        <span className="text-[11px] text-gray-400 font-medium bg-white px-2 py-1 rounded-md shadow-sm border border-gray-50">Target: {targetCalories} kcal</span>
      </div>
      <div className="flex items-end justify-between gap-2 h-28">
        {data.map((d, i) => {
          const h   = (d.totalCalories / maxVal) * 110
          const pct = d.totalCalories / targetCalories
          const col = pct > 1.1 ? '#ef4444' : pct > 0.9 ? '#10b981' : '#93c5fd'
          return (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1 group">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: h }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                className="w-full rounded-t-xl relative transition-all hover:opacity-80 cursor-pointer"
                style={{ background: d.isToday ? col : '#e2e8f0', minHeight: d.totalCalories > 0 ? 6 : 0 }}
              >
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                  {d.totalCalories} kcal
                </div>
              </motion.div>
              <span className={`text-[10px] font-semibold ${d.isToday ? 'text-gray-800' : 'text-gray-400'}`}>{d.label}</span>
            </div>
          )
        })}
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { label: 'Rata-rata', val: `${Math.round(data.reduce((s, d) => s + d.totalCalories, 0) / (data.filter(d => d.totalCalories > 0).length || 1))} kcal`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Tertinggi', val: `${Math.max(...data.map(d => d.totalCalories))} kcal`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Hari Aktif', val: `${data.filter(d => d.totalCalories > 0).length}/7`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s, idx) => (
          <div key={idx} className={`${s.bg} rounded-2xl p-3 text-center border border-white`}>
            <s.icon size={16} className={`${s.color} mx-auto mb-1.5`}/>
            <p className={`text-[13px] font-black ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Water Tracker (localStorage) ────────────────────────────────────────────
const WATER_KEY = () => `water_${new Date().toISOString().split('T')[0]}`

function WaterTracker() {
  const [glasses, setGlasses] = useState(() => parseInt(localStorage.getItem(WATER_KEY()) ?? '0'))
  const MAX = 8
  const pct = (glasses / MAX) * 100

  const add = (n) => {
    const next = Math.max(0, Math.min(MAX, glasses + n))
    setGlasses(next)
    localStorage.setItem(WATER_KEY(), String(next))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[14px] font-bold text-gray-700">Target Hidrasi Harian</p>
        <span className="text-[14px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{glasses}<span className="font-bold text-blue-400">/{MAX} gelas</span></span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: MAX }).map((_, i) => (
          <motion.button key={i}
            onClick={() => add(i < glasses ? (i + 1) - glasses : 1)}
            whileTap={{ scale: 0.85 }}
            className={`w-9 h-11 rounded-xl border-2 transition-all duration-300 flex items-center justify-center shadow-sm
              ${i < glasses
                ? 'border-blue-400 bg-blue-100'
                : 'border-white bg-gray-50 hover:bg-gray-100'}`}
          >
            <GlassWater size={16} className={i < glasses ? 'text-blue-500' : 'text-gray-300'} />
          </motion.button>
        ))}
      </div>

      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner mt-4">
        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ filter: 'drop-shadow(0 2px 4px rgba(59,130,246,0.3))' }} />
      </div>

      <div className="flex justify-between items-center bg-gray-50/50 rounded-2xl p-2 border border-gray-100">
        <button onClick={() => add(-1)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm text-gray-400 hover:text-red-500">
          <Minus size={16} />
        </button>
        <p className="text-[12px] font-semibold text-gray-500 text-center">
          {glasses === 0 ? 'Ayo mulai minum air! 💧'
           : glasses < 4  ? 'Masih kurang dari setengah! 💧'
           : glasses < 8  ? 'Terus pertahankan hidrasimu. 🌊'
           : 'Terhidrasi sempurna hari ini! 🏆'}
        </p>
        <button onClick={() => add(1)} className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm text-blue-600">
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

// ─── Log item ─────────────────────────────────────────────────────────────────
function LogItem({ log, onDelete, idx }) {
  const [deleting, setDeleting] = useState(false)
  const cal = Math.round((log.food?.calories ?? 0) * (log.portion ?? 1))
  const time = new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await fetch(`/api/daily-logs/${log.id}`, { method: 'DELETE' })
      onDelete(log.id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.2 }}
      className="bg-white/80 hover:bg-white rounded-2xl px-4 py-3 shadow-sm hover:shadow-md border border-white flex items-center gap-4 transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 shadow-inner border border-orange-100/50">
        <div className="text-center">
          <p className="text-[14px] font-black text-orange-500 leading-none">{cal}</p>
          <p className="text-[8px] text-orange-400 font-bold uppercase mt-0.5">kcal</p>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-gray-800 truncate">{log.food?.name ?? '–'}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] font-medium text-gray-500">
            P {Math.round((log.food?.protein ?? 0) * log.portion)}g · 
            K {Math.round((log.food?.carbs   ?? 0) * log.portion)}g · 
            L {Math.round((log.food?.fat     ?? 0) * log.portion)}g
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-[11px] font-medium text-gray-400 flex items-center justify-end gap-1 mb-0.5">
            <Clock size={10} /> {time}
          </p>
          <p className="text-[11px] font-bold text-gray-500">{log.portion}× porsi</p>
        </div>
        <motion.button whileTap={{ scale: 0.85 }} onClick={handleDelete} disabled={deleting}
          className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-500 hover:text-white text-red-500 transition-colors shadow-sm">
          {deleting
            ? <RefreshCw size={14} className="animate-spin" />
            : <Trash2 size={14} />}
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── Tips Panels ─────────────────────────────────────────────────────────────
function WeightLossTips({ macros, targetCalories }) {
  const cal  = Math.round(macros.totalCalories)
  const sisa = Math.max(targetCalories - cal, 0)
  const pct  = Math.round((cal / targetCalories) * 100)
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center shadow-sm">
          <Star size={18} className="text-violet-600" />
        </div>
        <div>
          <h3 className="text-[15px] font-black text-gray-800">Insight Defisit</h3>
          <p className="text-[11px] font-semibold text-gray-400">Target Anda: {targetCalories} kcal</p>
        </div>
      </div>
      <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-4 shadow-sm">
        <p className="text-[13px] font-semibold text-gray-700 leading-relaxed">
          {cal === 0 ? 'Belum ada asupan kalori hari ini. Mulai foto makananmu dengan tab Scan AI! 📸'
           : sisa > 300 ? `Tersisa ${sisa} kcal hari ini. Bagus, kamu masih di jalur defisit yang sehat! 🥗`
           : pct > 100  ? 'Perhatian, asupan kalori kamu sudah melebihi target hari ini! Kurangi ngemil. 🚫'
           : 'Hampir memenuhi target kalori harian! Coba konsumsi lebih banyak protein agar kenyang lebih lama. 💪'}
        </p>
      </div>
    </div>
  )
}

function DiabetesTips({ macros }) {
  const karbo = Math.round(macros.totalCarbs)
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center shadow-sm">
          <AlertTriangle size={18} className="text-rose-600" />
        </div>
        <div>
          <h3 className="text-[15px] font-black text-gray-800">Monitor Karbo</h3>
          <p className="text-[11px] font-semibold text-gray-400">Kunci kestabilan gula darah</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
         <div className="flex justify-between items-center text-[12px]">
            <span className="font-bold text-gray-600">Karbohidrat Harian</span>
            <span className={`font-black ${karbo > 130 ? 'text-red-500' : 'text-emerald-500'}`}>{karbo}g / 130g</span>
         </div>
         <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((karbo/130)*100, 100)}%` }} className="h-full rounded-full" style={{ background: karbo > 110 ? '#ef4444' : '#10b981' }} />
         </div>
      </div>

      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 shadow-sm">
        <p className="text-[13px] font-semibold text-gray-700 leading-relaxed">
           Selalu pilih karbohidrat kompleks dengan Indeks Glikemik (GI) &lt; 55 seperti beras merah atau gandum utuh untuk mencegah lonjakan gula. 🩺
        </p>
      </div>
    </div>
  )
}

function BodybuilderTips({ macros }) {
  const pro = Math.round(macros.totalProtein)
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
          <Trophy size={18} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-[15px] font-black text-gray-800">Fokus Otot</h3>
          <p className="text-[11px] font-semibold text-gray-400">Penuhi target proteinmu</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
         <div className="flex justify-between items-center text-[12px]">
            <span className="font-bold text-gray-600">Protein Harian</span>
            <span className={`font-black ${pro >= 185 ? 'text-emerald-500' : 'text-blue-500'}`}>{pro}g / 185g</span>
         </div>
         <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((pro/185)*100, 100)}%` }} className="h-full rounded-full" style={{ background: pro >= 185 ? '#10b981' : '#3b82f6' }} />
         </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 shadow-sm">
        <p className="text-[13px] font-semibold text-gray-700 leading-relaxed">
           {pro < 92 ? 'Asupan protein masih sangat kurang hari ini. Jangan lupa minum protein shake atau makan daging tanpa lemak! 🥩'
            : pro >= 185 ? 'Luar biasa! Target protein telah tercapai hari ini. Pembangunan otot maksimal! 🏆'
            : 'Terus kejar target proteinmu hari ini agar proses recovery dan pembesaran otot optimal. 💪'}
        </p>
      </div>
    </div>
  )
}

// ─── Konstanta ────────────────────────────────────────────────────────────────
const PERSONA_CONFIG = {
  weightloss:  { label: 'Turun Berat', color: 'text-violet-600', bg: 'bg-violet-100', emoji: '🥗' },
  diabetes:    { label: 'Diabetes Care', color: 'text-rose-600', bg: 'bg-rose-100', emoji: '🩺' },
  bodybuilder: { label: 'Bina Otot', color: 'text-blue-600', bg: 'bg-blue-100', emoji: '💪' },
}
const EMPTY_MACROS = { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }

// ─── Main Dashboard (Bento Box + Glassmorphism) ────────────────────────────────
export default function Dashboard({ persona, onPersonaChange, userId, user, onLogout, onMacrosUpdate }) {
  const [macros, setMacros]               = useState(EMPTY_MACROS)
  const [logs,   setLogs]                 = useState([])
  const [weekly, setWeekly]               = useState([])
  const [loading, setLoading]             = useState(true)
  const [showPersonaMenu, setPersonaMenu] = useState(false)
  const [activeTab, setActiveTab]         = useState('tips') // 'tips' | 'chart' | 'water'

  const cfg            = PERSONA_CONFIG[persona] ?? PERSONA_CONFIG.weightloss
  const targetCalories = user?.targetCalories ?? 1800

  const fetchData = useCallback(() => {
    if (!userId) return
    setLoading(true)
    Promise.all([
      fetch(`/api/daily-logs/today/${userId}`).then(r => r.json()),
      fetch(`/api/daily-logs/weekly/${userId}`).then(r => r.json()),
    ]).then(([today, week]) => {
      if (today.macros) { setMacros(today.macros); onMacrosUpdate?.(today.macros) }
      if (today.logs)   setLogs(today.logs)
      if (Array.isArray(week)) {
         setWeekly(week)
      }
    }).catch(console.error).finally(() => setLoading(false))
  }, [userId])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDeleteLog = (id) => {
    setLogs(prev => prev.filter(l => l.id !== id))
    setTimeout(() => {
      fetch(`/api/daily-logs/today/${userId}`)
        .then(r => r.json())
        .then(d => { if (d.macros) { setMacros(d.macros); onMacrosUpdate?.(d.macros) } })
    }, 300)
  }

  const hour      = new Date().getHours()
  let greeting    = 'Selamat malam'
  let TimeIcon    = Moon
  let timeColor   = 'text-indigo-500'
  
  if (hour < 11) { greeting = 'Selamat pagi'; TimeIcon = Sun; timeColor = 'text-amber-500' }
  else if (hour < 15) { greeting = 'Selamat siang'; TimeIcon = Sun; timeColor = 'text-orange-500' }
  else if (hour < 18) { greeting = 'Selamat sore'; TimeIcon = CloudSun; timeColor = 'text-rose-500' }

  const firstName = user?.name?.split(' ')[0] ?? 'Pengguna'

  return (
    <div className="flex flex-col pb-28 lg:pb-12 min-h-screen relative overflow-hidden bg-[#fafafa]">
      
      {/* Background ambient blobs for Glassmorphism */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary-light)] opacity-20 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-300 opacity-15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-violet-300 opacity-15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 px-4 pt-10 lg:pt-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
        
        {/* ── HEADER / HERO BENTO ── */}
        <div className="relative z-50 bg-white/60 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full text-center sm:text-left">
             <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
               <TimeIcon size={20} className={timeColor} />
               <p className="text-gray-500 text-[15px] font-bold tracking-wide">{greeting}</p>
             </div>
             <h1 className="text-gray-900 text-3xl sm:text-4xl font-black mb-6 tracking-tight">{firstName}</h1>
             
             <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
               {/* Persona Badge */}
               <div className="relative">
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setPersonaMenu(!showPersonaMenu)} 
                    className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 shadow-sm border border-white ${cfg.bg} ${cfg.color}`}>
                   <span className="text-lg leading-none">{cfg.emoji}</span>
                   <span className="text-[14px] font-bold">{cfg.label}</span>
                 </motion.button>
                 
                 {/* Persona Menu Dropdown */}
                 <AnimatePresence>
                   {showPersonaMenu && (
                     <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute top-full left-0 mt-3 w-56 bg-white/90 backdrop-blur-2xl border border-white shadow-[0_20px_40px_rgb(0,0,0,0.1)] rounded-2xl p-2 z-50">
                        {Object.entries(PERSONA_CONFIG).map(([key, c]) => (
                          <button key={key} onClick={() => { onPersonaChange(key); setPersonaMenu(false) }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors
                              ${persona === key ? 'bg-gray-100/80' : 'hover:bg-gray-50/80'}`}>
                            <span className="text-base leading-none">{c.emoji}</span>
                            <span className="text-[13px] font-bold text-gray-800">{c.label}</span>
                            {persona === key && <CheckCircle2 size={16} className="text-emerald-500 ml-auto"/>}
                          </button>
                        ))}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>

               <div className="hidden sm:block w-px h-8 bg-gray-200/50 rounded-full mx-1"></div>

               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={fetchData}
                  className="w-11 h-11 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm border border-white hover:bg-white transition-colors text-gray-600">
                  <RefreshCw size={18} className={`${loading ? 'animate-spin text-emerald-500' : ''}`}/>
               </motion.button>
               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={onLogout}
                  className="lg:hidden w-11 h-11 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm border border-white hover:bg-red-50 hover:text-red-500 transition-colors text-gray-600">
                  <LogOut size={18} />
               </motion.button>
             </div>
          </div>

          {/* Circular Progress Area */}
          <div className="flex-shrink-0 bg-white/80 rounded-[2rem] p-5 border border-white shadow-sm relative">
             <CircularProgress 
               value={macros.totalCalories} 
               max={targetCalories} 
               size={150} 
               stroke={14} 
               color={getPersonaColor(persona, macros.totalCalories, targetCalories)} 
               label={getCalorieLabel(persona, macros.totalCalories, targetCalories)} 
             />
          </div>
        </div>

        {/* ── MACRO WIDGETS ── */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          <MacroWidget label="Protein" value={macros.totalProtein} max={getTargetProtein(persona, targetCalories)} unit="g" icon={Beef} colorClass="text-emerald-500" bgClass="bg-emerald-100" progressColor="linear-gradient(to right, #34d399, #10b981)" />
          <MacroWidget label="Karbo" value={macros.totalCarbs} max={getTargetCarbs(persona, targetCalories)} unit="g" icon={Wheat} colorClass="text-blue-500" bgClass="bg-blue-100" progressColor="linear-gradient(to right, #60a5fa, #3b82f6)" />
          <MacroWidget label="Lemak" value={macros.totalFat} max={getTargetFat(persona, targetCalories)} unit="g" icon={Droplets} colorClass="text-amber-500" bgClass="bg-amber-100" progressColor="linear-gradient(to right, #fbbf24, #f59e0b)" />
        </div>

        {/* ── BOTTOM GRID ── */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Left Column: Food Logs (Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
             <div className="bg-white/60 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 flex-1 min-h-[400px] flex flex-col">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center shadow-sm">
                     <UtensilsCrossed size={18} className="text-orange-500" />
                   </div>
                   <h2 className="text-[18px] font-black text-gray-800">Log Makanan</h2>
                 </div>
                 <span className="text-[12px] font-bold bg-white px-3 py-1.5 rounded-xl shadow-sm text-gray-500 border border-white">{logs.length} Item</span>
               </div>

               {logs.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-10">
                     <div className="w-24 h-24 bg-gray-50/80 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-2">
                       <UtensilsCrossed size={36} className="text-gray-300" />
                     </div>
                     <div>
                       <p className="text-[16px] font-black text-gray-600">Belum ada catatan hari ini</p>
                       <p className="text-[13px] font-medium text-gray-400 mt-1 max-w-[220px] mx-auto">Gunakan fitur Scan AI di menu navigasi untuk memotret makananmu.</p>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                     <AnimatePresence>
                       {logs.map((log, i) => <LogItem key={log.id} log={log} idx={i} onDelete={handleDeleteLog} />)}
                     </AnimatePresence>
                  </div>
               )}
             </div>
          </div>

          {/* Right Column: Tabs (Tips, Tren, Air) (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
             <SegmentedControl 
                active={activeTab} 
                onChange={setActiveTab} 
                tabs={[
                  { id: 'tips', label: 'Info & Tips', icon: Star },
                  { id: 'chart', label: 'Tren', icon: BarChart3 },
                  { id: 'water', label: 'Air', icon: GlassWater }
                ]} 
             />
             
             <div className="bg-white/60 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 flex-1 min-h-[350px]">
                <AnimatePresence mode="wait">
                   {activeTab === 'tips' && (
                      <motion.div key="tips" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{ duration: 0.2 }}>
                         {persona === 'weightloss' && <WeightLossTips macros={macros} targetCalories={targetCalories} />}
                         {persona === 'diabetes' && <DiabetesTips macros={macros} />}
                         {persona === 'bodybuilder' && <BodybuilderTips macros={macros} />}
                      </motion.div>
                   )}
                   {activeTab === 'chart' && (
                      <motion.div key="chart" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{ duration: 0.2 }}>
                         <WeeklyChart data={weekly} targetCalories={targetCalories} />
                      </motion.div>
                   )}
                   {activeTab === 'water' && (
                      <motion.div key="water" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{ duration: 0.2 }}>
                         <WaterTracker />
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
