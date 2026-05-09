import { useState, useRef, useMemo, useCallback } from 'react'
import { apiFetch } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Zap, RotateCcw, Check, Flame, Beef, Wheat, Droplets,
  AlertCircle, ImagePlus, Link2, X, Sparkles, UtensilsCrossed,
  ChevronDown, ChevronUp, Star, GlassWater, Utensils, ScanSearch,
  RefreshCw
} from 'lucide-react'

// ── Compress image ─────────────────────────────────────────────────────────────
const compressImage = async (base64Str) => {
  if (!base64Str.startsWith('data:')) return base64Str
  return new Promise((resolve) => {
    const img = new Image()
    img.src = base64Str
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img
      const maxDim = 800
      if (width > height && width > maxDim) { height = Math.round((height * maxDim) / width); width = maxDim }
      else if (height > maxDim) { width = Math.round((width * maxDim) / height); height = maxDim }
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.6))
    }
    img.onerror = () => resolve(base64Str)
  })
}

const MODES = [
  { id: 'camera', label: 'Kamera', icon: Camera },
  { id: 'upload', label: 'Upload', icon: ImagePlus },
  { id: 'url',    label: 'URL',    icon: Link2 },
]

// Food category color map
const FOOD_COLORS = {
  nasi: '#FF6B6B', ayam: '#4ECDC4', ikan: '#45B7D1', sayur: '#96CEB4',
  telur: '#FFEAA7', tempe: '#DDA0DD', tahu: '#98D8C8', buah: '#FFB347',
  mie: '#87CEEB', bakso: '#F8A5C2', kerupuk: '#BADC58', pangsit: '#F9CA24',
  sambal: '#EB4D4B', kuah: '#BDC3C7', rendang: '#E17055', soto: '#FDCB6E',
}
const getFoodColor = (name = '') => {
  const lower = name.toLowerCase()
  for (const [key, color] of Object.entries(FOOD_COLORS)) {
    if (lower.includes(key)) return color
  }
  return '#A29BFE'
}

