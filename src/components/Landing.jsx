import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Scan, Shield, TrendingUp, ChevronRight, Leaf, Activity, Camera, PieChart, Users, CheckCircle2, Menu, X, Smartphone, Brain, Flame } from 'lucide-react'

const FEATURES = [
  { 
    icon: Camera, 
    title: 'AI Scanner Pintar', 
    desc: 'Cukup foto makananmu. Teknologi AI kami akan mengenali kalori serta makronutrisi (Protein, Karbohidrat, Lemak) dalam hitungan detik tanpa perlu input manual.',
    color: 'var(--primary)'
  },
  { 
    icon: Shield, 
    title: 'Database Lokal Terpercaya', 
    desc: 'Kami membangun database yang dioptimalkan khusus untuk makanan khas Indonesia. Dari Nasi Padang hingga Gado-gado, akurasinya sangat tinggi dan terverifikasi.',
    color: 'var(--secondary)'
  },
  { 
    icon: PieChart, 
    title: 'Personalisasi Target', 
    desc: 'Apakah kamu ingin menurunkan berat badan, menjaga gula darah (Diabetes Care), atau membentuk otot? GiziSnap menyesuaikan target harianmu secara otomatis.',
    color: 'var(--accent)'
  },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Jepret Makananmu', desc: 'Buka fitur Scanner dan arahkan kamera ke piringmu, atau cukup unggah foto dari galeri.' },
  { step: '2', title: 'AI Menganalisis', desc: 'Sistem cerdas GiziSnap langsung memecah gambar dan mengidentifikasi porsi serta jenis makanan.' },
  { step: '3', title: 'Nutrisi Tercatat', desc: 'Dapatkan rincian kalori & makro instan. Simpan ke jurnal harianmu dengan satu ketukan.' },
  { step: '4', title: 'Pantau Progress', desc: 'Lihat grafik mingguan dan evaluasi asupanmu untuk mencapai target hidup sehatmu.' },
]

