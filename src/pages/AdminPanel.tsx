import { useState } from 'react'

interface AdminPanelProps {
  onBack: () => void
}

interface Driver {
  id: string
  name: string
  phone: string
  plate: string
  carModel: string
  noShowCount: number
  status: 'active' | 'suspended'
  lastOnline: string
  platePhoto: string
  carPhoto: string
  suspensionReason?: string
}

interface Request {
  id: string
  passenger: string
  driver: string
  from: string
  to: string
  time: string
  price: string
  status: 'completed' | 'cancelled' | 'no_show'
}

interface Report {
  id: string
  passenger: string
  driver: string
  reason: string
  time: string
}

interface WhatsAppApplication {
  id: string
  name: string
  phone: string
  plate: string
  carModel: string
  platePhoto: string
  carPhoto: string
  timestamp: string
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'drivers' | 'requests' | 'reports' | 'applications'>('drivers')
  const [toast, setToast] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPhotosModal, setShowPhotosModal] = useState<{ driver: Driver | null }>({ driver: null })
  const [showSuspendModal, setShowSuspendModal] = useState<{ driver: Driver | null; reason: string }>({ driver: null, reason: '' })

  // Mock data - In production, this would come from Supabase
  const stats = {
    onlineDrivers: 47,
    todayRequests: 183,
    noShowRate: '3.2%'
  }

  const drivers: Driver[] = [
    { id: '1', name: 'أحمد محمد', phone: '0791234567', plate: 'أ ب 1234', carModel: 'هيونداي سوناتا 2022', noShowCount: 0, status: 'active', lastOnline: 'منذ 5 دقائق', platePhoto: '', carPhoto: '' },
    { id: '2', name: 'محمد خالد', phone: '0789876543', plate: 'ب ج 5678', carModel: 'كيا سيراتو 2021', noShowCount: 2, status: 'active', lastOnline: 'منذ 15 دقيقة', platePhoto: '', carPhoto: '' },
    { id: '3', name: 'خالد عبدالله', phone: '0775555555', plate: 'ج د 9012', carModel: 'تويوتا كورولا 2020', noShowCount: 5, status: 'suspended', lastOnline: 'منذ 3 ساعات', platePhoto: '', carPhoto: '', suspensionReason: 'تجاوز 5 no-show' },
    { id: '4', name: 'عمر سالم', phone: '0792222222', plate: 'د ه 3456', carModel: 'شيفروليه ماليبو 2023', noShowCount: 1, status: 'active', lastOnline: 'متصل الآن', platePhoto: '', carPhoto: '' },
    { id: '5', name: 'يوسف حسن', phone: '0783333333', plate: 'ه و 7890', carModel: 'نissan سنترا 2022', noShowCount: 4, status: 'active', lastOnline: 'منذ ساعة', platePhoto: '', carPhoto: '' },
  ]

  const requests: Request[] = [
    { id: '1', passenger: 'راكب مجهول', driver: 'أحمد محمد', from: 'وسط البلد', to: 'الجبيهة', time: 'منذ 10 دقائق', price: '4.50 JD', status: 'completed' },
    { id: '2', passenger: 'راكب مجهول', driver: 'محمد خالد', from: 'المطار', to: 'شفا عمّان', time: 'منذ 25 دقيقة', price: '12.00 JD', status: 'completed' },
    { id: '3', passenger: 'راكب مجهول', driver: 'خالد عبدالله', from: 'جبل عمّان', to: 'وسط البلد', time: 'منذ ساعة', price: '3.00 JD', status: 'no_show' },
    { id: '4', passenger: 'راكب مجهول', driver: 'عمر سالم', from: 'طبربور', to: 'الدوار الخامس', time: 'منذ ساعة و half', price: '5.50 JD', status: 'completed' },
    { id: '5', passenger: 'راكب مجهول', driver: 'يوسف حسن', from: 'الصويفية', to: 'وسط البلد', time: 'منذ ساعتين', price: '4.00 JD', status: 'cancelled' },
  ]

  const reports: Report[] = [
    { id: '1', passenger: 'راكب #4521', driver: 'خالد عبدالله', reason: 'لم يأتِ للوجهة', time: 'منذ يوم' },
    { id: '2', passenger: 'راكب #3892', driver: 'يوسف حسن', reason: 'تأخر في الاستجابة', time: 'منذ 3 أيام' },
  ]

  const applications: WhatsAppApplication[] = [
    { id: '1', name: 'سامي العجلوني', phone: '0774444444', plate: 'أ ج 1111', carModel: 'كيا سيراتو 2023', platePhoto: '', carPhoto: '', timestamp: 'منذ 5 دقائق' },
    { id: '2', name: 'محمد بني هاني', phone: '0796666666', plate: 'ب د 2222', carModel: 'هيونداي إلنترا 2022', platePhoto: '', carPhoto: '', timestamp: 'منذ 18 دقيقة' },
  ]

  const filteredDrivers = drivers.filter(d => 
    d.plate.includes(searchQuery) || d.name.includes(searchQuery) || d.phone.includes(searchQuery)
  )

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSuspend = (driver: Driver) => {
    if (!showSuspendModal.reason.trim()) {
      showToast('اكتب سبب التعليق')
      return
    }
    showToast(`تم تعليق ${driver.name} بنجاح`)
    setShowSuspendModal({ driver: null, reason: '' })
  }

  const handleReactivate = (driver: Driver) => {
    showToast(`تم إعادة تفعيل ${driver.name}`)
  }

  const handleApproveApplication = (app: WhatsAppApplication) => {
    showToast(`تمت الموافقة على ${app.name}`)
  }

  const handleRejectApplication = (app: WhatsAppApplication) => {
    showToast(`تم رفض طلب ${app.name}`)
  }

  return (
    <div className="w-full h-screen overflow-hidden font-cairo bg-[#08080f]" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#111120] to-[#08080f] px-5 py-5 border-b border-[rgba(255,255,255,0.07)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#f5c518' }}>
              <i className="fas fa-taxi text-black text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-black">GitTaxi</h1>
              <span className="text-xs" style={{ color: '#6b6b80' }}>لوحة الإدارة</span>
            </div>
          </div>
          <button 
            className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
            style={{ background: 'rgba(255,71,87,0.15)', color: '#ff4757', border: '1px solid rgba(255,71,87,0.25)' }}
            onClick={onBack}
          >
            <i className="fas fa-power-off"></i>
            خروج
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-1">
              <i className="fas fa-circle text-green-500 text-[8px]"></i>
              <span className="text-[10px]" style={{ color: '#6b6b80' }}>السواقين الأونلاين</span>
            </div>
            <div className="text-2xl font-black" style={{ color: '#1dcd9f' }}>{stats.onlineDrivers}</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-1">
              <i className="fas fa-file-alt text-yellow-500 text-[8px]"></i>
              <span className="text-[10px]" style={{ color: '#6b6b80' }}>الطلبات اليوم</span>
            </div>
            <div className="text-2xl font-black" style={{ color: '#f5c518' }}>{stats.todayRequests}</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-1">
              <i className="fas fa-exclamation-triangle text-red-500 text-[8px]"></i>
              <span className="text-[10px]" style={{ color: '#6b6b80' }}>معدل No-show</span>
            </div>
            <div className="text-2xl font-black" style={{ color: '#ff4757' }}>{stats.noShowRate}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[rgba(255,255,255,0.07)] px-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {[
          { id: 'drivers', label: 'السواقين', icon: 'fa-users' },
          { id: 'requests', label: 'الطلبات', icon: 'fa-file-alt' },
          { id: 'reports', label: 'التقارير', icon: 'fa-flag' },
          { id: 'applications', label: 'التطبيقات الجديدة', icon: 'fa-whatsapp' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-[#f5c518] text-[#f5c518]' 
                : 'border-transparent text-[#6b6b80] hover:text-white'
            }`}
          >
            <i className={`fab ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-280px)] overflow-y-auto p-4">
        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div>
            {/* Search */}
            <div className="mb-3">
              <div className="relative">
                <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b80]"></i>
                <input
                  type="text"
                  placeholder="بحث بلوحة التاكسي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl py-3 pr-10 pl-4 text-sm"
                  style={{ 
                    background: 'rgba(255,255,255,0.04)', 
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#f0f0f5',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Auto-suspension Notice */}
            <div className="mb-3 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)' }}>
              <i className="fas fa-exclamation-circle text-[#ff4757]"></i>
              <span className="text-xs font-bold text-[#ff4757]">⚠️ النظام يعلّق تلقائياً بعد 5 No-show</span>
            </div>

            {/* Drivers Table */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-bold" style={{ background: 'rgba(255,255,255,0.05)', color: '#6b6b80' }}>
                    <th className="py-3 px-3 text-right">لوحة التاكسي</th>
                    <th className="py-3 px-3 text-right">اسم السائق</th>
                    <th className="py-3 px-3 text-right">رقم التليفون</th>
                    <th className="py-3 px-3 text-right">No-show</th>
                    <th className="py-3 px-3 text-right">الحالة</th>
                    <th className="py-3 px-3 text-right">الصور</th>
                    <th className="py-3 px-3 text-right">آخر أونلاين</th>
                    <th className="py-3 px-3 text-right">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map(driver => (
                    <tr key={driver.id} className="border-t border-[rgba(255,255,255,0.05)] text-xs">
                      <td className="py-3 px-3 font-bold" style={{ color: '#f5c518' }}>{driver.plate}</td>
                      <td className="py-3 px-3">{driver.name}</td>
                      <td className="py-3 px-3" style={{ color: '#6b6b80' }}>{driver.phone}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          driver.noShowCount >= 5 
                            ? 'bg-[rgba(255,71,87,0.2)] text-[#ff4757]' 
                            : driver.noShowCount >= 3 
                            ? 'bg-[rgba(255,193,7,0.2)] text-[#ffc107]' 
                            : 'bg-[rgba(29,205,159,0.2)] text-[#1dcd9f]'
                        }`}>
                          {driver.noShowCount}/5
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          driver.status === 'active' 
                            ? 'bg-[rgba(29,205,159,0.2)] text-[#1dcd9f]' 
                            : 'bg-[rgba(255,71,87,0.2)] text-[#ff4757]'
                        }`}>
                          {driver.status === 'active' ? 'نشط' : 'معلّق'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button 
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[rgba(102,153,255,0.2)] text-[#6699ff]"
                          onClick={() => setShowPhotosModal({ driver })}
                        >
                          <i className="fas fa-image ml-1"></i>
                          عرض الصور
                        </button>
                      </td>
                      <td className="py-3 px-3" style={{ color: '#6b6b80' }}>{driver.lastOnline}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          {driver.status === 'active' ? (
                            <button 
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[rgba(255,71,87,0.2)] text-[#ff4757]"
                              onClick={() => setShowSuspendModal({ driver, reason: '' })}
                            >
                              <i className="fas fa-ban ml-1"></i>
                              تعليق
                            </button>
                          ) : (
                            <button 
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[rgba(29,205,159,0.2)] text-[#1dcd9f]"
                              onClick={() => handleReactivate(driver)}
                            >
                              <i className="fas fa-redo ml-1"></i>
                              إعادة تفعيل
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-bold" style={{ background: 'rgba(255,255,255,0.05)', color: '#6b6b80' }}>
                    <th className="py-3 px-3 text-right">#</th>
                    <th className="py-3 px-3 text-right">السائق</th>
                    <th className="py-3 px-3 text-right">من</th>
                    <th className="py-3 px-3 text-right">إلى</th>
                    <th className="py-3 px-3 text-right">الوقت</th>
                    <th className="py-3 px-3 text-right">المبلغ</th>
                    <th className="py-3 px-3 text-right">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id} className="border-t border-[rgba(255,255,255,0.05)] text-xs">
                      <td className="py-3 px-3" style={{ color: '#6b6b80' }}>{req.id}</td>
                      <td className="py-3 px-3">{req.driver}</td>
                      <td className="py-3 px-3" style={{ color: '#6b6b80' }}>{req.from}</td>
                      <td className="py-3 px-3" style={{ color: '#6b6b80' }}>{req.to}</td>
                      <td className="py-3 px-3" style={{ color: '#6b6b80' }}>{req.time}</td>
                      <td className="py-3 px-3 font-bold" style={{ color: '#1dcd9f' }}>{req.price}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          req.status === 'completed' 
                            ? 'bg-[rgba(29,205,159,0.2)] text-[#1dcd9f]' 
                            : req.status === 'cancelled' 
                            ? 'bg-[rgba(255,193,7,0.2)] text-[#ffc107]' 
                            : 'bg-[rgba(255,71,87,0.2)] text-[#ff4757]'
                        }`}>
                          {req.status === 'completed' ? 'مكتمل' : req.status === 'cancelled' ? 'ملغي' : 'no-show'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            {reports.length === 0 ? (
              <div className="text-center py-10">
                <i className="fas fa-flag text-4xl mb-3" style={{ color: '#6b6b80' }}></i>
                <p className="text-sm" style={{ color: '#6b6b80' }}>لا توجد تقارير</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map(report => (
                  <div key={report.id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-sm">{report.driver}</div>
                        <div className="text-xs mt-1" style={{ color: '#6b6b80' }}>
                          <i className="fas fa-user ml-1"></i>
                          {report.passenger}
                        </div>
                      </div>
                      <span className="text-[10px]" style={{ color: '#6b6b80' }}>{report.time}</span>
                    </div>
                    <div className="p-2 rounded-lg text-xs" style={{ background: 'rgba(255,71,87,0.1)', color: '#ff4757' }}>
                      <i className="fas fa-exclamation-circle ml-1"></i>
                      {report.reason}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <div className="mb-3 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)' }}>
              <i className="fab fa-whatsapp text-[#25D366] text-xl"></i>
              <span className="text-xs font-bold text-[#25D366]">مراجعة الطلبات الجديدة عبر واتساب</span>
            </div>
            <div className="space-y-3">
              {applications.map(app => (
                <div key={app.id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold">{app.name}</div>
                      <div className="text-xs mt-1" style={{ color: '#6b6b80' }}>
                        <i className="fas fa-phone ml-1"></i>
                        {app.phone}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#6b6b80' }}>
                        <i className="fas fa-car ml-1"></i>
                        {app.carModel}
                      </div>
                      <div className="font-bold mt-1" style={{ color: '#f5c518' }}>
                        {app.plate}
                      </div>
                    </div>
                    <span className="text-[10px]" style={{ color: '#6b6b80' }}>{app.timestamp}</span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 p-3 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <i className="fas fa-id-card text-2xl mb-2" style={{ color: '#6699ff' }}></i>
                      <div className="text-[10px]" style={{ color: '#6b6b80' }}>صورة اللوحة</div>
                    </div>
                    <div className="flex-1 p-3 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <i className="fas fa-car text-2xl mb-2" style={{ color: '#b06aff' }}></i>
                      <div className="text-[10px]" style={{ color: '#6b6b80' }}>صورة العربية</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 py-2 rounded-lg text-xs font-bold bg-[rgba(255,71,87,0.2)] text-[#ff4757]"
                      onClick={() => handleRejectApplication(app)}
                    >
                      <i className="fas fa-times ml-1"></i>
                      رفض
                    </button>
                    <button 
                      className="flex-1 py-2 rounded-lg text-xs font-bold bg-[rgba(29,205,159,0.2)] text-[#1dcd9f]"
                      onClick={() => handleApproveApplication(app)}
                    >
                      <i className="fas fa-check ml-1"></i>
                      موافقة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Activity Log - Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[rgba(255,255,255,0.07)]" style={{ background: 'rgba(8,8,15,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2">
            <i className="fas fa-history text-[#f5c518]"></i>
            <span className="text-xs font-bold">سجل النشاط - آخر 10 طلبات</span>
          </div>
        </div>
        <div className="flex gap-4 px-4 py-3 overflow-x-auto">
          {requests.slice(0, 5).map(req => (
            <div key={req.id} className="flex-shrink-0 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', minWidth: '150px' }}>
              <div className="text-[10px] font-bold mb-1">{req.driver}</div>
              <div className="text-[9px]" style={{ color: '#6b6b80' }}>{req.time}</div>
              <div className="text-[10px] font-bold mt-1" style={{ color: '#1dcd9f' }}>{req.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Photos Modal */}
      {showPhotosModal.driver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl w-full max-w-md overflow-hidden" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-4 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
              <h3 className="font-bold">صور {showPhotosModal.driver.name}</h3>
              <button onClick={() => setShowPhotosModal({ driver: null })}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: '#6b6b80' }}>صورة اللوحة</div>
                <div className="aspect-video rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <i className="fas fa-id-card text-4xl" style={{ color: '#6699ff' }}></i>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: '#6b6b80' }}>صورة السيارة</div>
                <div className="aspect-video rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <i className="fas fa-car text-4xl" style={{ color: '#b06aff' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal.driver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl w-full max-w-md overflow-hidden" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-4 border-b border-[rgba(255,71,87,0.3)]" style={{ background: 'rgba(255,71,87,0.1)' }}>
              <h3 className="font-bold text-[#ff4757]">
                <i className="fas fa-ban ml-2"></i>
                تعليق {showSuspendModal.driver.name}
              </h3>
            </div>
            <div className="p-4">
              <label className="block text-xs font-bold mb-2" style={{ color: '#6b6b80' }}>سبب التعليق</label>
              <textarea
                value={showSuspendModal.reason}
                onChange={(e) => setShowSuspendModal({ ...showSuspendModal, reason: e.target.value })}
                placeholder="اكتب سبب التعليق..."
                className="w-full rounded-xl p-3 text-sm resize-none"
                style={{ 
                  background: 'rgba(255,255,255,0.04)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f0f0f5',
                  outline: 'none'
                }}
                rows={3}
              />
              <div className="flex gap-2 mt-4">
                <button 
                  className="flex-1 py-3 rounded-xl text-sm font-bold"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#f0f0f5' }}
                  onClick={() => setShowSuspendModal({ driver: null, reason: '' })}
                >
                  إلغاء
                </button>
                <button 
                  className="flex-1 py-3 rounded-xl text-sm font-bold"
                  style={{ background: '#ff4757', color: '#fff' }}
                  onClick={() => handleSuspend(showSuspendModal.driver!)}
                >
                  تأكيد التعليق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-sm font-bold z-50"
             style={{ 
               background: '#1dcd9f', 
               color: '#000',
               boxShadow: '0 4px 20px rgba(29,205,159,0.4)'
             }}>
          {toast}
        </div>
      )}
    </div>
  )
}
