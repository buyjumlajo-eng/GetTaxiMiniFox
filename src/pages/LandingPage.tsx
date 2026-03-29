import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LandingPageProps {
  onSelectRole: (role: 'passenger' | 'driver' | 'admin') => void;
  currentLanguage: string;
  onLanguageChange: (lng: string) => void;
}

export default function LandingPage({ onSelectRole, currentLanguage, onLanguageChange }: LandingPageProps) {
  const { i18n } = useTranslation();
  const mapRef = useRef<L.Map | null>(null);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map', { 
        zoomControl: false, 
        attributionControl: false 
      }).setView([31.9539, 35.9106], 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
        attribution: '' 
      }).addTo(mapRef.current);

      L.marker([31.9539, 35.9106], { title: isRTL ? 'موقعك' : 'Your location' }).addTo(mapRef.current);
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
  }, [isRTL]);

  return (
    <div className="relative w-full h-screen overflow-hidden font-cairo" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Map Background */}
      <div id="map" className="absolute inset-0 z-0" style={{ filter: 'brightness(0.7) saturate(0.8)' }}></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(to bottom, rgba(17,17,24,0.3) 0%, rgba(17,17,24,0.7) 50%, rgba(17,17,24,0.95) 100%)'
      }}></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Bar with Language Toggle */}
        <div className="flex justify-between items-start p-4 pt-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
              background: '#f5c518', 
              color: '#000',
              boxShadow: '0 4px 20px rgba(245, 197, 24, 0.4)'
            }}>
              <i className="fas fa-taxi text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black" style={{ color: '#fff' }}>
                {isRTL ? 'GetTaxi' : 'GetTaxi'}
              </h1>
              <p className="text-xs" style={{ color: '#f5c518' }}>
                {isRTL ? 'إطلب تكسي' : 'Get a Taxi'}
              </p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex gap-2">
            <button 
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ 
                background: currentLanguage === 'ar' ? '#f5c518' : 'rgba(255,255,255,0.1)',
                color: currentLanguage === 'ar' ? '#000' : '#fff'
              }}
              onClick={() => onLanguageChange('ar')}
            >
              عربي
            </button>
            <button 
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ 
                background: currentLanguage === 'en' ? '#f5c518' : 'rgba(255,255,255,0.1)',
                color: currentLanguage === 'en' ? '#000' : '#fff'
              }}
              onClick={() => onLanguageChange('en')}
            >
              EN
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-end px-5 pb-8">
          {/* Hero Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-black mb-3" style={{ color: '#fff', lineHeight: 1.3 }}>
              {isRTL ? (
                <>احجز تاكسي أصفر<br />في عمّان فوراً</>
              ) : (
                <>Book a Yellow Taxi<br />in Amman Instantly</>
              )}
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              {isRTL ? (
                'اتصل مباشرة بأقرب سائق تاكسي مرخص. بدون رسوم تسجيل، بدون عمولات - فقط اتصل واحجز رحلتك.'
              ) : (
                'Connect directly with the nearest licensed taxi driver. No registration fees, no commissions - just call and book your ride.'
              )}
            </p>
          </div>

          {/* Features Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <i className="fas fa-check-circle" style={{ color: '#1dcd9f', fontSize: '12px' }}></i>
              <span className="text-xs font-bold" style={{ color: '#fff' }}>
                {isRTL ? 'تاكسي مرخص' : 'Licensed Taxi'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <i className="fas fa-shield-halved" style={{ color: '#1dcd9f', fontSize: '12px' }}></i>
              <span className="text-xs font-bold" style={{ color: '#fff' }}>
                {isRTL ? 'آمن ومجاني' : 'Safe & Free'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <i className="fas fa-bolt" style={{ color: '#f5c518', fontSize: '12px' }}></i>
              <span className="text-xs font-bold" style={{ color: '#fff' }}>
                {isRTL ? 'وصول سريع' : 'Fast Arrival'}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <button 
              className="w-full rounded-2xl py-4 px-5 text-base font-bold flex items-center justify-center gap-3 transition-transform active:scale-[0.97]"
              style={{ 
                background: '#f5c518', 
                color: '#000',
                boxShadow: '0 4px 20px rgba(245, 197, 24, 0.4)'
              }}
              onClick={() => onSelectRole('passenger')}
            >
              <i className="fas fa-taxi"></i>
              <span>{isRTL ? 'احجز تاكسي الآن' : 'Book a Taxi Now'}</span>
            </button>

            <button 
              className="w-full rounded-2xl py-4 px-5 text-base font-bold flex items-center justify-center gap-3 transition-transform active:scale-[0.97]"
              style={{ 
                background: 'rgba(255,255,255,0.15)', 
                color: '#fff',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onClick={() => {
                const phone = '+962790000000';
                const message = isRTL ? 
                  'مرحباً، اريد التسجيل كسائق في GetTaxi' : 
                  'Hello, I want to register as a driver on GetTaxi';
                window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
              }}
            >
              <i className="fas fa-car-side"></i>
              <span>{isRTL ? 'سجل كسائق' : 'Register as Driver'}</span>
            </button>

            <button 
              className="w-full rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.97]"
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)' }}
              onClick={() => onSelectRole('admin')}
            >
              <i className="fas fa-lock text-xs"></i>
              <span>{isRTL ? 'لوحة الإدارة' : 'Admin Panel'}</span>
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {isRTL ? (
                'خدمة التاكسي الأصفر في عمّان ·Made with ❤️ in Jordan'
              ) : (
                'Yellow Taxi Service in Amman · Made with ❤️ in Jordan'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
