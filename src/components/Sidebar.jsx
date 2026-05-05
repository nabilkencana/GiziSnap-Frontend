import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Camera, BookOpen, Leaf, LogOut, ChevronRight,
  Flame, Beef, Wheat, Droplets, TrendingDown, Trophy, Heart
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Beranda',  icon: Home    },
  { id: 'scanner',   label: 'Scan AI',  icon: Camera  },
  { id: 'wiki',      label: 'WikiGizi', icon: BookOpen },
]

const PERSONA_MAP = {
  weightloss:  { label: 'Turun Berat Badan', emoji: '🥗', Icon: TrendingDown, color: 'text-violet-400', bg: 'bg-violet-500/20' },
  diabetes:    { label: 'Diabetes Care',      emoji: '🩺', Icon: Heart,        color: 'text-rose-400',   bg: 'bg-rose-500/20'   },
  bodybuilder: { label: 'Pembentukan Otot',   emoji: '💪', Icon: Trophy,       color: 'text-blue-400',   bg: 'bg-blue-500/20'   },
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
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen bg-white border-r border-[var(--border)] flex-shrink-0">

      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[var(--text-main)] font-black text-[17px] leading-tight">GiziSnap</h1>
            <p className="text-[var(--primary)] text-[11px] font-medium">AI Nutrition Tracker</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-[var(--border)]">
        <div className="bg-gray-50 rounded-2xl p-3.5 flex items-center gap-3">
          <div className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <PersonaIcon size={18} className={cfg.color} />
          </div>
          <div className="min-w-0">
            <p className="text-[var(--text-main)] font-bold text-[14px] truncate">{firstName}</p>
            <p className="text-[var(--text-muted)] text-[11px] truncate">{user?.email}</p>
            <span className={`text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>
          </div>
        </div>
      </div>

      {/* Navigasi */}
      <nav className="px-3 pt-4 flex-1 space-y-1">
        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Menu</p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 relative group
                ${isActive
                  ? 'bg-emerald-50 text-[var(--primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-50'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--primary)] rounded-r-full"
                />
              )}
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[14px] font-semibold">{label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </motion.button>
          )
        })}
      </nav>

      {/* Ringkasan hari ini */}
      <div className="px-4 py-4 border-t border-[var(--border)]">
        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-3 px-1">Hari Ini</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Flame,    label: 'Kal',    value: cal,  unit: 'kcal', color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: Beef,     label: 'Prot',   value: prot, unit: 'g',    color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { icon: Wheat,    label: 'Karbo',  value: karb, unit: 'g',    color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: Droplets, label: 'Lemak',  value: fat,  unit: 'g',    color: 'text-yellow-500', bg: 'bg-yellow-50' },
          ].map(({ icon: Icon, label, value, unit, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-2.5 flex flex-col gap-1`}>
              <div className="flex items-center gap-1.5">
                <Icon size={12} className={color} />
                <span className="text-gray-500 text-[10px] font-medium">{label}</span>
              </div>
              <span className="text-[var(--text-main)] font-black text-[15px]">{value}</span>
              <span className="text-[var(--text-muted)] text-[9px]">{unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all text-left"
        >
          <LogOut size={16} />
          <span className="text-[13px] font-semibold">Keluar</span>
        </button>
      </div>
    </aside>
  )
}