// ── Single food card ───────────────────────────────────────────────────────────
function FoodCard({ item, index }) {
  const [expanded, setExpanded] = useState(false)
  const color = getFoodColor(item.detectedName)
  const pct = Math.round((item.confidence ?? 0) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white/60 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/40 shadow-sm"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        style={{ background: `${color}18` }}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Color dot + number */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black text-white flex-shrink-0"
          style={{ background: color }}>
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-gray-900 truncate">{item.detectedName}</p>
          <p className="text-[11px] text-gray-500 truncate">{item.portion}</p>
        </div>

        {/* Status + confidence */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {item.inDatabase ? (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">DB ✓</span>
          ) : (
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Baru</span>
          )}
          <span className="text-[10px] text-gray-400">{pct}% yakin</span>
        </div>

        {item.food && (
          expanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        )}
      </div>

      {/* Nutrition detail (expandable) */}
      <AnimatePresence>
        {expanded && item.food && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-white/50 backdrop-blur-md border-t border-white/40">
              {[
                { label: 'Kalori', val: item.food.calories ?? 0, unit: 'kcal', color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: 'Protein', val: item.food.protein ?? 0, unit: 'g', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Karbo', val: item.food.carbs ?? 0, unit: 'g', color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Lemak', val: item.food.fat ?? 0, unit: 'g', color: 'text-amber-500', bg: 'bg-amber-50' },
              ].map(({ label, val, unit, color: tc, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-2 flex flex-col items-center gap-0.5`}>
                  <span className={`text-[14px] font-black ${tc}`}>{val}</span>
                  <span className="text-[9px] text-gray-500">{label}</span>
                  <span className="text-[9px] text-gray-400">{unit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Total nutrition summary ────────────────────────────────────────────────────
function TotalNutrition({ totals, foodCount }) {
  return (
    <div className="bg-emerald-50/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 text-emerald-900 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] text-emerald-600 font-semibold">TOTAL NUTRISI</p>
          <p className="text-[13px] font-bold text-gray-900">{foodCount} item terdeteksi</p>
        </div>
        <div className="w-10 h-10 bg-white shadow-sm border border-emerald-100 rounded-2xl flex items-center justify-center">
          <Flame size={20} className="text-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Kalori', val: Math.round(totals.calories), unit: 'kcal', Icon: Flame, color: 'text-orange-500', bg: 'bg-white/60 backdrop-blur-sm' },
          { label: 'Protein', val: Math.round(totals.protein), unit: 'g', Icon: Beef, color: 'text-emerald-600', bg: 'bg-white/60 backdrop-blur-sm' },
          { label: 'Karbo', val: Math.round(totals.carbs), unit: 'g', Icon: Wheat, color: 'text-blue-500', bg: 'bg-white/60 backdrop-blur-sm' },
          { label: 'Lemak', val: Math.round(totals.fat), unit: 'g', Icon: Droplets, color: 'text-amber-500', bg: 'bg-white/60 backdrop-blur-sm' },
        ].map(({ label, val, unit, Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-2 flex flex-col items-center gap-0.5 shadow-sm border border-emerald-50`}>
            <Icon size={13} className={color} />
            <span className="text-[16px] font-black text-gray-900">{val}</span>
            <span className="text-[9px] text-gray-500">{label}</span>
            <span className="text-[9px] text-gray-400">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Scanner({ userId }) {
  const [mode, setMode]         = useState('camera')
  const [stage, setStage]       = useState('idle')
  const [saved, setSaved]       = useState(false)
  const [result, setResult]     = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [preview, setPreview]   = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const videoRef  = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const fileRef   = useRef(null)

  const handleReset = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    setStage('idle'); setSaved(false); setIsSaving(false)
    setResult(null); setErrorMsg(''); setPreview(null); setUrlInput('')
    if (fileRef.current) fileRef.current.value = ''
  }, [])

  const sendToBackend = useCallback(async (imagePayload) => {
    setStage('scanning')
    try {
      const resp = await apiFetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imagePayload }),
      })
      if (!resp.ok) throw new Error(`Server error ${resp.status}`)
      const data = await resp.json()
      setResult(data); setStage('scanned')
    } catch (err) {
      console.error('[Scan]', err)
      setErrorMsg('Gagal menganalisis gambar. Coba lagi.')
      setStage('error')
    }
  }, [])

  const startCamera = useCallback(async () => {
    setStage('capturing'); setResult(null); setSaved(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
    } catch {
      setErrorMsg('Tidak bisa akses kamera. Coba mode Upload.')
      setStage('error')
    }
  }, [])

  const handleSnap = useCallback(async () => {
    if (stage !== 'capturing') return
    const canvas = canvasRef.current, video = videoRef.current
    let videoW = video?.videoWidth || 640
    let videoH = video?.videoHeight || 480
    if (videoW === 0 || videoH === 0) {
      videoW = 640; videoH = 480;
    }
    if (canvas && video) {
      canvas.width = videoW; canvas.height = videoH
      canvas.getContext('2d').drawImage(video, 0, 0, videoW, videoH)
    }
    let base64 = canvas?.toDataURL('image/jpeg', 0.85) ?? ''
    streamRef.current?.getTracks().forEach(t => t.stop())
    base64 = await compressImage(base64)
    setPreview(base64); await sendToBackend(base64)
  }, [stage, sendToBackend])

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      let b64 = ev.target.result
      b64 = await compressImage(b64)
      setPreview(b64); await sendToBackend(b64)
    }
    reader.readAsDataURL(file)
  }, [sendToBackend])

  const handleUrlAnalyze = useCallback(async () => {
    const url = urlInput.trim()
    if (!url) return
    setPreview(url); await sendToBackend(url)
  }, [urlInput, sendToBackend])

  const handleSave = useCallback(async () => {
    if (!result?.foods?.length || !userId) return
    setIsSaving(true)

    // Hanya save makanan yang berhasil dikenali di DB (punya food.id)
    const toSave = result.foods.filter(item => item.food?.id)
    if (toSave.length === 0) {
      setSaved(true)
      setIsSaving(false)
      setTimeout(handleReset, 1500)
      return
    }

    try {
      for (const item of toSave) {
        // parse number from string like '1 porsi', default 1
        let parsedPortion = 1;
        if (item.portion) {
          const match = item.portion.match(/[\d.]+/);
          if (match) parsedPortion = parseFloat(match[0]);
        }

        await apiFetch('/api/daily-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            foodId: item.food.id,
            portion: parsedPortion || 1,
          }),
        })
      }
      setSaved(true)
      setIsSaving(false)
      setTimeout(handleReset, 1800)
    } catch (err) {
      console.error('Gagal menyimpan log:', err)
      setSaved(false)
      setIsSaving(false)
    }
  }, [result, userId, handleReset])


  const changeMode = (m) => { handleReset(); setMode(m) }

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUT AREA
  // ═══════════════════════════════════════════════════════════════════════════
  const renderInputArea = () => {
    if (mode === 'camera') {
      return (
        <div className="relative flex-1 flex items-center justify-center overflow-hidden" style={{ minHeight: 320 }}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-50" />
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-emerald-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-teal-100/50 rounded-full blur-3xl" />

          <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${stage === 'capturing' ? 'opacity-100' : 'opacity-0'}`} playsInline muted autoPlay />
          <canvas ref={canvasRef} className="hidden" />

          {/* Laser scan */}
          <AnimatePresence>
            {stage === 'scanning' && (
              <motion.div key="laser" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <motion.div animate={{ y: ['-45%', '45%'] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', repeatType: 'reverse' }}
                  className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bracket */}
          <div className="relative z-10" style={{ width: 224, height: 224 }}>
            <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-md" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-md" />
            <AnimatePresence mode="wait">
              {stage === 'idle' && (
                <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500 text-[13px] text-center font-medium px-8 leading-relaxed">
                    Tekan tombol kamera<br />untuk foto makananmu
                  </p>
                </motion.div>
              )}
              {stage === 'capturing' && (
                <motion.div key="cap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center">
                  <p className="text-emerald-400 text-[12px] font-bold tracking-wide">Arahkan ke makanan...</p>
                </motion.div>
              )}
              {stage === 'scanning' && (
                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Sparkles size={24} className="text-emerald-400" />
                  <p className="text-emerald-400 text-[13px] font-bold tracking-wide">AI Food Nutrition...</p>
                </motion.div>
              )}
              {stage === 'scanned' && (
                <motion.div key="done" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl">🍽️</span>
                  <div className="mt-3 px-4 py-1.5 bg-emerald-500/90 rounded-full flex items-center gap-1.5">
                    <Zap size={12} className="text-white" />
                    <span className="text-white text-[12px] font-bold">AI Terdeteksi</span>
                  </div>
                </motion.div>
              )}
              {stage === 'error' && (
                <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                  <AlertCircle size={32} className="text-red-400" />
                  <p className="text-red-300 text-[11px] text-center">{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status badge */}
          <div className="absolute top-4 left-5 right-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 bg-white/90 border border-gray-200 shadow-sm rounded-full px-3 py-1.5 backdrop-blur-sm">
              <div className={`w-2 h-2 rounded-full ${stage === 'scanning' || stage === 'capturing' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-gray-700 text-[11px] font-semibold">
                {stage === 'scanning' ? 'AI Food Nutrition' : stage === 'capturing' ? 'KAMERA ON' : 'AI SCANNER'}
              </span>
            </div>
            {stage !== 'idle' && (
              <button onClick={handleReset} className="bg-white/90 border border-gray-200 shadow-sm rounded-full p-2 backdrop-blur-sm hover:bg-gray-50 transition-colors">
                <RotateCcw size={15} className="text-gray-600" />
              </button>
            )}
          </div>

          {/* Snap button */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
            <AnimatePresence>
              {stage === 'idle' && (
                <motion.button key="open" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }} whileTap={{ scale: 0.88 }} onClick={startCamera}
                  style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(16,185,129,0.3)', padding: 6 }}>
                  <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                    <Camera size={26} className="text-white" />
                  </div>
                </motion.button>
              )}
              {stage === 'capturing' && (
                <motion.button key="snap" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }} whileTap={{ scale: 0.88 }} onClick={handleSnap}
                  style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(16,185,129,0.5)', padding: 6 }}>
                  <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    <Camera size={26} className="text-white" />
                  </div>
                </motion.button>
              )}
              {stage === 'error' && (
                <motion.button key="retry" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }} whileTap={{ scale: 0.88 }} onClick={startCamera}
                  style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(239,68,68,0.3)', padding: 6 }}>
                  <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                    <RotateCcw size={26} className="text-white" />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      )
    }

    if (mode === 'upload') {
      return (
        <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/40 flex flex-col items-center justify-center p-6 gap-5 shadow-sm">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {preview && stage !== 'idle' ? (
            <div className="relative w-full max-w-xs lg:max-w-sm rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img src={preview} alt="Preview" className="w-full object-cover max-h-60 lg:max-h-80" />
              {stage === 'scanning' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
                  <p className="text-emerald-600 text-[12px] font-bold">AI Food Nutrition mendeteksi...</p>
                </div>
              )}
              {stage === 'scanned' && (
                <div className="absolute top-2 right-2">
                  <button onClick={handleReset} className="bg-white/90 shadow-sm border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 transition-colors">
                    <X size={14} className="text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => fileRef.current?.click()} disabled={stage === 'scanning'}
              className="w-full max-w-xs lg:max-w-sm border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-2xl p-10 lg:p-14 flex flex-col items-center gap-3 transition-colors group bg-white shadow-sm hover:shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                <ImagePlus size={28} className="text-emerald-500" />
              </div>
              <p className="text-gray-700 text-[14px] font-semibold">Ketuk untuk pilih gambar</p>
              <p className="text-gray-400 text-[12px]">JPG, PNG, WEBP</p>
            </motion.button>
          )}
          {stage === 'error' && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 w-full max-w-xs">
              <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-[12px]">{errorMsg}</p>
            </div>
          )}
          {(stage === 'idle' || stage === 'error') && (
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => fileRef.current?.click()}
               className="w-full max-w-xs lg:max-w-sm py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20 text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-colors">
              <ImagePlus size={18} /> Pilih Gambar Makanan
            </motion.button>
          )}
        </div>
      )
    }

    // mode === 'url'
    return (
      <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/40 flex flex-col items-center justify-center p-6 gap-5 shadow-sm">
        {preview && stage !== 'idle' ? (
          <div className="relative w-full max-w-xs lg:max-w-sm rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            <img src={preview} alt="Preview" className="w-full object-cover max-h-60 lg:max-h-80"
              onError={() => setErrorMsg('URL gambar tidak valid atau tidak bisa diakses.')} />
            {stage === 'scanning' && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
                <p className="text-emerald-600 text-[12px] font-bold">AI Food Nutrition menganalisis...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center">
            <Link2 size={28} className="text-emerald-500" />
          </div>
        )}
        <div className="w-full max-w-xs lg:max-w-sm space-y-3">
          <p className="text-gray-700 text-[13px] font-semibold text-center">Masukkan URL gambar makanan</p>
          <div className="flex gap-2">
            <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
              placeholder="https://example.com/foto-makanan.jpg"
              className="flex-1 bg-white text-gray-900 text-[13px] rounded-xl px-4 py-3 outline-none border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-400 transition-colors shadow-sm" />
            {urlInput && (
              <button onClick={() => setUrlInput('')} className="bg-gray-100 hover:bg-gray-200 border border-gray-200 shadow-sm rounded-xl px-3 transition-colors">
                <X size={14} className="text-gray-500" />
              </button>
            )}
          </div>
          {stage === 'error' && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-[11px]">{errorMsg}</p>
            </div>
          )}
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleUrlAnalyze}
            disabled={!urlInput.trim() || stage === 'scanning'}
            className="w-full py-3.5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md
              disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 text-white">
            {stage === 'scanning' ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <><Zap size={16} /> Analisis dengan AI Food Nutrition</>
            )}
          </motion.button>
          {stage === 'error' && (
            <button onClick={handleReset} className="w-full py-2.5 text-[13px] text-gray-500 font-medium flex items-center justify-center gap-1 hover:text-gray-700 transition-colors">
              <RotateCcw size={13} /> Coba lagi
            </button>
          )}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RESULT PANEL
  // ═══════════════════════════════════════════════════════════════════════════
  const renderResult = () => {
    if (stage !== 'scanned' || !result) return null

    const foods = result.foods ?? []
    const totals = result.totals ?? { calories: 0, protein: 0, carbs: 0, fat: 0 }
    const notInDb = result.notInDatabase ?? []
    const hasData = foods.length > 0

    return (
      <motion.div
        key="result-card"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        className="bg-white/80 backdrop-blur-2xl rounded-t-3xl lg:rounded-none px-5 pt-5 pb-8 shadow-2xl lg:shadow-none w-full"
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 lg:hidden" />

        {/* Preview */}
        {preview && (
          <div className="w-full rounded-2xl overflow-hidden mb-4 max-h-36 lg:max-h-48">
            <img src={preview} alt="Foto makanan" className="w-full object-cover max-h-36 lg:max-h-48" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-emerald-500" />
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                AI Food Nutrition
              </span>
            </div>
            {(() => {
              const isDrink = hasData && foods.some(f =>
                ['teh','kopi','jus','susu','air','minuman','es batu','sirup','soda'].some(k =>
                  f.detectedName.toLowerCase().includes(k)
                )
              )
              const Icon = !hasData ? ScanSearch : isDrink ? GlassWater : Utensils
              return (
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    !hasData ? 'bg-gray-100' : isDrink ? 'bg-blue-100' : 'bg-emerald-100'
                  }`}>
                    <Icon size={16} className={!hasData ? 'text-gray-400' : isDrink ? 'text-blue-600' : 'text-emerald-600'} />
                  </div>
                  <h2 className="text-[17px] lg:text-[20px] font-black text-gray-900">
                    {hasData ? `${foods.length} Item Terdeteksi` : 'Tidak Terdeteksi'}
                  </h2>
                </div>
              )
            })()}
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{result.message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleSave} disabled={isSaving || saved}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition-all flex-shrink-0 ${
                saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-300'
              }`}>
              {isSaving ? <><RefreshCw size={13} className="animate-spin" /> Menyimpan...</> : saved ? <><Check size={13} /> Tersimpan</> : 'Simpan'}
            </motion.button>
          </div>
        </div>

        {/* Not in database warning */}
        {notInDb.length > 0 && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4">
            <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-700">
              <strong>{notInDb.join(', ')}</strong> belum ada di database. Tambahkan lewat tab <strong>WikiGizi</strong>!
            </p>
          </div>
        )}

        {/* Total nutrition */}
        {hasData && (
          <div className="mb-4">
            <TotalNutrition totals={totals} foodCount={foods.filter(f => f.food).length} />
          </div>
        )}

        {/* Food list */}
        {hasData && (
          <div className="space-y-2 mb-4">
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider px-1">
              Detail per Item <span className="text-gray-400 font-normal normal-case">(ketuk untuk nutrisi)</span>
            </p>
            {foods.map((item, i) => (
              <FoodCard key={i} item={item} index={i} />
            ))}
          </div>
        )}

        <button onClick={handleReset}
          className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mt-4">
          <RotateCcw size={15} /> Scan Ulang
        </button>
      </motion.div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col flex-1 bg-[#f8fbfa] overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between bg-white/60 backdrop-blur-xl border-b border-white/40 px-8 py-5">
        <div>
          <h1 className="text-[22px] font-black text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center border border-emerald-200">
              <Sparkles size={16} className="text-emerald-600" />
            </div>
            Scan AI Makanan & Minuman
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5 ml-10">
            AI Food Nutrition — deteksi semua item sekaligus dari satu foto
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          AI Food Nutrition Aktif
        </div>
      </div>

      {/* Desktop: Side-by-Side | Mobile: Stacked (Absolute Result) */}
      <div className="flex-1 flex flex-col lg:flex-row relative">

        {/* LEFT: Input Column */}
        <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col flex-1 lg:border-r lg:border-white/40 bg-transparent">
          {/* Mode Tabs */}
          <div className="flex bg-white/40 backdrop-blur-md border-b border-white/40 pt-2 lg:pt-0 gap-0">
            {MODES.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => changeMode(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 lg:py-4 text-[12px] font-bold transition-all ${
                  mode === id
                    ? 'bg-white/80 backdrop-blur-lg text-emerald-600 border-b-2 border-emerald-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50 border-b-2 border-transparent'
                }`}>
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {renderInputArea()}
        </div>

        {/* RIGHT: Result Column */}
        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-y-auto lg:static lg:relative lg:w-1/2 xl:w-[55%] lg:h-full lg:overflow-hidden lg:bg-white/30 lg:backdrop-blur-sm pointer-events-auto"
          style={{ height: 'min(85vh, calc(100vh - 2rem))', scrollBehavior: 'smooth' }}>
          {/* Desktop idle placeholder */}
          {stage !== 'scanned' && (
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center text-center p-10 h-full">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-5">
                <UtensilsCrossed size={32} className="text-gray-300" />
              </div>
              <h3 className="text-[18px] font-bold text-gray-400 mb-2">Belum Ada Hasil</h3>
              <p className="text-[13px] text-gray-300 max-w-xs leading-relaxed">
                {stage === 'scanning'
                  ? 'AI Food Nutrition sedang mendeteksi semua item dalam foto...'
                  : 'Upload atau foto makanan MBG-mu. AI Food Nutrition akan mendeteksi semua komponen sekaligus!'}
              </p>
              {stage === 'scanning' && (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mt-6" />
              )}
            </div>
          )}

          {/* Result card (Mobile & Desktop) */}
          <div className="pointer-events-auto w-full lg:h-full lg:overflow-y-auto lg:p-0">
            <AnimatePresence mode="wait">
              {renderResult()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
