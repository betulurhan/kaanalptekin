import React, { useState, useEffect } from 'react';
import { FileText, ClipboardList, Clock, CheckCircle, Phone, Mail, MapPin, Home, Calendar, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { formsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const AdminForms = () => {
  const { token } = useAuth();
  const [talepForms, setTalepForms] = useState([]);
  const [ekspertizForms, setEkspertizForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    fetchForms();
  }, [token]);

  const fetchForms = async () => {
    try {
      const [talep, ekspertiz] = await Promise.all([
        formsAPI.getTalepList(token),
        formsAPI.getEkspertizList(token)
      ]);
      setTalepForms(talep);
      setEkspertizForms(ekspertiz);
    } catch (error) {
      toast.error('Formlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (type, id, status) => {
    try {
      if (type === 'talep') {
        await formsAPI.updateTalepStatus(token, id, status);
      } else {
        await formsAPI.updateEkspertizStatus(token, id, status);
      }
      toast.success('Durum güncellendi');
      fetchForms();
    } catch (error) {
      toast.error('Güncelleme başarısız');
    }
  };

  const deleteForm = async (type, id) => {
    if (!window.confirm('Bu formu silmek istediğinize emin misiniz?')) return;
    try {
      if (type === 'talep') {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/forms/talep/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/forms/ekspertiz/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      toast.success('Form silindi');
      fetchForms();
    } catch (error) {
      toast.error('Silme işlemi başarısız');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Bekliyor</Badge>;
      case 'contacted':
      case 'in_progress':
        return <Badge className="bg-blue-500">İşlemde</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Tamamlandı</Badge>;
      default:
        return <Badge className="bg-slate-500">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Form Başvuruları</h1>
        <p className="text-slate-500">Talep ve ekspertiz başvurularını yönetin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{talepForms.length}</p>
              <p className="text-sm text-slate-500">Talep Formu</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{ekspertizForms.length}</p>
              <p className="text-sm text-slate-500">Ekspertiz Formu</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {talepForms.filter(f => f.status === 'pending').length + ekspertizForms.filter(f => f.status === 'pending').length}
              </p>
              <p className="text-sm text-slate-500">Bekleyen</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {talepForms.filter(f => f.status === 'completed').length + ekspertizForms.filter(f => f.status === 'completed').length}
              </p>
              <p className="text-sm text-slate-500">Tamamlanan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="talep" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="talep">Talep Formları ({talepForms.length})</TabsTrigger>
          <TabsTrigger value="ekspertiz">Ekspertiz Formları ({ekspertizForms.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="talep" className="mt-6">
          <div className="space-y-4">
            {talepForms.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Henüz talep formu bulunmuyor</p>
                </CardContent>
              </Card>
            ) : (
              talepForms.map((form) => (
                <Card key={form.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-800">{form.name}</h3>
                          {getStatusBadge(form.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {form.phone}
                          </span>
                          {form.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {form.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Home className="w-3 h-3" />
                            {form.property_type}
                          </span>
                          {form.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {form.location}
                            </span>
                          )}
                        </div>
                        {form.message && (
                          <p className="text-sm text-slate-500 mt-2 line-clamp-2">{form.message}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-2">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(form.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={form.status}
                          onChange={(e) => updateStatus('talep', form.id, e.target.value)}
                          className="px-3 py-1 border rounded-lg text-sm"
                        >
                          <option value="pending">Bekliyor</option>
                          <option value="contacted">İletişime Geçildi</option>
                          <option value="completed">Tamamlandı</option>
                        </select>
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => deleteForm('talep', form.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="ekspertiz" className="mt-6">
          <div className="space-y-4">
            {ekspertizForms.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Henüz ekspertiz formu bulunmuyor</p>
                </CardContent>
              </Card>
            ) : (
              ekspertizForms.map((form) => (
                <Card key={form.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-800">{form.name}</h3>
                          {getStatusBadge(form.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {form.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Home className="w-3 h-3" />
                            {form.property_type}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {form.district}
                          </span>
                          {form.area_m2 && <span>{form.area_m2} m²</span>}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">{form.address}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(form.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={form.status}
                          onChange={(e) => updateStatus('ekspertiz', form.id, e.target.value)}
                          className="px-3 py-1 border rounded-lg text-sm"
                        >
                          <option value="pending">Bekliyor</option>
                          <option value="in_progress">İşlemde</option>
                          <option value="completed">Tamamlandı</option>
                        </select>
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => deleteForm('ekspertiz', form.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedForm(null)}>
          <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Form Detayları</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-slate-600 whitespace-pre-wrap">
                {JSON.stringify(selectedForm, null, 2)}
              </pre>
              <Button className="mt-4 w-full" onClick={() => setSelectedForm(null)}>Kapat</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminForms;
