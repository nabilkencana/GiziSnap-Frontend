import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ImagePlus, Send, CheckCircle2, AlertCircle, ChevronDown,
  Utensils, Flame, Beef, Wheat, Droplets, X, Sparkles,
  Search, BookOpen, PlusCircle, ThumbsUp, ShieldCheck,
  Star, GlassWater, Info, TrendingUp, Zap, Heart, ImageOff,
} from 'lucide-react'


const CATEGORIES = [
  'Makanan Utama', 'Camilan', 'Minuman', 'Sarapan', 'Dessert', 'Street Food'
]

const INITIAL_FORM = {
  name: '', category: '', calories: '', protein: '', carbs: '', fat: '', notes: '', image: null,
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function calColor(cal) {
  if (cal < 100) return { bg: 'bg-sky-50', badge: 'bg-sky-100', text: 'text-sky-700', bar: 'bg-sky-400', ring: 'ring-sky-200', label: 'Rendah' }
  if (cal < 250) return { bg: 'bg-emerald-50', badge: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-400', ring: 'ring-emerald-200', label: 'Sedang' }
  if (cal < 450) return { bg: 'bg-amber-50', badge: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-400', ring: 'ring-amber-200', label: 'Tinggi' }
  return { bg: 'bg-red-50', badge: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-400', ring: 'ring-red-200', label: 'Sangat Tinggi' }
}

function isDrinkItem(name = '') {
  return ['teh', 'kopi', 'jus', 'susu', 'soda', 'air', 'minuman', 'es', 'sirup', 'smoothie'].some(k =>
    name.toLowerCase().includes(k)
  )
}

function foodEmoji(name = '') {
  const n = name.toLowerCase()
  if (n.includes('nasi')) return '🍚'
  if (n.includes('ayam')) return '🍗'
  if (n.includes('ikan')) return '🐟'
  if (n.includes('bakso') || n.includes('mie') || n.includes('mi')) return '🍜'
  if (n.includes('sate')) return '🍢'
  if (n.includes('kopi') || n.includes('coffee')) return '☕'
  if (n.includes('teh') || n.includes('es teh')) return '🧋'
  if (n.includes('jus') || n.includes('smoothie')) return '🥤'
  if (n.includes('susu') || n.includes('milk')) return '🥛'
  if (n.includes('buah') || n.includes('apel') || n.includes('pisang')) return '🍎'
  if (n.includes('sayur')) return '🥦'
  if (n.includes('roti') || n.includes('bread')) return '🍞'
  if (n.includes('telur') || n.includes('egg')) return '🥚'
  if (n.includes('pizza')) return '🍕'
  if (n.includes('burger')) return '🍔'
  if (n.includes('soto') || n.includes('sup') || n.includes('soup')) return '🍲'
  if (n.includes('rendang') || n.includes('daging') || n.includes('sapi')) return '🥩'
  if (n.includes('tempe') || n.includes('tahu')) return '🫘'
  if (n.includes('kerupuk') || n.includes('snack') || n.includes('camilan')) return '🍿'
  if (n.includes('kue') || n.includes('cake') || n.includes('dessert')) return '🍰'
  if (isDrinkItem(n)) return '🥤'
  return '🍽️'
}

// ── Indonesian food name → English keyword for image search ─────────────────
const FOOD_KEYWORD_MAP = [
  ['nasi goreng', 'fried rice'],
  ['nasi uduk', 'steamed coconut rice'],
  ['nasi padang', 'rice padang'],
  ['nasi', 'rice dish'],
  ['ayam goreng', 'fried chicken'],
  ['ayam bakar', 'grilled chicken'],
  ['ayam', 'chicken dish'],
  ['bakso', 'meatball soup'],
  ['mi goreng', 'fried noodles'],
  ['mie goreng', 'fried noodles'],
  ['soto ayam', 'chicken soup noodle'],
  ['soto', 'indonesian soup'],
  ['sate', 'satay skewer'],
  ['rendang', 'beef rendang curry'],
  ['ikan bakar', 'grilled fish'],
  ['ikan goreng', 'fried fish'],
  ['ikan', 'fish dish'],
  ['tempe goreng', 'fried tempeh'],
  ['tempe', 'tempeh'],
  ['tahu goreng', 'fried tofu'],
  ['tahu', 'tofu dish'],
  ['gado gado', 'peanut sauce salad'],
  ['pecel', 'vegetable peanut sauce'],
  ['ketoprak', 'indonesian salad'],
  ['lontong', 'rice cake'],
  ['opor', 'chicken coconut curry'],
  ['gulai', 'curry stew'],
  ['rawon', 'black beef soup'],
  ['pempek', 'fish cake'],
  ['siomay', 'fish dumpling'],
  ['batagor', 'fried dumpling'],
  ['martabak', 'stuffed pancake'],
  ['es teh manis', 'iced sweet tea'],
  ['es teh', 'iced tea'],
  ['teh manis', 'sweet tea'],
  ['teh', 'tea cup'],
  ['kopi susu', 'milk coffee'],
  ['kopi hitam', 'black coffee'],
  ['kopi', 'coffee cup'],
  ['es jeruk', 'orange juice ice'],
  ['jus mangga', 'mango juice'],
  ['jus alpukat', 'avocado juice'],
  ['jus', 'fresh juice'],
  ['susu', 'milk glass'],
  ['es campur', 'mixed ice dessert'],
  ['es krim', 'ice cream'],
  ['es', 'cold drink iced'],
  ['roti bakar', 'toasted bread'],
  ['roti', 'bread'],
  ['telur dadar', 'omelette'],
  ['telur', 'egg dish'],
  ['sayur sop', 'vegetable soup'],
  ['sayur asem', 'sour vegetable soup'],
  ['sayur', 'vegetables cooked'],
  ['sup', 'soup bowl'],
  ['pizza', 'pizza'],
  ['burger', 'hamburger'],
  ['sandwich', 'sandwich'],
  ['kerupuk', 'prawn crackers'],
  ['kue', 'cake dessert'],
  ['donat', 'donut'],
  ['pisang goreng', 'fried banana'],
  ['pisang', 'banana'],
  ['mangga', 'mango'],
  ['buah', 'fresh fruit'],
  ['salad', 'salad bowl'],
  ['steak', 'beef steak'],
  ['pasta', 'pasta dish'],
]

function getImageKeyword(name = '') {
  const lower = name.toLowerCase().trim()
  for (const [key, val] of FOOD_KEYWORD_MAP) {
    if (lower.includes(key)) return val
  }
  // Fallback: use name as-is + food
  return `${name} food`
}

// ── Module-level cache so each food name only fetches once ───────────────────
const _imgCache = new Map() // name → url | null

async function fetchWikiImage(name) {
  if (_imgCache.has(name)) return _imgCache.get(name)
  const keyword = getImageKeyword(name)
  const titles = [keyword.replace(/ /g, '_'), name.replace(/ /g, '_')]
  for (const title of titles) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { signal: AbortSignal.timeout(6000) }
      )
      if (res.ok) {
        const data = await res.json()
        const url = data.thumbnail?.source
        if (url) { _imgCache.set(name, url); return url }
      }
    } catch { /* try next title */ }
  }
  _imgCache.set(name, null)
  return null
}

// ── Smart Food Image ──────────────────────────────────────────────────────────
function FoodImage({ name, imageUrl, className, iconSize = 32, showLoader = true }) {
  const cached = _imgCache.get(name)
  const [imgUrl, setImgUrl] = useState(imageUrl || (cached ?? null))
  const [status, setStatus] = useState(
    imageUrl ? 'loading'
    : cached === undefined ? 'fetching'
    : cached ? 'loading'
    : 'error'
  )

  // Choose icon based on food type
  const isDrink = isDrinkItem(name)
  const FoodIcon = isDrink ? GlassWater : Utensils
  const iconColor = isDrink ? 'text-blue-300' : 'text-emerald-300'
  const bgColor   = isDrink ? 'bg-blue-50'   : 'bg-emerald-50'

  useEffect(() => {
    if (imageUrl || _imgCache.has(name)) return
    let cancelled = false
    fetchWikiImage(name).then(url => {
      if (cancelled) return
      if (url) { setImgUrl(url); setStatus('loading') }
      else setStatus('error')
    })
    return () => { cancelled = true }
  }, [name, imageUrl])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Real photo */}
      {imgUrl && (
        <img
          key={imgUrl}
          src={imgUrl}
          alt={name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setStatus('loaded')}
          onError={() => { setImgUrl(null); setStatus('error') }}
        />
      )}

      {/* Error fallback — icon instead of emoji */}
      {status === 'error' && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 ${bgColor}`}>
          <div className="w-10 h-10 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center">
            <ImageOff size={iconSize * 0.6} className="text-gray-300" />
          </div>
          <FoodIcon size={iconSize * 0.55} className={`${iconColor} opacity-60`} />
        </div>
      )}

      {/* Skeleton shimmer — fetching / loading */}
      {(status === 'fetching' || status === 'loading') && showLoader && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${bgColor} overflow-hidden`}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-10 h-10 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center"
          >
            <FoodIcon size={iconSize * 0.55} className={iconColor} />
          </motion.div>
          {/* Shimmer sweep */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
          />
        </div>
      )}
    </div>
  )
}