export default function Landing({ onProceed }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, 200])
  const y2 = useTransform(scrollY, [0, 1000], [0, -200])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="h-[100dvh] w-full bg-[var(--background)] overflow-y-auto overflow-x-hidden font-sans text-[var(--text-main)] block">
      
      {/* ── Top Navbar ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-[var(--border)] py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary-light)]">
              <Leaf size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-[var(--text-main)]">Gizi<span className="text-[var(--primary)]">Snap</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-[var(--text-muted)]">
            <a href="#fitur" onClick={(e) => handleSmoothScroll(e, 'fitur')} className="hover:text-[var(--primary)] transition-colors">Fitur Unggulan</a>
            <a href="#cara-kerja" onClick={(e) => handleSmoothScroll(e, 'cara-kerja')} className="hover:text-[var(--primary)] transition-colors">Cara Kerja</a>
            <a href="#penjelasan" onClick={(e) => handleSmoothScroll(e, 'penjelasan')} className="hover:text-[var(--primary)] transition-colors">Mengapa GiziSnap?</a>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onProceed}
              className="px-6 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Mulai Sekarang
            </button>
          </div>

          <button className="md:hidden text-[var(--text-main)]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="absolute top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-white/95 backdrop-blur-xl shadow-[-20px_0_40px_rgba(0,0,0,0.05)] pt-32 px-8 flex flex-col border-l border-white/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle ambient color blobs to remove the 'flat' feel */}
              <div className="absolute top-0 right-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
                <div className="absolute bottom-[20%] left-[-20%] w-72 h-72 bg-teal-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
              </div>

              <div className="flex flex-col gap-8 relative z-10">
                {[
                  { id: 'fitur', label: 'Fitur Unggulan' },
                  { id: 'cara-kerja', label: 'Cara Kerja' },
                  { id: 'penjelasan', label: 'Mengapa GiziSnap?' }
                ].map((item) => (
                  <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    onClick={(e) => handleSmoothScroll(e, item.id)} 
                    className="group relative text-3xl font-black tracking-tighter text-slate-800 transition-colors hover:text-emerald-600"
                  >
                    {item.label}
                    <span className="absolute -bottom-2 left-0 w-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300 group-hover:w-1/3 rounded-full"></span>
                  </a>
                ))}
              </div>
              
              <div className="mt-auto pb-12 relative z-10">
                <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/90 p-6 rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(16,185,129,0.06)] relative overflow-hidden group">
                  <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-emerald-200/30 rounded-full blur-xl pointer-events-none transition-transform group-hover:scale-110"></div>
                  <p className="text-emerald-900/70 text-[13px] mb-5 font-bold leading-relaxed relative z-10">
                    Siap memulai gaya hidup sehat yang sesungguhnya?
                  </p>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); onProceed(); }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-[15px] shadow-xl shadow-emerald-500/25 active:scale-95 transition-all relative z-10"
                  >
                    Mulai Gratis
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Decorative elements */}
        <motion.div style={{ y: y1 }} className="absolute top-10 right-10 w-[600px] h-[600px] bg-[var(--primary-light)] rounded-full blur-[120px] opacity-40 pointer-events-none" />
        <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--secondary-light)] rounded-full blur-[120px] pointer-events-none opacity-40" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Hero Text */}
            <motion.div 
              className="flex-1 text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)] text-xs font-bold uppercase tracking-wider mb-8">
                <Activity size={14} />
                <span>Revolusi Pelacakan Nutrisi</span>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl lg:text-7xl font-black text-[var(--text-main)] leading-[1.1] tracking-tight mb-6">
                  Kenali Gizi <br className="hidden lg:block" />
                  <span className="text-[var(--primary)]">
                    Dalam Sekali Jepret
                  </span>
                </h1>
              </motion.div>

              <motion.p variants={itemVariants} className="text-[var(--text-muted)] text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                Tinggalkan cara lama mencatat kalori. Gunakan kecerdasan buatan untuk menganalisis makanan lokal Indonesia langsung dari kamera ponselmu. Cepat, akurat, dan sangat mudah.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button 
                  onClick={onProceed}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-3 bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary-light)] hover:-translate-y-1 transition-all"
                >
                  Mulai Sekarang Gratis
                  <ChevronRight size={20} />
                </button>
                <a 
                  href="#penjelasan"
                  onClick={(e) => handleSmoothScroll(e, 'penjelasan')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center bg-white border-2 border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-all"
                >
                  Pelajari Lebih Lanjut
                </a>
              </motion.div>
            </motion.div>

            {/* Hero Image / Mockup */}
            <motion.div 
              className="flex-1 w-full max-w-lg lg:max-w-none relative"
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              style={{ perspective: 1000 }}
            >
              <div className="relative rounded-[2.5rem] bg-white border-[8px] border-[var(--surface)] shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
                {/* Mockup Header */}
                <div className="h-16 border-b border-[var(--border)] flex items-center px-6 gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--surface-hover)] flex items-center justify-center"><Camera size={20} className="text-[var(--primary)]"/></div>
                  <div>
                    <div className="h-3 w-24 bg-[var(--border)] rounded-full mb-2"></div>
                    <div className="h-2 w-16 bg-[var(--border)] rounded-full"></div>
                  </div>
                </div>
                {/* Mockup Body */}
                <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center relative">
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                    <motion.div 
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-[var(--text-main)] text-lg">Sate Ayam Madura</h4>
                        <span className="bg-[var(--primary-light)] text-[var(--primary-dark)] px-3 py-1 rounded-full text-xs font-bold">98% Match</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-[var(--surface)] p-2 rounded-lg">
                          <p className="text-[10px] text-[var(--text-muted)] font-bold">KALORI</p>
                          <p className="font-black text-[var(--text-main)]">320</p>
                        </div>
                        <div className="bg-[var(--surface)] p-2 rounded-lg">
                          <p className="text-[10px] text-[var(--text-muted)] font-bold">PROTEIN</p>
                          <p className="font-black text-[var(--text-main)]">24g</p>
                        </div>
                        <div className="bg-[var(--surface)] p-2 rounded-lg">
                          <p className="text-[10px] text-[var(--text-muted)] font-bold">LEMAK</p>
                          <p className="font-black text-[var(--text-main)]">15g</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Why GiziSnap (Detailed Explanation) ── */}
      <section id="penjelasan" className="py-24 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex-1"
            >
              <h2 className="text-3xl lg:text-5xl font-black text-[var(--text-main)] mb-6 leading-tight">Mengapa Anda Membutuhkan GiziSnap?</h2>
              <p className="text-lg text-[var(--text-muted)] mb-6 leading-relaxed">
                Mencatat kalori seringkali terasa melelahkan karena harus mencari secara manual di database yang tidak memiliki makanan khas Indonesia. GiziSnap hadir untuk memecahkan masalah tersebut.
              </p>
              <ul className="space-y-6">
                {[
                  { icon: Brain, title: 'Kecerdasan Buatan Terdepan', desc: 'Kami menggunakan model AI terbaru untuk mengenali jenis makanan dari foto, bahkan untuk hidangan yang dicampur.' },
                  { icon: Smartphone, title: 'Desain Aplikasi yang Clean & Cepat', desc: 'Tidak ada iklan yang mengganggu. Antarmuka kami dirancang khusus agar Anda bisa fokus pada progres kesehatan Anda.' },
                  { icon: Users, title: 'Cocok Untuk Segala Kebutuhan', desc: 'Baik Anda seorang atlet yang butuh protein tinggi, atau sedang menjaga gula darah, GiziSnap menyesuaikan target makro harian Anda.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-[var(--primary)]">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[var(--text-main)] mb-1">{item.title}</h4>
                      <p className="text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <div className="flex-1 w-full grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-[var(--border)] flex flex-col gap-4 translate-y-8"
              >
                <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center"><Flame size={24}/></div>
                <h3 className="font-bold text-2xl text-[var(--text-main)]">Defisit Kalori</h3>
                <p className="text-[var(--text-muted)] text-sm">Pelacakan yang akurat memastikan Anda tetap dalam batas harian untuk menurunkan berat badan.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-[var(--border)] flex flex-col gap-4"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center"><Activity size={24}/></div>
                <h3 className="font-bold text-2xl text-[var(--text-main)]">Gula Darah</h3>
                <p className="text-[var(--text-muted)] text-sm">Pantau asupan karbohidrat Anda dengan mudah untuk menghindari lonjakan glukosa.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-[var(--border)] flex flex-col gap-4 translate-y-8"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center"><Leaf size={24}/></div>
                <h3 className="font-bold text-2xl text-[var(--text-main)]">Vegan & Nabati</h3>
                <p className="text-[var(--text-muted)] text-sm">Pastikan Anda mendapatkan protein yang cukup dari sumber nabati setiap hari.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-[var(--primary)] text-white p-6 rounded-3xl shadow-lg flex flex-col gap-4 justify-center items-center text-center"
              >
                <h3 className="font-black text-2xl">+60 Makanan</h3>
                <p className="text-white/80 text-sm font-medium">Database lokal Indonesia yang terus berkembang.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="fitur" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-[var(--text-main)] mb-6">Fitur Canggih di Ujung Jari</h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">Semua yang Anda butuhkan untuk mencapai target kesehatan, dirangkum dalam satu aplikasi yang indah.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className="bg-[var(--surface)] rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all border border-[var(--border)] group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={28} style={{ color: feature.color }} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-main)] mb-4">{feature.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="cara-kerja" className="py-24 bg-[var(--surface)] border-y border-[var(--border)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 w-full relative">
               {/* App Interface Mockup */}
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-white p-6 aspect-[9/16] max-w-sm mx-auto relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-40 bg-[var(--primary)] rounded-t-3xl z-0"></div>
                  <div className="relative z-10 pt-8">
                    <h5 className="text-white font-black text-2xl mb-1">Beranda</h5>
                    <p className="text-white/80 text-sm mb-8">Target harian Anda: 2000 kcal</p>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-xs text-[var(--text-muted)] font-bold mb-1">TERKONSUMSI</p>
                          <p className="text-3xl font-black text-[var(--text-main)]">1,450</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[var(--text-muted)] font-bold mb-1">SISA</p>
                          <p className="text-xl font-bold text-[var(--primary)]">550</p>
                        </div>
                      </div>
                      <div className="w-full bg-[var(--surface)] rounded-full h-3 mb-2"><div className="bg-[var(--primary)] h-3 rounded-full w-[70%]"></div></div>
                    </div>

                    <h6 className="font-bold text-[var(--text-main)] mb-3">Log Makanan Hari Ini</h6>
                    <div className="space-y-3">
                      {[
                        {n: 'Telur Rebus', c: '155 kcal'},
                        {n: 'Nasi Putih', c: '204 kcal'},
                        {n: 'Ayam Bakar', c: '310 kcal'}
                      ].map((f, i) => (
                        <div key={i} className="flex justify-between items-center bg-[var(--surface)] p-3 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-xs">🍳</div>
                            <span className="font-semibold text-sm">{f.n}</span>
                          </div>
                          <span className="text-sm font-bold text-[var(--text-muted)]">{f.c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
               </motion.div>
            </div>

            <div className="flex-1">
              <h2 className="text-3xl lg:text-5xl font-black text-[var(--text-main)] mb-6">Sangat Mudah Digunakan</h2>
              <p className="text-[var(--text-muted)] mb-10 text-lg leading-relaxed">Dari membuka aplikasi hingga melihat nutrisi, prosesnya dirancang untuk menghemat waktu Anda.</p>
              
              <div className="space-y-8 relative">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[var(--border)] z-0"></div>
                {HOW_IT_WORKS.map((step, i) => (
                  <motion.div 
                    key={step.step}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-6 relative z-10"
                  >
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-[var(--primary-light)] flex items-center justify-center flex-shrink-0 text-[var(--primary-dark)] font-black text-lg shadow-sm">
                      {step.step}
                    </div>
                    <div className="pt-2">
                      <h4 className="text-xl font-bold text-[var(--text-main)] mb-2">{step.title}</h4>
                      <p className="text-[var(--text-muted)] leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / Footer ── */}
      <footer className="bg-white pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-[var(--primary)] rounded-[3rem] p-10 lg:p-20 text-center shadow-2xl shadow-[var(--primary-light)] relative overflow-hidden mb-20">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
             
             <div className="relative z-10">
               <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Siap Memulai Pola Makan Sehat?</h2>
               <p className="text-white/90 max-w-2xl mx-auto mb-10 text-xl font-medium">Bergabunglah dengan komunitas GiziSnap dan raih tubuh ideal Anda dengan bantuan AI.</p>
               <button 
                  onClick={onProceed}
                  className="px-10 py-5 rounded-2xl bg-white text-[var(--primary-dark)] font-black text-lg hover:bg-[var(--surface-hover)] hover:scale-105 transition-all shadow-xl inline-flex items-center gap-3"
               >
                 Buat Akun Gratis Sekarang
                 <ChevronRight size={24} />
               </button>
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[var(--border)] pt-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="text-2xl font-black text-[var(--text-main)] tracking-tight">Gizi<span className="text-[var(--primary)]">Snap</span></span>
            </div>
            <p className="text-[var(--text-muted)] text-sm font-medium">© 2026 GiziSnap. Dibuat dengan ❤️ di Indonesia.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
