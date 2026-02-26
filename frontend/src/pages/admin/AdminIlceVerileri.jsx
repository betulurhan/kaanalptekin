import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ilceAPI } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Plus, Pencil, Trash2, MapPin, RefreshCw, TrendingUp, Home } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const AdminIlceVerileri = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [veriler, setVeriler] = useState([]);
  const [varsayilanIlceler, setVarsayilanIlceler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVeri, setEditingVeri] = useState(null);
  const [formData, setFormData] = useState({
    ilce_adi: '',
    ortalama_m2_fiyati: '',
    ortalama_kira_m2: '',
    aciklama: '',
    aktif: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ilceVerileri, ilceler] = await Promise.all([
        ilceAPI.getAll(),
        ilceAPI.getVarsayilanIlceler()
      ]);
      setVeriler(ilceVerileri);
      setVarsayilanIlceler(ilceler.ilceler);
    } catch (error) {
      toast({ title: 'Hata', description: 'Veriler yüklenemedi', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleTopluEkle = async () => {
    try {
      const result = await ilceAPI.topluEkle(token);
      toast({ title: 'Başarılı', description: result.message });
      loadData();
    } catch (error) {
      toast({ title: 'Hata', description: 'İlçeler eklenemedi', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        ortalama_m2_fiyati: parseFloat(formData.ortalama_m2_fiyati) || 0,
        ortalama_kira_m2: parseFloat(formData.ortalama_kira_m2) || 0
      };

      if (editingVeri) {
        await ilceAPI.update(token, editingVeri.id, data);
        toast({ title: 'Başarılı', description: 'İlçe verisi güncellendi' });
      } else {
        await ilceAPI.create(token, data);
        toast({ title: 'Başarılı', description: 'İlçe verisi eklendi' });
      }
      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({ title: 'Hata', description: error.response?.data?.detail || 'İşlem başarısız', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ilçe verisini silmek istediğinize emin misiniz?')) return;
    try {
      await ilceAPI.delete(token, id);
      toast({ title: 'Başarılı', description: 'İlçe verisi silindi' });
      loadData();
    } catch (error) {
      toast({ title: 'Hata', description: 'Silinemedi', variant: 'destructive' });
    }
  };

  const openEditDialog = (veri) => {
    setEditingVeri(veri);
    setFormData({
      ilce_adi: veri.ilce_adi,
      ortalama_m2_fiyati: veri.ortalama_m2_fiyati.toString(),
      ortalama_kira_m2: veri.ortalama_kira_m2.toString(),
      aciklama: veri.aciklama || '',
      aktif: veri.aktif
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      ilce_adi: '',
      ortalama_m2_fiyati: '',
      ortalama_kira_m2: '',
      aciklama: '',
      aktif: true
    });
    setEditingVeri(null);
  };

  const formatPara = (sayi) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(sayi);
  };

  // Mevcut olmayan ilçeleri bul
  const mevcutIlceler = veriler.map(v => v.ilce_adi);
  const eksikIlceler = varsayilanIlceler.filter(i => !mevcutIlceler.includes(i));

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">İlçe Verileri</h1>
          <p className="text-slate-600">Kira getirisi hesaplama için ilçe bazlı m² fiyatları</p>
        </div>
        <div className="flex gap-2">
          {eksikIlceler.length > 0 && (
            <Button onClick={handleTopluEkle} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tüm İlçeleri Ekle ({eksikIlceler.length} eksik)
            </Button>
          )}
          <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="bg-amber-500 hover:bg-amber-600">
            <Plus className="w-4 h-4 mr-2" />
            Yeni İlçe
          </Button>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{veriler.length}</p>
                <p className="text-sm text-slate-600">Toplam İlçe</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{veriler.filter(v => v.aktif).length}</p>
                <p className="text-sm text-slate-600">Aktif İlçe</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Home className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{veriler.filter(v => v.ortalama_m2_fiyati > 0).length}</p>
                <p className="text-sm text-slate-600">Veri Girilen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* İlçe Listesi */}
      <Card>
        <CardHeader>
          <CardTitle>Antalya İlçeleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">İlçe</th>
                  <th className="text-right py-3 px-4">Satılık m² Fiyatı</th>
                  <th className="text-right py-3 px-4">Kiralık m² Fiyatı</th>
                  <th className="text-right py-3 px-4">Kira Getirisi</th>
                  <th className="text-center py-3 px-4">Durum</th>
                  <th className="text-right py-3 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {veriler.map((veri) => {
                  const kiraGetirisi = veri.ortalama_m2_fiyati > 0 
                    ? ((veri.ortalama_kira_m2 * 12) / veri.ortalama_m2_fiyati * 100).toFixed(2)
                    : 0;
                  return (
                    <tr key={veri.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">{veri.ilce_adi}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">
                        {veri.ortalama_m2_fiyati > 0 ? formatPara(veri.ortalama_m2_fiyati) : '-'}
                      </td>
                      <td className="text-right py-3 px-4">
                        {veri.ortalama_kira_m2 > 0 ? formatPara(veri.ortalama_kira_m2) : '-'}
                      </td>
                      <td className="text-right py-3 px-4">
                        {kiraGetirisi > 0 ? (
                          <span className={`font-semibold ${kiraGetirisi >= 5 ? 'text-green-600' : kiraGetirisi >= 3 ? 'text-amber-600' : 'text-red-600'}`}>
                            %{kiraGetirisi}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${veri.aktif ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {veri.aktif ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button onClick={() => openEditDialog(veri)} variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDelete(veri.id)} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVeri ? 'İlçe Verisini Düzenle' : 'Yeni İlçe Verisi'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>İlçe Adı</Label>
              {editingVeri ? (
                <Input value={formData.ilce_adi} disabled className="mt-1 bg-slate-100" />
              ) : (
                <Select value={formData.ilce_adi} onValueChange={(v) => setFormData({ ...formData, ilce_adi: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="İlçe seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {eksikIlceler.map((ilce) => (
                      <SelectItem key={ilce} value={ilce}>{ilce}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <Label>Ortalama Satılık m² Fiyatı (₺)</Label>
              <Input
                type="number"
                value={formData.ortalama_m2_fiyati}
                onChange={(e) => setFormData({ ...formData, ortalama_m2_fiyati: e.target.value })}
                placeholder="50000"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Ortalama Kiralık m² Fiyatı (₺/ay)</Label>
              <Input
                type="number"
                value={formData.ortalama_kira_m2}
                onChange={(e) => setFormData({ ...formData, ortalama_kira_m2: e.target.value })}
                placeholder="200"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Açıklama (Opsiyonel)</Label>
              <Input
                value={formData.aciklama}
                onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                placeholder="Örn: Sahil bölgesi fiyatları"
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.aktif}
                onCheckedChange={(v) => setFormData({ ...formData, aktif: v })}
              />
              <Label>Aktif (Hesaplamalarda görünsün)</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600">
                {editingVeri ? 'Güncelle' : 'Ekle'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                İptal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminIlceVerileri;
