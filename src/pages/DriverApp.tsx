import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface DriverAppProps {
  onBack: () => void
}

// Default Amman center
const AMMAN_CENTER: [number, number] = [31.95, 35.91]

export default function DriverApp({ onBack }: DriverAppProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [showRequest, setShowRequest] = useState(false)
  const [timer, setTimer] = useState(20)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    // Initialize map with dark style for driver
    if (!mapRef.current) {
      mapRef.current = L.map('map', { 
        zoomControl: false, 
        attributionControl: false 
      }).setView(AMMAN_CENTER, 14)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
        attribution: '' 
      }).addTo(mapRef.current)

      L.marker(AMMAN_CENTER, { title: 'موقعك' }).addTo(mapRef.current)
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
  }, [])

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
      showToast('أنت الآن متصل - جاري البحث عن طلبات...')
      setTimeout(() => {
        playSound()
        setFlash(true)
        setTimeout(() => setFlash(false), 1500)
        setShowRequest(true)
        setTimer(20)
      }, 3000)
    } else {
      showToast('تم الفصل - أنت غير متصل')
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
    showToast('تم قبول الطلب! التنقل بدأ...')
  }

  const rejectRequest = () => {
    setShowRequest(false)
    showToast('تم رفض الطلب')
  }

  const circumference = 138

  return (
    <div className={`relative w-full h-screen overflow-hidden font-cairo ${flash ? 'flash' : ''}`} dir="rtl">
      {/* Map Background */}
      <div id="map" className="absolute inset-0 z-0" style={{ filter: 'brightness(0.85) saturate(0.9)' }}></div>

      {/* Driver UI */}
      <div id="driverUI">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="status-badge">
            <div className={`status-dot ${isOnline ? 'online' : ''}`}></div>
            <span>{isOnline ? 'متصل — جاري البحث...' : 'غير متصل'}</span>
          </div>
          <button className="icon-btn" onClick={onBack}>
            <i className="fas fa-power-off"></i>
          </button>
        </div>

        {/* Stats row */}
        {isOnline && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-val">45 JD</div>
              <div className="stat-lbl">أرباح اليوم</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">7</div>
              <div className="stat-lbl">رحلات</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">4.9 ⭐</div>
              <div className="stat-lbl">تقييمك</div>
            </div>
          </div>
        )}

        {/* Driver bottom panel */}
        <div className="driver-control">
          {/* ad slot */}
          <div className="ad-slot" style={{ height: '40px', marginBottom: '10px', borderRadius: '12px' }}>
            <span>إعلان للسائقين</span>
          </div>
          <div className="driver-panel">
            <div className="driver-info-row">
              <div>
                <div style={{ fontSize: '16px', fontWeight: 900 }}>مرحباً، خالد 👋</div>
                <div style={{ fontSize: '11px', color: '#6b6b80', marginTop: '2px' }}>كيا سيراتو · 12345 أ</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#6b6b80' }}>الأرباح</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#1dcd9f' }}>45.00 JD</div>
              </div>
            </div>
            <div className="toggle-wrap">
              <button 
                className={`toggle-opt ${!isOnline ? 'active-offline' : ''}`}
                onClick={() => setDriverStatus('offline')}
              >
                <i className="fas fa-ban" style={{ marginLeft: '5px', fontSize: '11px' }}></i> غير متصل
              </button>
              <button 
                className={`toggle-opt ${isOnline ? 'active-online' : ''}`}
                onClick={() => setDriverStatus('online')}
              >
                <i className="fas fa-circle-play" style={{ marginLeft: '5px', fontSize: '11px' }}></i> متصل
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Request Modal */}
      <div id="requestModal" className={showRequest ? 'show' : ''}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900 }}>طلب جديد!</h2>
            <div style={{ fontSize: '12px', color: '#6b6b80', marginTop: '2px' }}>~3.2 كم من موقعك</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div className="price-tag">5.50 JD</div>
            <div className="price-sub">نقدي · ~12 دقيقة</div>
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
            يُلغى الطلب تلقائياً إذا لم يُقبل<br/>
            <span style={{ color: '#ff4757', fontWeight: 700 }}>في غضون {timer} ثانية</span>
          </div>
        </div>

        <div className="route-block">
          <div className="route-stop">
            <div className="route-dot" style={{ background: '#1dcd9f' }}></div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b6b80' }}>الانطلاق</div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>شارع الرشيد، وسط البلد</div>
            </div>
          </div>
          <div className="route-stop">
            <div className="route-dot" style={{ background: '#ff4757' }}></div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b6b80' }}>الوصول</div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>مول عبدالله، طبربور</div>
            </div>
          </div>
          <div className="route-meta">
            <span>المسافة: <b>3.2 كم</b></span>
            <span>الدفع: <b>نقدي</b></span>
            <span>المدة: <b>~12 دقيقة</b></span>
          </div>
        </div>

        <div className="modal-btns">
          <button className="btn-reject" onClick={rejectRequest}>
            <i className="fas fa-xmark" style={{ marginLeft: '6px' }}></i> رفض
          </button>
          <button className="btn-accept" onClick={acceptRequest}>
            <i className="fas fa-check" style={{ marginLeft: '6px' }}></i> قبول الطلب
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
