import React, { useState } from 'react';
import { Send, Clock, CheckCircle, FileText, User, Phone, Mail, MessageSquare, Home, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formsAPI } from '../services/api';

export const TalepFormu = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    property_type: '',
    location: '',
    budget: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await formsAPI.submitTalep(formData);
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
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Talebiniz Alındı!</h3>
          <p className="text-slate-600 mb-6">
            Gayrimenkul talebiniz başarıyla iletildi.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-amber-700">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">En geç 3 gün içerisinde size dönüş yapılacaktır.</span>
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
    <Card className="max-w-lg mx-auto border-none shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Gayrimenkul Talep Formu</CardTitle>
            <CardDescription className="text-slate-300">
              Aradığınız gayrimenkulü bize bildirin
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-amber-700 text-sm font-medium">
            En geç 3 gün içerisinde dönüş yapılacaktır.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Adınız"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefon *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gayrimenkul Tipi *</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  required
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Seçiniz</option>
                  <option value="Daire">Daire</option>
                  <option value="Villa">Villa</option>
                  <option value="Rezidans">Rezidans</option>
                  <option value="Arsa">Arsa</option>
                  <option value="Dükkan">Dükkan</option>
                  <option value="Ofis">Ofis</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tercih Edilen Bölge</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Seçiniz</option>
                  <option value="Konyaaltı">Konyaaltı</option>
                  <option value="Muratpaşa">Muratpaşa</option>
                  <option value="Kepez">Kepez</option>
                  <option value="Döşemealtı">Döşemealtı</option>
                  <option value="Aksu">Aksu</option>
                  <option value="Altıntaş">Altıntaş</option>
                  <option value="Lara">Lara</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bütçe Aralığı</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Seçiniz</option>
              <option value="0-2000000">2 Milyon TL'ye kadar</option>
              <option value="2000000-5000000">2-5 Milyon TL</option>
              <option value="5000000-10000000">5-10 Milyon TL</option>
              <option value="10000000+">10 Milyon TL üzeri</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ek Açıklamalar</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                placeholder="Özel isteklerinizi yazabilirsiniz..."
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 py-6 text-lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Gönderiliyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Talep Gönder
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TalepFormu;
