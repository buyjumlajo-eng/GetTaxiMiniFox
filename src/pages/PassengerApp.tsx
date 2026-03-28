import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface PassengerAppProps {
  onBack: () => void
}

// Default Amman center
const AMMAN_CENTER: [number, number] = [31.9539, 35.9106]

export default function PassengerApp({ onBack }: PassengerAppProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [activeSheet, setActiveSheet] = useState<string | null>(null)
  const [selectedFare, setSelectedFare] = useState<number>(0)

  const fares = [
    { icon: '🚖', name: 'تاكسي', price: '3.50 JD' },
    { icon: '🚗', name: 'كومفورت', price: '5.00 JD' },
    { icon: '🚙', name: 'SUV', price: '7.00 JD' }
  ]

  const quickDestinations = [
    { name: 'المنزل', icon: '🏠', color: 'rgba(245,197,24,0.12)' },
    { name: 'العمل', icon: '💼', color: 'rgba(245,197,24,0.1)' },
    { name: 'مول عبدالله', icon: '🛍️', color: 'rgba(29,205,159,0.1)' },
    { name: 'المطار', icon: '✈️', color: 'rgba(100,130,255,0.1)' }
  ]

  const tripHistory = [
    { from: 'مول عبدالله', to: 'شارع الرشيد', time: 'اليوم، 10:30 ص', price: '4.20 JD' },
    { from: 'المطار', to: 'الجبيهة', time: 'أمس، 3:15 م', price: '9.50 JD' },
    { from: 'الدوار السابع', to: 'المدينة الرياضية', time: '26 مارس، 7:00 م', price: '3.80 JD' }
  ]

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map', { 
        zoomControl: false, 
        attributionControl: false 
      }).setView(AMMAN_CENTER, 14)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
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

  const openSheet = (id: string) => {
    setActiveSheet(id)
  }

  const closeSheet = (id: string) => {
    setActiveSheet(id)
    setTimeout(() => setActiveSheet(null), 380)
  }

  const setDestination = (name: string) => {
    showToast(`تم تحديد: ${name}`)
    openSheet('tripSheet')
  }

  const simulateRideFound = () => {
    closeSheet('tripSheet')
    setTimeout(() => {
      openSheet('rideStatusSheet')
    }, 400)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden font-cairo" dir="rtl">
      {/* Map Background */}
      <div id="map" className="absolute inset-0 z-0" style={{ filter: 'brightness(0.85) saturate(0.9)' }}></div>

      {/* Passenger UI */}
      <div id="passengerUI">
        {/* Top Bar */}
        <div className="top-bar">
          <div 
            className="search-bar"
            onClick={() => openSheet('tripSheet')}
          >
            <i className="fas fa-search" style={{ color: '#6b6b80', fontSize: '14px' }}></i>
            <input type="text" placeholder="إلى أين تتجه اليوم؟" readOnly />
            <span className="chip chip-yellow" style={{ fontSize: '11px', padding: '4px 10px' }}>طلب</span>
          </div>
          <button 
            className="icon-btn"
            onClick={() => openSheet('historySheet')}
          >
            <i className="fas fa-history"></i>
            <div className="notif-dot"></div>
          </button>
        </div>

        {/* Quick destinations */}
        <div className="quick-scroll">
          {quickDestinations.map((dest, idx) => (
            <div 
              key={idx}
              className="quick-card"
              onClick={() => setDestination(dest.name)}
            >
              <div className="qicon" style={{ background: dest.color }}>
                {dest.icon}
              </div>
              <span>{dest.name}</span>
            </div>
          ))}
        </div>

        {/* Bottom dock */}
        <nav className="pax-dock">
          <button 
            className={`dock-item ${activeSheet === 'tripSheet' ? 'active' : ''}`}
            onClick={() => openSheet('tripSheet')}
          >
            <i className="fas fa-car"></i>
            <span>رحلة</span>
          </button>
          <button 
            className="dock-item"
            onClick={() => openSheet('historySheet')}
          >
            <i className="fas fa-clock-rotate-left"></i>
            <span>سجل</span>
          </button>
          <button 
            className="dock-cta"
            onClick={() => openSheet('tripSheet')}
          >
            <i className="fas fa-taxi"></i>
          </button>
          <button className="dock-item">
            <i className="fas fa-wallet"></i>
            <span>محفظة</span>
          </button>
          <button className="dock-item" onClick={onBack}>
            <i className="fas fa-power-off"></i>
            <span>خروج</span>
          </button>
        </nav>

        {/* Ad slot above dock */}
        <div 
          className="ad-slot" 
          style={{ 
            position: 'fixed', 
            bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))', 
            left: '16px', 
            right: '16px', 
            height: '44px', 
            zIndex: 29, 
            borderRadius: '12px' 
          }}
        >
          <span>مساحة إعلانية</span>
        </div>
      </div>

      {/* Trip Sheet */}
      <div 
        id="tripSheet" 
        className={`sheet ${activeSheet === 'tripSheet' ? 'sheet-up' : 'sheet-down'}`}
        style={{ maxHeight: '72vh' }}
      >
        <div className="sheet-handle"></div>
        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 900 }}>احجز رحلتك</h2>
            <button 
              className="icon-btn" 
              style={{ width: '34px', height: '34px', borderRadius: '10px' }}
              onClick={() => closeSheet('tripSheet')}
            >
              <i className="fas fa-times" style={{ fontSize: '12px' }}></i>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="route-input">
              <i className="fas fa-circle" style={{ color: '#1dcd9f', fontSize: '10px', flexShrink: 0 }}></i>
              <input type="text" value="موقعي الحالي - عمّان" readOnly style={{ color: '#6b6b80' }} />
              <i className="fas fa-location-crosshairs" style={{ color: '#f5c518', fontSize: '14px' }}></i>
            </div>
            <div className="route-input active-input">
              <i className="fas fa-square" style={{ color: '#ff4757', fontSize: '10px', flexShrink: 0 }}></i>
              <input type="text" placeholder="الوجهة..." />
              <i className="fas fa-search" style={{ color: '#6b6b80', fontSize: '13px' }}></i>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 20px' }}>
          <div style={{ fontSize: '12px', color: '#6b6b80', fontWeight: 700, marginBottom: '10px' }}>اختر نوع الرحلة</div>
          <div className="fare-row">
            {fares.map((fare, idx) => (
              <div 
                key={idx}
                className={`fare-card ${selectedFare === idx ? 'selected' : ''}`}
                onClick={() => setSelectedFare(idx)}
              >
                <div className="fare-icon">{fare.icon}</div>
                <div className="fare-name">{fare.name}</div>
                <div className="fare-price">{fare.price}</div>
              </div>
            ))}
          </div>
          <div style={{ 
            display: 'flex', gap: '10px', alignItems: 'center', 
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px', padding: '10px 14px', margin: '12px 0' 
          }}>
            <i className="fas fa-money-bill-wave" style={{ color: '#f5c518' }}></i>
            <span style={{ fontSize: '13px', fontWeight: 700, flex: 1 }}>الدفع نقداً</span>
            <span style={{ fontSize: '11px', color: '#6b6b80' }}>
              تغيير <i className="fas fa-chevron-left" style={{ fontSize: '10px' }}></i>
            </span>
          </div>
          <button 
            onClick={simulateRideFound}
            style={{
              width: '100%', background: '#f5c518', border: 'none', borderRadius: '14px',
              padding: '15px', fontFamily: 'Cairo', fontSize: '15px', fontWeight: 900, color: '#000', cursor: 'pointer'
            }}
          >
            <i className="fas fa-magnifying-glass" style={{ marginLeft: '8px' }}></i>
            ابحث عن سائق
          </button>
        </div>
      </div>

      {/* Ride Status Sheet */}
      <div 
        id="rideStatusSheet" 
        className={`sheet ${activeSheet === 'rideStatusSheet' ? 'sheet-up' : 'sheet-down'}`}
        style={{ height: 'auto' }}
      >
        <div className="sheet-handle"></div>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 900 }}>السائق في الطريق إليك</h3>
              <p style={{ fontSize: '12px', color: '#6b6b80', marginTop: '2px' }}>Hyundai Sonata · أبيض · أ ب ج ١٢٣٤</p>
            </div>
            <div className="eta-pill">
              <div className="eta-num">4</div>
              <div className="eta-label">دقائق</div>
            </div>
          </div>
          <div className="driver-row" style={{ marginBottom: '14px' }}>
            <div className="driver-avatar">أ</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 900 }}>أحمد الخطيب</div>
              <div style={{ fontSize: '11px', color: '#6b6b80', marginTop: '2px' }}>
                <i className="fas fa-star" style={{ color: '#f5c518' }}></i> 4.9 · 1,240 رحلة
              </div>
            </div>
          </div>
          <div className="action-row" style={{ marginBottom: '14px' }}>
            <button className="action-btn green">
              <i className="fas fa-phone"></i> اتصال
            </button>
            <button className="action-btn yellow">
              <i className="fas fa-message"></i> رسالة
            </button>
            <button className="action-btn" onClick={() => closeSheet('rideStatusSheet')}>
              <i className="fas fa-xmark"></i> إلغاء
            </button>
          </div>
          <div className="ad-slot" style={{ height: '36px' }}>
            <span>إعلان راكب</span>
          </div>
        </div>
      </div>

      {/* History Sheet */}
      <div 
        id="historySheet" 
        className={`sheet ${activeSheet === 'historySheet' ? 'sheet-up' : 'sheet-down'}`}
        style={{ maxHeight: '70vh' }}
      >
        <div className="sheet-handle"></div>
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 900 }}>رحلاتي</h2>
            <button 
              className="icon-btn" 
              style={{ width: '32px', height: '32px', borderRadius: '10px', fontSize: '12px' }}
              onClick={() => closeSheet('historySheet')}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div style={{ padding: '0 20px 16px', overflowY: 'auto', maxHeight: '55vh' }} className="no-scroll">
          {tripHistory.map((trip, idx) => (
            <div key={idx} className="trip-row">
              <div className="trip-icon"><i className="fas fa-location-dot"></i></div>
              <div className="trip-info">
                <h4>{trip.from} ← {trip.to}</h4>
                <p>{trip.time}</p>
              </div>
              <div className="trip-price">{trip.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
