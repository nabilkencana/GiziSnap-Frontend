import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scale, HeartPulse, Dumbbell, ChevronRight, Sparkles } from 'lucide-react'

const personas = [
  {
    id: 'weightloss',
    icon: Scale,
    label: 'Turun Berat Badan',
    subtitle: 'Defisit kalori harian',
    description: 'Track calories, stay in deficit, and reach your goal weight sustainably.',
    gradient: 'bg-violet-500',
    light: 'bg-violet-50',
    badge: 'bg-violet-100 text-violet-700',
    ring: 'ring-violet-400',
    emoji: '🥗',
  },
  {
    id: 'diabetes',
    icon: HeartPulse,
    label: 'Diabetes Care',
    subtitle: 'Kontrol karbohidrat',
    description: 'Monitor glycemic index and manage carbohydrate intake for stable blood sugar.',
    gradient: 'bg-rose-500',
    light: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    ring: 'ring-rose-400',
    emoji: '🩺',
  },
  {
    id: 'bodybuilder',
    icon: Dumbbell,
    label: 'Pembentukan Otot',
    subtitle: 'Tinggi protein',
    description: 'Hit your protein targets, optimize macros, and build the physique you want.',
    gradient: 'bg-blue-500',
    light: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    ring: 'ring-blue-400',
    emoji: '💪',
  },
]

export default function Onboarding({ onSelect }) {
  const [selected, setSelected] = useState(null)
  const [confirming, setConfirming] = useState(false)

  const handleConfirm = () => {
    if (!selected) return
    setConfirming(true)
    setTimeout(() => onSelect(selected), 600)
  }

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-4"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shadow-sm">
            <Sparkles size={18} className="text-emerald-500" />
          </div>
          <span className="text-[13px] font-semibold text-emerald-600 tracking-wide uppercase">GiziSnap</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-black text-gray-900 leading-tight"
        >
          Apa tujuan<br />
          <span className="text-emerald-500">
            nutrisimu?
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 mt-2"
        >
          Pilih persona untuk mengkustomisasi dashboard dan rekomendasi AI-mu.
        </motion.p>
      </div>

      {/* Persona Cards */}
      <div className="flex-1 px-5 space-y-3 pb-4">
        {personas.map((p, i) => {
          const isSelected = selected === p.id
          const Icon = p.icon

          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(p.id)}
              className={`
                w-full text-left rounded-2xl p-4 border-2 transition-all duration-300
                ${isSelected
                  ? `border-transparent ring-2 ${p.ring} ${p.light} shadow-lg`
                  : 'border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-gray-200'}
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icon blob */}
                <div className={`w-12 h-12 rounded-xl ${p.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <Icon size={22} className="text-white" strokeWidth={2} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-900 text-[15px]">{p.label}</span>
                    <span className="text-base">{p.emoji}</span>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${p.badge}`}
                        >
                          DIPILIH
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-[11px] font-semibold text-gray-400 mb-1">{p.subtitle}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{p.description}</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="px-5 pb-10 pt-2">
        <motion.button
          onClick={handleConfirm}
          disabled={!selected || confirming}
          whileTap={{ scale: 0.96 }}
          className={`
            w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2
            transition-all duration-300 shadow-sm
            ${selected
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-gray-100 text-gray-400'}
          `}
        >
          {confirming ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              Mulai Perjalanan
              <ChevronRight size={18} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
