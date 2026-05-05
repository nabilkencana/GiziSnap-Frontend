import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Login from './components/Login'
import Landing from './components/Landing'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import Scanner from './components/Scanner'
import WikiGizi from './components/WikiGizi'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'

const pageVariants = {
  enter:  (d) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit:   (d) => ({ x: d < 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
}
const pageTransition = { type: 'spring', stiffness: 380, damping: 36 }
const NAV_ORDER = ['dashboard', 'scanner', 'wiki']

const goalToPersona = {
  WEIGHT_LOSS:   'weightloss',
  DIABETES_CARE: 'diabetes',
  BODYBUILDING:  'bodybuilder',
}

const EMPTY_MACROS = { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }

import { supabase } from './lib/supabase';

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gizisnapUser') ?? 'null') }
    catch { return null }
  })
  const [persona, setPersona] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('gizisnapUser') ?? 'null')
      return u ? (goalToPersona[u.goal] ?? null) : null
    } catch { return null }
  })

  const [activeTab, setActiveTab] = useState('dashboard')
  const [prevTab, setPrevTab]     = useState('dashboard')
  const [unauthView, setUnauthView] = useState('landing') // 'landing' | 'login'
  // Macros shared with Sidebar — fetched by Dashboard, lifted here
  const [macros, setMacros]       = useState(EMPTY_MACROS)

  const direction = NAV_ORDER.indexOf(activeTab) - NAV_ORDER.indexOf(prevTab)

  const handleTabChange = (tab) => {
    if (tab === activeTab) return
    setPrevTab(activeTab)
    setActiveTab(tab)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setPersona(goalToPersona[userData.goal] ?? null)
  }

  const handleLogout = async () => {
    localStorage.removeItem('gizisnapUser')
    setUser(null)
    setPersona(null)
    setMacros(EMPTY_MACROS)
    // Logout dari supabase juga
    await supabase.auth.signOut()
  }

  // ── Fetch macros for sidebar (and Dashboard will also fetch its own) ─────────
  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/daily-logs/today/${user.id}`)
      .then(r => r.json())
      .then(d => { if (d.macros) setMacros(d.macros) })
      .catch(() => {})
  }, [user?.id, activeTab]) // refetch when switching tabs

  // Supabase Google Auth Listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Jika login lewat Supabase berhasil, sinkronkan ke backend kita
      if (event === 'SIGNED_IN' && session?.user) {
        // Hanya proses jika state user GiziSnap kita kosong (hindari infinite loop)
        if (!user) {
          try {
            const email = session.user.email;
            const name = session.user.user_metadata?.full_name || 'Pengguna Google';
            
            // Hit backend untuk sync
            const res = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, name })
            });
            const data = await res.json();
            if (res.ok) {
              localStorage.setItem('gizisnapUser', JSON.stringify(data));
              handleLogin(data);
            }
          } catch (e) {
            console.error('Gagal sinkronisasi backend GiziSnap:', e);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        handleLogout();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [user]);

  if (!user) {
    if (unauthView === 'landing') {
      return <Landing onProceed={() => setUnauthView('login')} />
    }
    return <Login onLogin={handleLogin} onBack={() => setUnauthView('landing')} />
  }

  const handleOnboardingSelect = async (personaId) => {
    // Determine backend goal equivalent
    let goal = 'WEIGHT_LOSS';
    if (personaId === 'weightloss') goal = 'WEIGHT_LOSS';
    else if (personaId === 'diabetes') goal = 'DIABETES_CARE';
    else if (personaId === 'bodybuilder') goal = 'BODYBUILDING';

    try {
      const res = await fetch(`/api/auth/${user.id}/goal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal })
      });
      if (res.ok) {
         const updatedUser = { ...user, goal };
         setUser(updatedUser);
         localStorage.setItem('gizisnapUser', JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.error("Gagal simpan goal:", e)
    }
    setPersona(personaId)
  }

  if (!persona) {
    return <div className="app-shell"><Onboarding onSelect={handleOnboardingSelect} /></div>
  }

  const userId = user.id

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return (
        <Dashboard
          persona={persona}
          onPersonaChange={handleOnboardingSelect}
          userId={userId}
          user={user}
          onLogout={handleLogout}
          onMacrosUpdate={setMacros}
        />
      )
      case 'scanner': return <Scanner userId={userId} />
      case 'wiki':    return <WikiGizi userId={userId} />
      default:        return <Dashboard persona={persona} onPersonaChange={handleOnboardingSelect} userId={userId} user={user} onLogout={handleLogout} onMacrosUpdate={setMacros} />
    }
  }

  return (
    <div className="app-shell">
      {/* Sidebar — tersembunyi di mobile, tampil di desktop */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        macros={macros}
        persona={persona}
        onLogout={handleLogout}
      />

      {/* Konten utama */}
      <div className="scroll-area flex-1 flex flex-col">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="flex-1 flex flex-col"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav — hanya di mobile */}
      <div className="mobile-only">
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  )
}
