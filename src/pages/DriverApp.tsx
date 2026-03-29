import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface DriverAppProps {
  onBack: () => void
}

// Default Amman center
const AMMAN_CENTER: [number, number] = [31.9539, 35.9106]

export default function DriverApp({ onBack }: DriverAppProps) {
  const { i18n } = useTranslation()
  const mapRef = useRef<L.Map | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [showRequest, setShowRequest] = useState(false)
  const [timer, setTimer] = useState(20)
  const [flash, setFlash] = useState(false)
  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    // Initialize map with light style for driver (consistent with passenger)
    if (!mapRef.current) {
      mapRef.current = L.map('driverMap', { 
        zoomControl: false, 
        attributionControl: false 
      }).setView(AMMAN_CENTER, 14)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
        attribution: '' 
      }).addTo(mapRef.current)

      L.marker(AMMAN_CENTER, { title: isRTL ? 'موقعك' : 'Your location' }).addTo(mapRef.current)
      L.circleMarker(AMMAN_CENTER, { 
        radius: 12, 
        color: '#f5c518', 
        fillColor: '#f5c518', 
        fillOpacity: 0.2, 
        weight: 2 
      }).addTo(mapRef.current)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [isRTL])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const playSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      ;[523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.connect(g)
        g.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = freq
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
        g.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.12 + 0.05)
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3)
        osc.start(ctx.currentTime + i * 0.12)
        osc.stop(ctx.currentTime + i * 0.12 + 0.3)
      })
    } catch(e) {}
  }

  const setDriverStatus = (status: 'online' | 'offline') => {
    setIsOnline(status === 'online')
    
    if (status === 'online') {
      showToast(isRTL ? 'أنت الآن متصل - جاري البحث عن طلبات...' : 'You are now online - Searching for requests...')
      setTimeout(() => {
        playSound()
        setFlash(true)
        setTimeout(() => setFlash(false), 1500)
        setShowRequest(true)
        setTimer(20)
      }, 3000)
    } else {
      showToast(isRTL ? 'تم الفصل - أنت غير متصل' : 'Disconnected - You are offline')
      setShowRequest(false)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (showRequest && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setShowRequest(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [showRequest, timer])

  const acceptRequest = () => {
    setShowRequest(false)
    showToast(isRTL ? 'تم قبول الطلب! التنقل بدأ...' : 'Request accepted! Navigation started...')
  }

  const rejectRequest = () => {
    setShowRequest(false)
    showToast(isRTL ? 'تم رفض الطلب' : 'Request rejected')
  }

  const circumference = 138

  return (
    <div className={`relative w-full h-screen overflow-hidden font-cairo ${flash ? 'flash' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Map Background - Fixed ID to avoid conflicts */}
      <div id="driverMap" className="absolute inset-0 z-0" style={{ filter: 'brightness(0.85) saturate(0.9)' }}></div>

      {/* Driver UI */}
      <div id="driverUI">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="status-badge">
            <div className={`status-dot ${isOnline ? 'online' : ''}`}></div>
            <span>{isOnline ? (isRTL ? 'متصل — جاري البحث...' : 'Online — Searching...') : (isRTL ? 'غير متصل' : 'Offline')}</span>
          </div>
          <button className="icon-btn" onClick={onBack}>
            <i className="fas fa-power-off"></i>
          </button>
        </div>

        {/* Stats row */}
        {isOnline && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-val">12</div>
              <div className="stat-lbl">{isRTL ? 'رحلات اليوم' : 'Trips Today'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">4.9 ⭐</div>
              <div className="stat-lbl">{isRTL ? 'تقييمك' : 'Your Rating'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">98%</div>
              <div className="stat-lbl">{isRTL ? 'قبول الطلبات' : 'Accept Rate'}</div>
            </div>
          </div>
        )}

        {/* Driver bottom panel */}
        <div className="driver-control">
          {/* Ad slot for passenger promotions */}
          <div className="ad-slot" style={{ height: '60px', marginBottom: '10px', borderRadius: '12px' }}>
            <span>مساحة إعلانية - للإعلانات</span>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>مساحتك هنا</span>
          </div>
          <div className="driver-panel">
            <div className="driver-info-row">
              <div>
                <div style={{ fontSize: '16px', fontWeight: 900 }}>{isRTL ? 'مرحباً، خالد 👋' : 'Welcome, Khaled 👋'}</div>
                <div style={{ fontSize: '11px', color: '#6b6b80', marginTop: '2px' }}>Kia Cerato · 12-345 أ</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#6b6b80' }}>{isRTL ? 'الحالة' : 'Status'}</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: isOnline ? '#1dcd9f' : '#6b6b80' }}>
                  {isOnline ? (isRTL ? 'متصل' : 'Online') : (isRTL ? 'غير متصل' : 'Offline')}
                </div>
              </div>
            </div>
            <div className="toggle-wrap">
              <button 
                className={`toggle-opt ${!isOnline ? 'active-offline' : ''}`}
                onClick={() => setDriverStatus('offline')}
              >
                <i className="fas fa-ban" style={{ marginLeft: '5px', fontSize: '11px' }}></i> {isRTL ? 'غير متصل' : 'Offline'}
              </button>
              <button 
                className={`toggle-opt ${isOnline ? 'active-online' : ''}`}
                onClick={() => setDriverStatus('online')}
              >
                <i className="fas fa-circle-play" style={{ marginLeft: '5px', fontSize: '11px' }}></i> {isRTL ? 'متصل' : 'Online'}
              </button>
            </div>
            <div style={{ 
              marginTop: '12px', 
              padding: '10px 12px', 
              background: 'rgba(29,205,159,0.1)', 
              borderRadius: '10px',
              border: '1px solid rgba(29,205,159,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-info-circle" style={{ color: '#1dcd9f', fontSize: '14px' }}></i>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                  {isRTL ? 'الدفع: حسب العداد • بدون عمولات أو رسوم' : 'Payment: By meter • No commissions or fees'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Request Modal */}
      <div id="requestModal" className={showRequest ? 'show' : ''}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900 }}>{isRTL ? 'طلب جديد!' : 'New Request!'}</h2>
            <div style={{ fontSize: '12px', color: '#6b6b80', marginTop: '2px' }}>~3.2 {isRTL ? 'كم من موقعك' : 'km from your location'}</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ 
              padding: '6px 12px', 
              background: 'rgba(29,205,159,0.15)', 
              borderRadius: '8px',
              border: '1px solid rgba(29,205,159,0.3)'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#1dcd9f' }}>
                {isRTL ? 'حسب العداد' : 'By Meter'}
              </div>
            </div>
            <div style={{ fontSize: '10px', color: '#6b6b80', marginTop: '4px' }}>
              {isRTL ? 'نقدي · ~12 دقيقة' : 'Cash · ~12 min'}
            </div>
          </div>
        </div>

        {/* countdown timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div className="timer-ring">
            <svg viewBox="0 0 50 50" width="56" height="56">
              <circle className="bg-ring" cx="25" cy="25" r="22"/>
              <circle 
                className="prog-ring" 
                cx="25" 
                cy="25" 
                r="22"
                style={{ strokeDashoffset: circumference * (1 - timer / 20) }}
              />
            </svg>
            <div className="timer-val">{timer}</div>
          </div>
          <div style={{ flex: 1, fontSize: '12px', color: '#6b6b80' }}>
            {isRTL ? 'يُلغى الطلب تلقائياً إذا لم يُقبل' : 'Request auto-cancels if not accepted'}<br/>
            <span style={{ color: '#ff4757', fontWeight: 700 }}>{isRTL ? 'خلال' : 'In'} {timer} {isRTL ? 'ثانية' : 'seconds'}</span>
          </div>
        </div>

        <div className="route-block">
          <div className="route-stop">
            <div className="route-dot" style={{ background: '#1dcd9f' }}></div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b6b80' }}>{isRTL ? 'الانطلاق' : 'Pickup'}</div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>{isRTL ? 'شارع الرشيد، وسط البلد' : 'Rashid St., Downtown'}</div>
            </div>
          </div>
          <div className="route-stop">
            <div className="route-dot" style={{ background: '#ff4757' }}></div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b6b80' }}>{isRTL ? 'الوصول' : 'Drop-off'}</div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>{isRTL ? 'مول عبدالله، طبربور' : 'Abdullah Mall, Tabeer'}</div>
            </div>
          </div>
          <div className="route-meta">
            <span>{isRTL ? 'المسافة' : 'Distance'}: <b>3.2 km</b></span>
            <span>{isRTL ? 'الدفع' : 'Payment'}: <b>{isRTL ? 'نقدي (عداد)' : 'Cash (meter)'}</b></span>
            <span>{isRTL ? 'المدة' : 'Duration'}: <b>~12 min</b></span>
          </div>
        </div>

        <div className="modal-btns">
          <button className="btn-reject" onClick={rejectRequest}>
            <i className="fas fa-xmark" style={{ marginLeft: '6px' }}></i> {isRTL ? 'رفض' : 'Reject'}
          </button>
          <button className="btn-accept" onClick={acceptRequest}>
            <i className="fas fa-check" style={{ marginLeft: '6px' }}></i> {isRTL ? 'قبول الطلب' : 'Accept'}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
