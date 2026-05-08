import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Camera, BookOpen, Leaf, LogOut,
  Flame, Beef, Wheat, Droplets, TrendingDown, Trophy, Heart
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Beranda',  icon: Home    },
  { id: 'scanner',   label: 'Scan AI',  icon: Camera  },
  { id: 'wiki',      label: 'WikiGizi', icon: BookOpen },
]

const PERSONA_MAP = {
  weightloss:  { label: 'Turun Berat Badan', emoji: '🥗', Icon: TrendingDown, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100' },
  diabetes:    { label: 'Diabetes Care',      emoji: '🩺', Icon: Heart,        color: 'text-rose-500',   bg: 'bg-rose-50', border: 'border-rose-100' },
  bodybuilder: { label: 'Pembentukan Otot',   emoji: '💪', Icon: Trophy,       color: 'text-blue-500',   bg: 'bg-blue-50', border: 'border-blue-100' },
}

export default function Sidebar({ activeTab, onTabChange, user, macros, persona, onLogout }) {
  const cfg = PERSONA_MAP[persona] ?? PERSONA_MAP.weightloss
  const { Icon: PersonaIcon } = cfg
  const firstName = user?.name?.split(' ')[0] ?? 'Pengguna'
  const cal  = Math.round(macros?.totalCalories ?? 0)
  const prot = Math.round(macros?.totalProtein  ?? 0)
  const karb = Math.round(macros?.totalCarbs    ?? 0)
  const fat  = Math.round(macros?.totalFat      ?? 0)

  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-[100dvh] bg-white/60 backdrop-blur-3xl border-r border-white/60 shadow-[4px_0_40px_rgba(0,0,0,0.03)] flex-shrink-0 relative z-20 overflow-hidden">
      
      {/* Decorative gradient blobs behind sidebar content */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] left-[-10%] w-64 h-64 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none -z-10"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] right-[-20%] w-56 h-56 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none -z-10"
      />

      {/* Logo */}
      <div className="px-6 pt-10 pb-8 flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-[var(--primary)] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.3)] border border-emerald-300/30">
          <Leaf size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-slate-900 font-extrabold text-[21px] tracking-tight leading-none">GiziSnap</h1>
          <p className="text-[var(--primary-dark)] text-[11px] font-black tracking-widest uppercase mt-0.5 opacity-80">AI Nutrition</p>
        </div>
      </div>

      {/* User card */}
      <div className="px-5 mb-8 relative z-10">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/80 backdrop-blur-md border border-white/80 rounded-[1.25rem] p-3.5 flex items-center gap-3.5 shadow-sm hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all cursor-pointer group"
        >
          <div className={`w-11 h-11 ${cfg.bg} border ${cfg.border} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
            <PersonaIcon size={18} className={cfg.color} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-slate-900 font-bold text-[14px] truncate">{firstName}</p>
            <p className="text-slate-500 text-[11px] truncate mb-0.5">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px]">{cfg.emoji}</span>
              <span className={`text-[9px] font-black ${cfg.color} uppercase tracking-widest truncate`}>{cfg.label}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigasi */}
      <nav className="px-4 flex-1 space-y-2 overflow-y-auto relative z-10 scrollbar-hide">
        <p className="text-slate-400/80 text-[10px] font-black uppercase tracking-widest px-3 mb-4">Menu Utama</p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 relative group outline-none
                ${isActive
                  ? 'text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)]'
                  : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {/* Subtle hover background for inactive items */}
              {!isActive && (
                <div className="absolute inset-0 bg-white/60 border border-white/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
              
              <Icon size={19} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
              <span className={`text-[14px] relative z-10 tracking-wide ${isActive ? 'font-bold' : 'font-semibold'}`}>{label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="sidebar-indicator"
                  className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full z-10 shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Ringkasan hari ini */}
      <div className="px-5 py-6 relative z-10">
        <div className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] p-4.5 border border-white/60 shadow-sm relative overflow-hidden group">
          {/* Subtle animated texture in the summary box */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 -top-4 w-28 h-28 bg-emerald-100/50 rounded-full blur-2xl"
          />
          
          <p className="text-slate-400/90 text-[10px] font-black uppercase tracking-widest mb-3.5 relative z-10">Intake Hari Ini</p>
          <div className="grid grid-cols-2 gap-2.5 relative z-10">
            {[
              { icon: Flame,    label: 'Kalori', value: cal,  unit: 'kcal', color: 'text-orange-500',  bg: 'bg-orange-50/50', border: 'border-orange-100/40' },
              { icon: Beef,     label: 'Protein',value: prot, unit: 'g',    color: 'text-emerald-500', bg: 'bg-emerald-50/50', border: 'border-emerald-100/40' },
              { icon: Wheat,    label: 'Karbo',  value: karb, unit: 'g',    color: 'text-blue-500',    bg: 'bg-blue-50/50', border: 'border-blue-100/40' },
              { icon: Droplets, label: 'Lemak',  value: fat,  unit: 'g',    color: 'text-amber-500',   bg: 'bg-amber-50/50', border: 'border-amber-100/40' },
            ].map(({ icon: Icon, label, value, unit, color, bg, border }) => (
              <motion.div 
                whileHover={{ scale: 1.03 }}
                key={label} 
                className={`rounded-xl p-3 flex flex-col gap-1 border ${border} shadow-sm ${bg} backdrop-blur-sm hover:shadow-md transition-shadow cursor-default`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={13} className={`${color} opacity-90`} />
                  <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">{label}</span>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-slate-800 font-black text-[17px] leading-none">{value}</span>
                  <span className="text-slate-400 text-[9px] font-bold">{unit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 pb-6 pt-2 relative z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl text-slate-500 font-bold text-[13px] hover:text-rose-600 bg-white/40 hover:bg-rose-50/80 shadow-sm border border-white/50 hover:border-rose-200/60 transition-all duration-300 group backdrop-blur-sm"
        >
          <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Keluar Akun</span>
        </motion.button>
      </div>
    </aside>
  )
}
