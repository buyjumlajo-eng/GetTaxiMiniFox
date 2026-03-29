import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface PassengerAppProps {
  onBack: () => void
}

// Default Amman center
const AMMAN_CENTER: [number, number] = [31.9539, 35.9106]

export default function PassengerApp({ onBack }: PassengerAppProps) {
  const { i18n } = useTranslation()
  const mapRef = useRef<L.Map | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [activeSheet, setActiveSheet] = useState<string | null>(null)
  const isRTL = i18n.language === 'ar'

  const quickDestinations = [
    { name: isRTL ? 'المنزل' : 'Home', icon: '🏠', color: 'rgba(245,197,24,0.12)' },
    { name: isRTL ? 'العمل' : 'Work', icon: '💼', color: 'rgba(245,197,24,0.1)' },
    { name: isRTL ? 'مول عبدالله' : 'Abdullah Mall', icon: '🛍️', color: 'rgba(29,205,159,0.1)' },
    { name: isRTL ? 'المطار' : 'Airport', icon: '✈️', color: 'rgba(100,130,255,0.1)' }
  ]

  const tripHistory = [
    { from: isRTL ? 'مول عبدالله' : 'Abdullah Mall', to: isRTL ? 'شارع الرشيد' : 'Rashid Street', time: isRTL ? 'اليوم، 10:30 ص' : 'Today, 10:30 AM' },
    { from: isRTL ? 'المطار' : 'Airport', to: isRTL ? 'الجبيهة' : 'Jubaiha', time: isRTL ? 'أمس، 3:15 م' : 'Yesterday, 3:15 PM' },
    { from: isRTL ? 'الدوار السابع' : '7th Circle', to: isRTL ? 'المدينة الرياضية' : 'Sports City', time: isRTL ? '26 مارس، 7:00 م' : 'Mar 26, 7:00 PM' }
  ]

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('passengerMap', { 
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

  const openSheet = (id: string) => {
    setActiveSheet(id)
  }

  const closeSheet = (id: string) => {
    setActiveSheet(id)
    setTimeout(() => setActiveSheet(null), 380)
  }

  const setDestination = (name: string) => {
    showToast(`${isRTL ? 'تم تحديد' : 'Selected'}: ${name}`)
    openSheet('tripSheet')
  }

  const simulateRideFound = () => {
    closeSheet('tripSheet')
    setTimeout(() => {
      openSheet('rideStatusSheet')
    }, 400)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden font-cairo" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Map Background - Fixed unique ID */}
      <div id="passengerMap" className="absolute inset-0 z-0" style={{ filter: 'brightness(0.85) saturate(0.9)' }}></div>

      {/* Passenger UI */}
      <div id="passengerUI">
        {/* Top Bar */}
        <div className="top-bar">
          <div 
            className="search-bar"
            onClick={() => openSheet('tripSheet')}
          >
            <i className="fas fa-search" style={{ color: '#6b6b80', fontSize: '14px' }}></i>
            <input type="text" placeholder={isRTL ? 'إلى أين تتجه اليوم؟' : 'Where to today?'} readOnly />
            <span className="chip chip-yellow" style={{ fontSize: '11px', padding: '4px 10px' }}>{isRTL ? 'طلب' : 'Order'}</span>
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
            <span>{isRTL ? 'رحلة' : 'Trip'}</span>
          </button>
          <button 
            className="dock-item"
            onClick={() => openSheet('historySheet')}
          >
            <i className="fas fa-clock-rotate-left"></i>
            <span>{isRTL ? 'سجل' : 'History'}</span>
          </button>
          <button 
            className="dock-cta"
            onClick={() => openSheet('tripSheet')}
          >
            <i className="fas fa-taxi"></i>
          </button>
          <button className="dock-item">
            <i className="fas fa-wallet"></i>
            <span>{isRTL ? 'محفظة' : 'Wallet'}</span>
          </button>
          <button className="dock-item" onClick={onBack}>
            <i className="fas fa-power-off"></i>
            <span>{isRTL ? 'خروج' : 'Exit'}</span>
          </button>
        </nav>

        {/* Ad slot above dock - Prominent placement for monetization */}
        <div 
          className="ad-slot" 
          style={{ 
            position: 'fixed', 
            bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))', 
            left: '16px', 
            right: '16px', 
            height: '60px', 
            zIndex: 29, 
            borderRadius: '12px'
          }}
        >
          <span>مساحة إعلانية - للإعلانات</span>
          <span style={{ fontSize: '10px', opacity: 0.7 }}>مساحتك هنا</span>
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
            <h2 style={{ fontSize: '18px', fontWeight: 900 }}>{isRTL ? 'احجز رحلتك' : 'Book Your Trip'}</h2>
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
              <input type="text" value={isRTL ? 'موقعي الحالي - عمّان' : 'My location - Amman'} readOnly style={{ color: '#6b6b80' }} />
              <i className="fas fa-location-crosshairs" style={{ color: '#f5c518', fontSize: '14px' }}></i>
            </div>
            <div className="route-input active-input">
              <i className="fas fa-square" style={{ color: '#ff4757', fontSize: '10px', flexShrink: 0 }}></i>
              <input type="text" placeholder={isRTL ? 'الوجهة...' : 'Destination...'} />
              <i className="fas fa-search" style={{ color: '#6b6b80', fontSize: '13px' }}></i>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 20px' }}>
          {/* Yellow Taxi Option - Only Option */}
          <div style={{ 
            display: 'flex', gap: '10px', alignItems: 'center', 
            background: 'rgba(245,197,24,0.15)', border: '2px solid #f5c518',
            borderRadius: '14px', padding: '14px 16px', marginBottom: '12px' 
          }}>
            <div style={{ fontSize: '32px' }}>🚖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff' }}>{isRTL ? 'تاكسي أصفر' : 'Yellow Taxi'}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                {isRTL ? 'تاكسي مرخص • الدفع بالعداد' : 'Licensed taxi • Pay by meter'}
              </div>
            </div>
            <i className="fas fa-check-circle" style={{ color: '#1dcd9f', fontSize: '20px' }}></i>
          </div>

          {/* Payment Info */}
          <div style={{ 
            display: 'flex', gap: '10px', alignItems: 'center', 
            background: 'rgba(29,205,159,0.1)', border: '1px solid rgba(29,205,159,0.2)',
            borderRadius: '14px', padding: '12px 14px', margin: '12px 0' 
          }}>
            <i className="fas fa-info-circle" style={{ color: '#1dcd9f', fontSize: '16px' }}></i>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                {isRTL ? 'الدفع حسب العداد' : 'Pay by Meter'}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                {isRTL ? 'لا توجد رسوم إضافية • الدفع نقداً للسائق' : 'No extra fees • Pay cash to driver'}
              </div>
            </div>
          </div>

          <button 
            onClick={simulateRideFound}
            style={{
              width: '100%', background: '#f5c518', border: 'none', borderRadius: '14px',
              padding: '15px', fontFamily: 'Cairo', fontSize: '15px', fontWeight: 900, color: '#000', cursor: 'pointer'
            }}
          >
            <i className="fas fa-magnifying-glass" style={{ marginLeft: '8px' }}></i>
            {isRTL ? 'ابحث عن سائق' : 'Search for Driver'}
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
              <h3 style={{ fontSize: '16px', fontWeight: 900 }}>{isRTL ? 'السائق في الطريق إليك' : 'Driver is on the way'}</h3>
              <p style={{ fontSize: '12px', color: '#6b6b80', marginTop: '2px' }}>Hyundai Sonata · {isRTL ? 'أبيض' : 'White'} · 12-345 أ</p>
            </div>
            <div className="eta-pill">
              <div className="eta-num">4</div>
              <div className="eta-label">{isRTL ? 'دقائق' : 'min'}</div>
            </div>
          </div>
          <div className="driver-row" style={{ marginBottom: '14px' }}>
            <div className="driver-avatar">{isRTL ? 'أ' : 'A'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 900 }}>{isRTL ? 'أحمد الخطيب' : 'Ahmed Al-Khatib'}</div>
              <div style={{ fontSize: '11px', color: '#6b6b80', marginTop: '2px' }}>
                <i className="fas fa-star" style={{ color: '#f5c518' }}></i> 4.9 · 1,240 {isRTL ? 'رحلة' : 'trips'}
              </div>
            </div>
          </div>
          <div style={{ 
            marginBottom: '14px', 
            padding: '10px 12px', 
            background: 'rgba(245,197,24,0.1)', 
            borderRadius: '10px',
            border: '1px solid rgba(245,197,24,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-money-bill-wave" style={{ color: '#f5c518', fontSize: '14px' }}></i>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>
                {isRTL ? 'الدفع: حسب العداد • لا رسوم إضافية' : 'Payment: By meter • No extra fees'}
              </span>
            </div>
          </div>
          <div className="action-row" style={{ marginBottom: '14px' }}>
            <button className="action-btn green">
              <i className="fas fa-phone"></i> {isRTL ? 'اتصال' : 'Call'}
            </button>
            <button className="action-btn yellow">
              <i className="fas fa-message"></i> {isRTL ? 'رسالة' : 'Message'}
            </button>
            <button className="action-btn" onClick={() => closeSheet('rideStatusSheet')}>
              <i className="fas fa-xmark"></i> {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
          
          {/* Ad slot in ride status */}
          <div className="ad-slot" style={{ height: '50px' }}>
            <span>مساحة إعلانية</span>
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
            <h2 style={{ fontSize: '17px', fontWeight: 900 }}>{isRTL ? 'رحلاتي' : 'My Trips'}</h2>
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
              <div style={{ 
                padding: '4px 8px', 
                background: 'rgba(29,205,159,0.1)', 
                borderRadius: '6px',
                fontSize: '10px',
                color: '#1dcd9f'
              }}>
                {isRTL ? 'تم الدفع' : 'Paid'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