function MacroBar({ label, value, max, color, unit }) {

  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold text-gray-500">{label}</span>
        <span className="font-black text-gray-700">{value?.toFixed(1) ?? 0}{unit}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

// ── Detail Modal ─────────────────────────────────────────────────────────────
function FoodDetailModal({ item, onClose, onUpvote }) {
  const c = calColor(item.calories)
  const drink = isDrinkItem(item.name)
  const emoji = foodEmoji(item.name)

  // Macro percentages based on typical daily values
  const maxCalories = 700
  const maxProtein = 50
  const maxCarbs = 100
  const maxFat = 40

  const totalMacroKcal = (item.protein * 4) + (item.carbs * 4) + (item.fat * 9)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full sm:max-w-md bg-white/90 backdrop-blur-2xl border border-white/50 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Image / Hero */}
        <div className={`relative h-52 overflow-hidden ${c.bg}`}>
          <FoodImage
            name={item.name}
            imageUrl={item.imageUrl}
            className="absolute inset-0 w-full h-full"
            fallbackSize="text-8xl"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <X size={16} className="text-white" />
          </button>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-1.5">
            {drink
              ? <span className="bg-blue-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><GlassWater size={10} /> Minuman</span>
              : <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Utensils size={10} /> Makanan</span>
            }
          </div>

          {/* Calorie badge bottom */}
          <div className="absolute bottom-4 right-4">
            <div className={`${c.badge} ${c.ring} ring-2 px-3 py-1.5 rounded-xl text-center`}>
              <p className={`text-[20px] font-black leading-none ${c.text}`}>{Math.round(item.calories)}</p>
              <p className={`text-[9px] font-bold ${c.text}`}>kcal • {c.label}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="text-[20px] font-black text-gray-900 leading-tight">{item.name}</h2>
            {item.isVerified
              ? <span className="flex-shrink-0 flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full mt-0.5"><ShieldCheck size={10} /> Verified</span>
              : <span className="flex-shrink-0 flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full mt-0.5"><Star size={10} /> AI Est.</span>
            }
          </div>
          <p className="text-[12px] text-gray-400 mb-4">per porsi sajian</p>

          {/* Macro summary cards */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="bg-emerald-50/60 backdrop-blur-sm border border-white/40 rounded-2xl p-3 text-center">
              <div className="w-7 h-7 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Beef size={14} className="text-emerald-600" />
              </div>
              <p className="text-[16px] font-black text-emerald-700">{item.protein?.toFixed(1) ?? 0}</p>
              <p className="text-[9px] font-bold text-emerald-500 uppercase">Protein g</p>
            </div>
            <div className="bg-blue-50/60 backdrop-blur-sm border border-white/40 rounded-2xl p-3 text-center">
              <div className="w-7 h-7 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Wheat size={14} className="text-blue-600" />
              </div>
              <p className="text-[16px] font-black text-blue-700">{item.carbs?.toFixed(1) ?? 0}</p>
              <p className="text-[9px] font-bold text-blue-500 uppercase">Karbo g</p>
            </div>
            <div className="bg-amber-50/60 backdrop-blur-sm border border-white/40 rounded-2xl p-3 text-center">
              <div className="w-7 h-7 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Droplets size={14} className="text-amber-600" />
              </div>
              <p className="text-[16px] font-black text-amber-700">{item.fat?.toFixed(1) ?? 0}</p>
              <p className="text-[9px] font-bold text-amber-500 uppercase">Lemak g</p>
            </div>
          </div>

          {/* Macro bars */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm rounded-2xl p-4 mb-4 space-y-3">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Distribusi Makronutrien</p>
            <MacroBar label="Protein" value={item.protein ?? 0} max={maxProtein} color="bg-emerald-400" unit="g" />
            <MacroBar label="Karbohidrat" value={item.carbs ?? 0} max={maxCarbs} color="bg-blue-400" unit="g" />
            <MacroBar label="Lemak" value={item.fat ?? 0} max={maxFat} color="bg-amber-400" unit="g" />
            <MacroBar label="Kalori" value={item.calories ?? 0} max={maxCalories} color={c.bar} unit=" kcal" />
          </div>

          {/* Calorie breakdown */}
          {totalMacroKcal > 0 && (
            <div className="bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm rounded-2xl p-4 mb-4">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Sumber Kalori</p>
              <div className="flex gap-1.5 h-4 rounded-full overflow-hidden mb-2">
                <div style={{ width: `${(item.protein * 4 / totalMacroKcal) * 100}%` }} className="bg-emerald-400 rounded-full" />
                <div style={{ width: `${(item.carbs * 4 / totalMacroKcal) * 100}%` }} className="bg-blue-400 rounded-full" />
                <div style={{ width: `${(item.fat * 9 / totalMacroKcal) * 100}%` }} className="bg-amber-400 rounded-full" />
              </div>
              <div className="flex gap-3 text-[10px] font-semibold">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" />Protein {((item.protein * 4 / totalMacroKcal) * 100).toFixed(0)}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full inline-block" />Karbo {((item.carbs * 4 / totalMacroKcal) * 100).toFixed(0)}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full inline-block" />Lemak {((item.fat * 9 / totalMacroKcal) * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}

          {/* Upvote */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onUpvote(item.id)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-[14px] shadow-sm shadow-emerald-200 hover:bg-emerald-600 transition-colors"
          >
            <ThumbsUp size={16} />
            Upvote ({item.upvotes ?? 0}) — Konfirmasi Akurasi
          </motion.button>

          {!item.isVerified && (
            <p className="text-center text-[10px] text-gray-400 mt-2">
              ⚠️ Data nutrisi merupakan estimasi dari AI. Butuh {Math.max(0, 6 - (item.upvotes ?? 0))} upvote lagi untuk verified.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Food Card (catalog) ───────────────────────────────────────────────────────
function FoodCard({ item, onClick }) {
  const c = calColor(item.calories)
  const drink = isDrinkItem(item.name)
  const emoji = foodEmoji(item.name)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(item)}
      className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-emerald-200 transition-all duration-200 active:scale-[0.97]"
    >
      {/* Card hero */}
      <div className={`relative h-28 overflow-hidden ${c.bg}`}>
        <FoodImage
          name={item.name}
          imageUrl={item.imageUrl}
          className="absolute inset-0 w-full h-full"
          fallbackSize="text-4xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        {/* Calorie pill */}
        <div className={`absolute bottom-2 right-2 ${c.badge} px-2 py-0.5 rounded-full flex items-center gap-1`}>
          <Flame size={10} className={c.text} />
          <span className={`text-[11px] font-black ${c.text}`}>{Math.round(item.calories)} kcal</span>
        </div>
        {/* Type pill */}
        <div className="absolute top-2 left-2">
          {drink
            ? <span className="bg-blue-500/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full"><GlassWater size={8} className="inline mr-0.5" />Minuman</span>
            : <span className="bg-emerald-500/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full"><Utensils size={8} className="inline mr-0.5" />Makanan</span>
          }
        </div>
        {/* Verified dot */}
        {item.isVerified && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <ShieldCheck size={10} className="text-white" />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-3">
        <p className="text-[13px] font-black text-gray-900 leading-tight mb-2 line-clamp-1">{item.name}</p>
        <div className="grid grid-cols-3 gap-1">
          <div className="text-center">
            <p className="text-[11px] font-black text-emerald-600">{item.protein?.toFixed(0) ?? 0}g</p>
            <p className="text-[9px] text-gray-400 font-semibold">Prot</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-[11px] font-black text-blue-600">{item.carbs?.toFixed(0) ?? 0}g</p>
            <p className="text-[9px] text-gray-400 font-semibold">Karbo</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-black text-amber-600">{item.fat?.toFixed(0) ?? 0}g</p>
            <p className="text-[9px] text-gray-400 font-semibold">Lemak</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Form helpers ─────────────────────────────────────────────────────────────
function FieldLabel({ children, required }) {
  return (
    <label className="block text-[12px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
      {children}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
  )
}

function NutritionInput({ icon: Icon, label, value, onChange, unit, color }) {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={14} className="text-white" />
        </div>
        <span className="text-[12px] font-bold text-gray-600">{label}</span>
        <span className="text-[10px] text-gray-400 ml-auto">{unit}</span>
      </div>
      <input
        type="number" value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0" min="0"
        className="w-full text-[22px] font-black text-gray-800 bg-transparent outline-none placeholder-gray-200"
      />
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function WikiGizi({ userId }) {
  const [tab, setTab] = useState('encyclopedia')

  // ─ Form state ─
  const [form, setForm] = useState(INITIAL_FORM)
  const [showCategory, setShowCategory] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [uploadingImage, setUploadingImage] = useState(false)

  // ─ Encyclopedia state ─
  const [foods, setFoods] = useState([])
  const [loadingFoods, setLoadingFoods] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('Semua')
  const [selectedFood, setSelectedFood] = useState(null)

  const update = (key) => (val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  // ─ Load foods ─
  const loadFoods = useCallback(async (q = '') => {
    setLoadingFoods(true)
    try {
      const url = q ? `/api/foods?search=${encodeURIComponent(q)}` : '/api/foods'
      const res = await apiFetch(url)
      if (res.ok) setFoods(await res.json())
    } catch (e) { console.error('[WikiGizi]', e) }
    finally { setLoadingFoods(false) }
  }, [])

  useEffect(() => { loadFoods() }, [loadFoods])
  useEffect(() => {
    const t = setTimeout(() => loadFoods(search), 350)
    return () => clearTimeout(t)
  }, [search, loadFoods])

  const handleUpvote = async (id) => {
    try {
      await apiFetch(`/api/foods/${id}/upvote`, { method: 'PATCH' })
      setFoods(prev => prev.map(f => f.id === id ? { ...f, upvotes: (f.upvotes || 0) + 1 } : f))
      if (selectedFood?.id === id) setSelectedFood(f => ({ ...f, upvotes: (f.upvotes || 0) + 1 }))
    } catch (e) { console.error(e) }
  }

  const FILTER_TABS = ['Semua', 'Makanan', 'Minuman']
  const filteredFoods = foods.filter(f => {
    if (filterCat === 'Minuman') return isDrinkItem(f.name)
    if (filterCat === 'Makanan') return !isDrinkItem(f.name)
    return true
  })

  // ─ Stats ─
  const totalVerified = filteredFoods.filter(f => f.isVerified).length
  const totalAI = filteredFoods.filter(f => !f.isVerified).length
  const avgCal = filteredFoods.length > 0
    ? Math.round(filteredFoods.reduce((s, f) => s + (f.calories || 0), 0) / filteredFoods.length)
    : 0

  // ─ Image handler ─
  const processImageFile = (file) => {
    if (!file) return
    setForm(f => ({ ...f, image: file }))
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleImageChange = (e) => {
    processImageFile(e.target.files[0])
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    processImageFile(e.dataTransfer?.files[0])
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama makanan wajib diisi'
    if (!form.category) errs.category = 'Pilih kategori'
    if (!form.calories) errs.calories = 'Wajib diisi'
    if (!form.protein) errs.protein = 'Wajib diisi'
    if (!form.carbs) errs.carbs = 'Wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      // 1️⃣ Upload foto terlebih dahulu (jika ada)
      let imageUrl = null
      if (form.image) {
        setUploadingImage(true)
        const fd = new FormData()
        fd.append('image', form.image)
        const imgRes = await apiFetch('/api/foods/upload-image', {
          method: 'POST',
          body: fd,
        })
        if (imgRes.ok) {
          const imgData = await imgRes.json()
          imageUrl = imgData.imageUrl   // e.g. '/uploads/foods/1234.jpg'
        }
        setUploadingImage(false)
      }

      // 2️⃣ Simpan data makanan (dengan imageUrl kalau ada)
      const payload = {
        name: form.name.trim(),
        calories: parseFloat(form.calories),
        protein: parseFloat(form.protein),
        carbs: parseFloat(form.carbs),
        fat: parseFloat(form.fat || '0'),
        ...(imageUrl ? { imageUrl } : {}),
      }
      if (userId && userId !== 'guest' && userId.length > 10) payload.userId = userId
      const resp = await apiFetch('/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err?.message ?? `Server error ${resp.status}`)
      }
      setSubmitting(false)
      setSubmitted(true)
      loadFoods()
      setTimeout(() => {
        setSubmitted(false)
        setForm(INITIAL_FORM)
        setImagePreview(null)
        setErrors({})
      }, 2800)
    } catch (err) {
      console.error('[WikiGizi]', err)
      setSubmitError(err.message ?? 'Gagal submit. Coba lagi.')
      setSubmitting(false)
      setUploadingImage(false)
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8fbfa]">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-white/40 px-5 lg:px-10 pt-12 lg:pt-10 pb-5 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-emerald-500" />
            </div>
            <span className="text-emerald-600 text-[12px] font-semibold uppercase tracking-wider">WikiGizi</span>
          </div>
          <h1 className="text-[22px] font-black text-gray-900 leading-tight mb-4">
            Ensiklopedia Gizi 🥗<br />
            <span className="text-gray-500 text-[14px] font-medium">
              Pelajari & tambah data nutrisi makanan–minuman
            </span>
          </h1>
          {/* Tab switcher */}
          <div className="flex gap-2">
            {[{ id: 'encyclopedia', label: 'Ensiklopedia', icon: BookOpen }, { id: 'add', label: 'Tambah Data', icon: PlusCircle }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${tab === t.id ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <t.icon size={14} />{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════════ ENCYCLOPEDIA TAB ══════════════ */}
        {tab === 'encyclopedia' && (
          <motion.div key="encyclopedia"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 px-4 lg:px-10 pt-5 pb-24 max-w-4xl w-full mx-auto"
          >
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-3 shadow-sm text-center">
                <p className="text-[18px] font-black text-gray-800">{filteredFoods.length}</p>
                <p className="text-[10px] text-gray-400 font-semibold">Total Item</p>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-3 shadow-sm text-center">
                <p className="text-[18px] font-black text-emerald-600">{totalVerified}</p>
                <p className="text-[10px] text-gray-400 font-semibold">Verified</p>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-3 shadow-sm text-center">
                <p className="text-[18px] font-black text-amber-600">{avgCal}</p>
                <p className="text-[10px] text-gray-400 font-semibold">Avg kcal</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari makanan atau minuman..."
                className="w-full pl-10 pr-10 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl text-[14px] text-gray-800 outline-none focus:border-emerald-400 shadow-sm transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <X size={12} className="text-gray-500" />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
              {FILTER_TABS.map(f => (
                <button key={f} onClick={() => setFilterCat(f)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${filterCat === f ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-white/60 backdrop-blur-sm text-gray-500 border border-white/40 shadow-sm hover:border-emerald-300'}`}
                >
                  {f}
                </button>
              ))}
              <div className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] text-gray-400">
                <Info size={11} />
                <span>Ketuk kartu untuk detail</span>
              </div>
            </div>

            {/* Grid */}
            {loadingFoods ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full"
                />
                <p className="text-[13px] text-gray-400 font-medium">Memuat ensiklopedia gizi...</p>
              </div>
            ) : filteredFoods.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">🔍</div>
                <p className="text-[14px] font-black text-gray-400">Tidak ditemukan</p>
                <p className="text-[12px] text-gray-300 text-center max-w-xs">Coba kata kunci lain atau tambahkan makanan baru ke database</p>
                <button onClick={() => setTab('add')}
                  className="mt-2 flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-lg shadow-emerald-200"
                >
                  <PlusCircle size={15} /> Tambah Sekarang
                </button>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <AnimatePresence>
                  {filteredFoods.map(item => (
                    <FoodCard key={item.id} item={item} onClick={setSelectedFood} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ══════════════ ADD TAB ══════════════ */}
        {tab === 'add' && (
          <motion.form key="add"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSubmit}
            className="flex-1 px-4 lg:px-10 pt-5 pb-8 space-y-4 max-w-4xl w-full mx-auto lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 lg:items-start"
          >
            {/* Food Name */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-sm">
              <FieldLabel required>Nama Makanan / Minuman</FieldLabel>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Utensils size={18} className="text-emerald-500" />
                </div>
                <input type="text" value={form.name} onChange={e => update('name')(e.target.value)}
                  placeholder='Contoh: Es Teh Manis, Nasi Goreng 🍛'
                  className="flex-1 text-[15px] font-semibold text-gray-800 bg-transparent outline-none placeholder-gray-300"
                />
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] text-red-500 font-medium mt-2 flex items-center gap-1"
                  ><AlertCircle size={11} /> {errors.name}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Category */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-sm" style={{ position: 'relative', zIndex: showCategory ? 50 : 'auto' }}>
              <FieldLabel required>Kategori</FieldLabel>
              <button type="button" onClick={() => setShowCategory(v => !v)}
                className={`w-full flex items-center justify-between py-2 px-3 rounded-xl transition-colors ${
                  showCategory ? 'bg-emerald-50' : 'hover:bg-gray-50'
                }`}
              >
                <span className={`text-[14px] font-semibold ${form.category ? 'text-gray-800' : 'text-gray-400'}`}>
                  {form.category || 'Pilih kategori...'}
                </span>
                <motion.div animate={{ rotate: showCategory ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={18} className={showCategory ? 'text-emerald-500' : 'text-gray-400'} />
                </motion.div>
              </button>
              <AnimatePresence>
                {showCategory && (
                  <>
                    {/* Backdrop to close on outside click */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowCategory(false)} />
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0.92, y: -6 }}
                      animate={{ opacity: 1, scaleY: 1, y: 0 }}
                      exit={{ opacity: 0, scaleY: 0.92, y: -6 }}
                      style={{ originY: 0 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-1.5">
                        {CATEGORIES.map((c, i) => (
                          <button key={c} type="button"
                            onClick={() => { update('category')(c); setShowCategory(false) }}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${
                              form.category === c
                                ? 'bg-emerald-500 text-white'
                                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {form.category === c && <CheckCircle2 size={13} />}
                              {c}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {errors.category && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] text-red-500 font-medium mt-2 flex items-center gap-1"
                  ><AlertCircle size={11} /> {errors.category}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Image Upload */}
            <div>
              <FieldLabel>Foto (opsional)</FieldLabel>
              {/* Hidden input */}
              <input
                id="food-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <motion.div
                whileTap={{ scale: 0.99 }}
                onDragOver={e => e.preventDefault()}
                onDrop={handleImageDrop}
                className={`relative rounded-2xl border-2 border-dashed overflow-hidden transition-colors ${
                  imagePreview
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400 hover:bg-emerald-50/60'
                }`}
                style={{ minHeight: 120 }}
              >
                <AnimatePresence mode="wait">
                  {imagePreview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-44 object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setImagePreview(null)
                          setForm(f => ({ ...f, image: null }))
                          // reset input so same file can be re-selected
                          const inp = document.getElementById('food-image')
                          if (inp) inp.value = ''
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <X size={14} className="text-white" />
                      </button>
                      {/* Success badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <CheckCircle2 size={12} className="text-white" />
                        <span className="text-white text-[11px] font-bold">Foto siap diupload</span>
                      </div>
                      {/* Replace prompt */}
                      <label
                        htmlFor="food-image"
                        className="absolute bottom-3 right-3 cursor-pointer bg-white/20 backdrop-blur-sm border border-white/40 rounded-full px-3 py-1"
                      >
                        <span className="text-white text-[10px] font-semibold">Ganti</span>
                      </label>
                    </motion.div>
                  ) : (
                    <motion.label
                      key="placeholder"
                      htmlFor="food-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-8 gap-2 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                        <ImagePlus size={22} className="text-emerald-500" />
                      </div>
                      <p className="text-[13px] font-semibold text-emerald-600">Ketuk untuk pilih foto</p>
                      <p className="text-[11px] text-gray-400">atau seret & lepas di sini</p>
                      <p className="text-[10px] text-gray-300">JPG, PNG, WEBP — maks 5 MB</p>
                    </motion.label>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Nutrition Grid */}
            <div>
              <FieldLabel required>Informasi Gizi (per porsi)</FieldLabel>
              <div className="grid grid-cols-2 gap-2.5">
                <NutritionInput icon={Flame} label="Kalori" unit="kcal" color="bg-orange-400" value={form.calories} onChange={update('calories')} />
                <NutritionInput icon={Beef} label="Protein" unit="gram" color="bg-emerald-500" value={form.protein} onChange={update('protein')} />
                <NutritionInput icon={Wheat} label="Karbohidrat" unit="gram" color="bg-blue-500" value={form.carbs} onChange={update('carbs')} />
                <NutritionInput icon={Droplets} label="Lemak" unit="gram" color="bg-amber-500" value={form.fat} onChange={update('fat')} />
              </div>
              <AnimatePresence>
                {(errors.calories || errors.protein || errors.carbs) && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] text-red-500 font-medium mt-2 flex items-center gap-1"
                  ><AlertCircle size={11} /> Lengkapi kalori, protein, dan karbohidrat</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Notes */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-sm">
              <FieldLabel>Catatan Tambahan</FieldLabel>
              <textarea value={form.notes} onChange={e => update('notes')(e.target.value)}
                placeholder="Asal daerah, cara memasak, variasi, dll..."
                rows={3}
                className="w-full text-[13px] text-gray-700 bg-transparent outline-none placeholder-gray-300 resize-none leading-relaxed"
              />
            </div>

            {/* Submit */}
            <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={submitting || submitted || uploadingImage}
              className={`w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2.5 transition-all duration-300 shadow-sm mt-2 ${submitted ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'}`}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.span key="done" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />Berhasil Ditambahkan! 🎉
                  </motion.span>
                ) : uploadingImage ? (
                  <motion.span key="uploading" className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full flex-shrink-0"
                    />
                    Mengunggah foto...
                  </motion.span>
                ) : submitting ? (
                  <motion.div key="loading" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <motion.span key="idle" className="flex items-center gap-2">
                    <Send size={17} />Simpan ke Database
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <p className="text-center text-[11px] text-gray-400 leading-relaxed pb-2">
              Data tersimpan langsung. Butuh 6 upvote komunitas untuk status Verified. 🌿
            </p>

            <AnimatePresence>
              {submitError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                >
                  <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                  <p className="text-[12px] text-red-600 font-medium">{submitError}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}

      </AnimatePresence>

      {/* ── Detail Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedFood && (
          <FoodDetailModal
            item={selectedFood}
            onClose={() => setSelectedFood(null)}
            onUpvote={handleUpvote}
          />
        )}
      </AnimatePresence>

    </div>
  )
}
