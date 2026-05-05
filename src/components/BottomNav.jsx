import { motion, AnimatePresence } from 'framer-motion'
import { Home, Camera, BookOpen } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Beranda', Icon: Home },
  { id: 'scanner',   label: 'Scan',    Icon: Camera },
  { id: 'wiki',      label: 'WikiGizi', Icon: BookOpen },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="glass-nav flex items-center justify-around px-2 py-2 relative z-50">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id
        const isScanner = id === 'scanner'

        if (isScanner) {
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative -mt-8 flex flex-col items-center"
              aria-label="Open Scanner"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.06 }}
                className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-colors
                  ${isActive
                    ? 'bg-emerald-600 shadow-emerald-600/40'
                    : 'bg-emerald-500 shadow-emerald-500/30 hover:bg-emerald-600'}
                `}
              >
                <Camera size={28} className="text-white" strokeWidth={2} />
              </motion.div>
              <span className="text-[10px] font-semibold mt-1 text-emerald-600">{label}</span>
            </button>
          )
        }

        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center gap-0.5 flex-1 py-1"
            aria-label={label}
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="relative flex flex-col items-center"
            >
              <div className="relative">
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-emerald-100 rounded-xl"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ margin: '-6px -10px' }}
                    />
                  )}
                </AnimatePresence>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={`relative z-10 transition-colors duration-200 ${
                    isActive ? 'text-emerald-600' : 'text-gray-400'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </motion.div>
          </button>
        )
      })}
    </nav>
  )
}
