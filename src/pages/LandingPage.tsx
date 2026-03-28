import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LandingPageProps {
  onSelectRole: (role: 'passenger' | 'driver' | 'admin') => void;
  currentLanguage: string;
  onLanguageChange: (lng: string) => void;
}

export default function LandingPage({ onSelectRole, currentLanguage, onLanguageChange }: LandingPageProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map', { 
        zoomControl: false, 
        attributionControl: false 
      }).setView([31.9539, 35.9106], 14);

      // Light style for passenger
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
        attribution: '' 
      }).addTo(mapRef.current);

      // Add user marker
      L.marker([31.9539, 35.9106], { title: 'موقعك' }).addTo(mapRef.current);
      L.circleMarker([31.9539, 35.9106], { 
        radius: 12, 
        color: '#f5c518', 
        fillColor: '#f5c518', 
        fillOpacity: 0.2, 
        weight: 2 
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden font-cairo" dir="rtl">
      {/* Map Background */}
      <div id="map" className="absolute inset-0 z-0" style={{ filter: 'brightness(0.85) saturate(0.9)' }}></div>

      {/* Login Screen */}
      <div id="loginScreen" className="relative z-10">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8 overflow-hidden"
             style={{ paddingTop: 'calc(32px + env(safe-area-inset-top, 0px))' }}>
          
          {/* Background Glow */}
          <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(245, 197, 24, 0.25) 0%, transparent 70%)' }}></div>

          {/* Logo */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
               style={{ 
                 background: '#f5c518', 
                 color: '#000',
                 boxShadow: '0 0 40px rgba(245, 197, 24, 0.25), 0 0 80px rgba(245,197,24,0.15)',
                 animation: 'logoPulse 2.5s ease-in-out infinite'
               }}>
            <i className="fas fa-taxi"></i>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black mb-1" style={{ letterSpacing: '-0.5px' }}>يلو وانت</h1>
          <p className="text-sm mb-10" style={{ color: '#6b6b80' }}>منصة النقل الذكية · عمّان</p>

          {/* Login Buttons */}
          <div className="w-full max-w-[360px] flex flex-col gap-3">
            <button 
              className="w-full rounded-2xl py-4 px-5 text-base font-bold flex items-center gap-3 transition-transform active:scale-[0.97] active:opacity-90"
              style={{ background: '#f5c518', color: '#000' }}
              onClick={() => onSelectRole('passenger')}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                   style={{ background: 'rgba(0,0,0,0.15)' }}>
                <i className="fas fa-user"></i>
              </div>
              <span>دخول كراكب</span>
            </button>

            <button 
              className="w-full rounded-2xl py-4 px-5 text-base font-bold flex items-center gap-3 transition-transform active:scale-[0.97] active:opacity-90"
              style={{ background: '#111118', color: '#f0f0f5', border: '1px solid rgba(255,255,255,0.07)' }}
              onClick={() => onSelectRole('driver')}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                   style={{ background: 'rgba(245,197,24,0.12)', color: '#f5c518' }}>
                <i className="fas fa-id-card"></i>
              </div>
              <span>دخول كسائق</span>
            </button>

            <button 
              className="w-full rounded-2xl py-3 px-5 text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.97]"
              style={{ background: 'transparent', color: '#6b6b80' }}
              onClick={() => onSelectRole('admin')}
            >
              <i className="fas fa-lock text-xs"></i>
              <span>لوحة الإدارة</span>
            </button>
          </div>

          {/* Language Toggle */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button 
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{ 
                background: currentLanguage === 'ar' ? '#f5c518' : 'transparent',
                color: currentLanguage === 'ar' ? '#000' : '#6b6b80'
              }}
              onClick={() => onLanguageChange('ar')}
            >
              عربي
            </button>
            <button 
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{ 
                background: currentLanguage === 'en' ? '#f5c518' : 'transparent',
                color: currentLanguage === 'en' ? '#000' : '#6b6b80'
              }}
              onClick={() => onLanguageChange('en')}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
