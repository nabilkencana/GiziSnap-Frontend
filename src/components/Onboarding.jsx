import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scale, HeartPulse, Dumbbell, ArrowRight, CheckCircle2, Sparkles, Flame, Droplets, Beef } from 'lucide-react'

const personas = [
  {
    id: 'weightloss',
    icon: Scale,
    label: 'Turun Berat Badan',
    subtitle: 'Defisit kalori harian',
    description: 'Pantau kalori, pertahankan defisit, dan capai berat ideal secara berkelanjutan.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.25)',
    light: 'bg-violet-50',
    border: 'border-violet-200',
    accent: '#8b5cf6',
    badge: 'bg-violet-100 text-violet-700',
    tags: ['Defisit Kalori', 'Tinggi Serat', 'Rendah Karbo'],
    stats: [
      { icon: Flame,    val: '1500',  unit: 'kcal/hari', label: 'Target Kalori' },
      { icon: Beef,     val: '90g',   unit: '/hari',      label: 'Protein' },
      { icon: Droplets, val: '2.0L',  unit: '/hari',      label: 'Hidrasi' },
    ],
  },
  {
    id: 'diabetes',
    icon: HeartPulse,
    label: 'Diabetes Care',
    subtitle: 'Kontrol karbohidrat & gula darah',
    description: 'Monitor indeks glikemik dan kelola asupan karbo untuk gula darah yang stabil.',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.25)',
    light: 'bg-rose-50',
    border: 'border-rose-200',
    accent: '#f43f5e',
    badge: 'bg-rose-100 text-rose-700',
    tags: ['GI Rendah', 'Kontrol Karbo', 'Tinggi Serat'],
    stats: [
      { icon: Flame,    val: '1800',  unit: 'kcal/hari', label: 'Target Kalori' },
      { icon: Beef,     val: '80g',   unit: '/hari',      label: 'Protein' },
      { icon: Droplets, val: '2.5L',  unit: '/hari',      label: 'Hidrasi' },
    ],
  },
  {
    id: 'bodybuilder',
    icon: Dumbbell,
    label: 'Pembentukan Otot',
    subtitle: 'Tinggi protein & surplus kalori',
    description: 'Capai target protein, optimalkan makro, dan bangun fisik impianmu.',
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'rgba(59,130,246,0.25)',
    light: 'bg-blue-50',
    border: 'border-blue-200',
    accent: '#3b82f6',
    badge: 'bg-blue-100 text-blue-700',
    tags: ['Surplus Kalori', 'Tinggi Protein', 'Post-Workout'],
    stats: [
      { icon: Flame,    val: '2800',  unit: 'kcal/hari', label: 'Target Kalori' },
      { icon: Beef,     val: '185g',  unit: '/hari',      label: 'Protein' },
      { icon: Droplets, val: '3.0L',  unit: '/hari',      label: 'Hidrasi' },
    ],
  },
]

export default function Onboarding({ onSelect }) {
  const [selected, setSelected] = useState(null)
  const [confirming, setConfirming] = useState(false)

  const handleConfirm = () => {
    if (!selected) return
    setConfirming(true)
    setTimeout(() => onSelect(selected), 700)
  }

  const selectedPersona = personas.find(p => p.id === selected)

  return (
    <div className="relative flex flex-col min-h-full overflow-hidden bg-[#f8fafc]">

      {/* ── Animated ambient background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-300 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-violet-300 blur-[90px]"
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-blue-300 blur-[80px]"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-full max-w-lg mx-auto w-full">

        {/* ── Header ── */}
        <div className="px-6 pt-14 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="text-[13px] font-bold text-emerald-600 tracking-widest uppercase">GiziSnap</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <h1 className="text-[32px] font-black text-gray-900 leading-[1.15] tracking-tight">
              Apa tujuan<br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                nutrisimu?
              </span>
            </h1>
            <p className="text-[13px] text-gray-500 mt-2.5 leading-relaxed">
              AI akan mengkustomisasi target kalori, makro, dan rekomendasi makanan untukmu.
            </p>
          </motion.div>
        </div>

        {/* ── Persona Cards ── */}
        <div className="flex-1 px-5 space-y-3 pb-4">
          {personas.map((p, i) => {
            const isSelected = selected === p.id
            const Icon = p.icon

            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + i * 0.08, type: 'spring', stiffness: 340, damping: 30 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setSelected(p.id)}
                className="w-full text-left rounded-3xl border-2 overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isSelected ? p.accent : '#e5e7eb',
                  background: isSelected ? `${p.glow.replace('0.25', '0.06')}` : '#fff',
                  boxShadow: isSelected
                    ? `0 8px 32px ${p.glow}, 0 2px 8px rgba(0,0,0,0.04)`
                    : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {/* Card Top */}
                <div className="p-4 flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
                  >
                    <Icon size={22} className="text-white" strokeWidth={2.2} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 text-[15px]">{p.label}</span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="ml-auto"
                          >
                            <CheckCircle2 size={18} style={{ color: p.accent }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: p.accent }}>{p.subtitle}</p>
                    <p className="text-[12px] text-gray-500 leading-relaxed mt-1">{p.description}</p>
                  </div>
                </div>

                {/* Expanded stats — only when selected */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      {/* Tags */}
                      <div className="flex gap-1.5 px-4 pb-3 flex-wrap">
                        {p.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{ background: `${p.accent}18`, color: p.accent }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Mini stats */}
                      <div
                        className="grid grid-cols-3 divide-x mx-4 mb-4 rounded-2xl overflow-hidden border"
                        style={{ borderColor: `${p.accent}25`, divideColor: `${p.accent}25` }}
                      >
                        {p.stats.map(({ icon: StatIcon, val, unit, label }) => (
                          <div
                            key={label}
                            className="px-2 py-2.5 text-center"
                            style={{ background: `${p.accent}08` }}
                          >
                            <StatIcon size={13} className="mx-auto mb-1" style={{ color: p.accent }} />
                            <p className="text-[13px] font-black text-gray-800 leading-none">{val}</p>
                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        {/* ── CTA Button ── */}
        <div className="px-5 pb-12 pt-3">
          <motion.button
            onClick={handleConfirm}
            disabled={!selected || confirming}
            whileHover={selected ? { scale: 1.01 } : {}}
            whileTap={selected ? { scale: 0.97 } : {}}
            className="w-full h-14 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2.5 transition-all duration-300 relative overflow-hidden"
            style={{
              background: selected
                ? `linear-gradient(135deg, ${selectedPersona?.accent}, ${selectedPersona?.accent}cc)`
                : '#e5e7eb',
              color: selected ? '#fff' : '#9ca3af',
              boxShadow: selected ? `0 8px 24px ${selectedPersona?.glow}` : 'none',
            }}
          >
            {/* Shimmer effect on active */}
            {selected && !confirming && (
              <motion.div
                className="absolute inset-0 -skew-x-12 translate-x-[-100%]"
                animate={{ translateX: ['−100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
              />
            )}

            {confirming ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
              />
            ) : (
              <>
                Mulai Perjalanan
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>

          {!selected && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-[11px] text-gray-400 mt-3 font-medium"
            >
              Pilih salah satu persona di atas
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}
