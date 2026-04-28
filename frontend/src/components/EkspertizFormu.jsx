import React, { useState } from 'react';
import { Send, Clock, CheckCircle, ClipboardList, User, Phone, Mail, Home, MapPin, Ruler, Calendar, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

export const EkspertizFormu = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    property_type: '',
    address: '',
    district: '',
    area_m2: '',
    rooms: '',
    building_age: '',
    floor: '',
    has_elevator: false,
    parking: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API = process.env.REACT_APP_BACKEND_URL;
      await fetch(`${API}/api/forms/ekspertiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-lg mx-auto border-none shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Ekspertiz Talebiniz Alındı!</h3>
          <p className="text-slate-600 mb-6">
            Mülk değerleme talebiniz başarıyla iletildi. Uzman ekibimiz en kısa sürede incelemeye alacaktır.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">3 gün içinde ekspertiz raporunuz iletilecektir.</span>
            </div>
          </div>
          <Button onClick={onClose} className="bg-slate-800 hover:bg-slate-900">
            Tamam
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Ücretsiz Ekspertiz Formu</CardTitle>
            <CardDescription className="text-green-100">
              Mülkünüzün profesyonel değerlemesi
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-green-700 text-sm font-medium">
            3 gün içinde detaylı ekspertiz raporunuz iletilecektir.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* İletişim Bilgileri */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              İletişim Bilgileri
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Adınız Soyadınız"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefon *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="05XX XXX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>
          </div>

          {/* Mülk Bilgileri */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Home className="w-4 h-4 text-green-600" />
              Mülk Bilgileri
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mülk Tipi *</label>
                <select
                  required
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  <option value="Daire">Daire</option>
                  <option value="Villa">Villa</option>
                  <option value="Müstakil Ev">Müstakil Ev</option>
                  <option value="Arsa">Arsa</option>
                  <option value="Dükkan">Dükkan</option>
                  <option value="Ofis">Ofis</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">İlçe *</label>
                <select
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  <option value="Konyaaltı">Konyaaltı</option>
                  <option value="Muratpaşa">Muratpaşa</option>
                  <option value="Kepez">Kepez</option>
                  <option value="Döşemealtı">Döşemealtı</option>
                  <option value="Aksu">Aksu</option>
                  <option value="Altıntaş">Altıntaş</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Adres *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Mahalle, Sokak, Bina No, Daire No"
              />
            </div>
          </div>

          {/* Teknik Detaylar */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-green-600" />
              Teknik Detaylar
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alan (m²)</label>
                <input
                  type="number"
                  value={formData.area_m2}
                  onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Oda Sayısı</label>
                <select
                  value={formData.rooms}
                  onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  <option value="1+0">1+0</option>
                  <option value="1+1">1+1</option>
                  <option value="2+1">2+1</option>
                  <option value="3+1">3+1</option>
                  <option value="4+1">4+1</option>
                  <option value="5+1">5+1</option>
                  <option value="6+">6+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bina Yaşı</label>
                <select
                  value={formData.building_age}
                  onChange={(e) => setFormData({ ...formData, building_age: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  <option value="0-5">0-5 Yıl</option>
                  <option value="5-10">5-10 Yıl</option>
                  <option value="10-20">10-20 Yıl</option>
                  <option value="20+">20+ Yıl</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kat</label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="3/8"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="elevator"
                  checked={formData.has_elevator}
                  onChange={(e) => setFormData({ ...formData, has_elevator: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="elevator" className="text-sm text-slate-700">Asansör Var</label>
              </div>
              <div>
                <select
                  value={formData.parking}
                  onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Otopark Durumu</option>
                  <option value="Kapalı Otopark">Kapalı Otopark</option>
                  <option value="Açık Otopark">Açık Otopark</option>
                  <option value="Yok">Otopark Yok</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notlar */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ek Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Mülkünüz hakkında eklemek istediğiniz bilgiler..."
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Gönderiliyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Ücretsiz Ekspertiz Talep Et
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EkspertizFormu;
