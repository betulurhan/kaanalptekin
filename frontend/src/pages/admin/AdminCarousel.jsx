import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { carouselAPI, cloudinaryAPI } from '../../services/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Switch } from '../../components/ui/switch';
import { Plus, Pencil, Trash2, Upload, GripVertical } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const AdminCarousel = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', subtitle: '', description: '', image: '',
    cta_text: '', cta_link: '', order: 0, is_active: true
  });

  useEffect(() => { loadSlides(); }, []);

  const loadSlides = async () => {
    try {
      const data = await carouselAPI.getAll(false);
      setSlides(data.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await cloudinaryAPI.upload(token, file, 'carousel');
      setFormData({ ...formData, image: result.url });
      toast({ title: 'Başarılı', description: 'Görsel yüklendi (Cloudinary)' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Hata', description: 'Görsel yüklenemedi', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        await carouselAPI.update(token, editingSlide.id, formData);
        toast({ title: 'Başarılı', description: 'Slayt güncellendi' });
      } else {
        await carouselAPI.create(token, formData);
        toast({ title: 'Başarılı', description: 'Slayt eklendi' });
      }
      setDialogOpen(false);
      resetForm();
      loadSlides();
    } catch (error) {
      toast({ title: 'Hata', description: 'İşlem başarısız', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu slaytı silmek istediğinizden emin misiniz?')) return;
    try {
      await carouselAPI.delete(token, id);
      toast({ title: 'Başarılı', description: 'Slayt silindi' });
      loadSlides();
    } catch (error) {
      toast({ title: 'Hata', description: 'Silinemedi', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', description: '', image: '', cta_text: '', cta_link: '', order: 0, is_active: true });
    setEditingSlide(null);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Ana Sayfa Slider</h1>
          <p className="text-slate-600">Carousel görsellerini yönetin</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="w-4 h-4 mr-2" /> Yeni Slayt
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <Card key={slide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-slate-200">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              {!slide.is_active && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-semibold">Pasif</span></div>}
              <div className="absolute top-2 left-2 bg-slate-800 text-white px-2 py-1 rounded text-xs">Sıra: {slide.order}</div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-1">{slide.title}</h3>
              {slide.subtitle && <p className="text-sm text-slate-600 mb-2">{slide.subtitle}</p>}
              <div className="flex gap-2 mt-4">
                <Button onClick={() => { setEditingSlide(slide); setFormData(slide); setDialogOpen(true); }} variant="outline" size="sm" className="flex-1">
                  <Pencil className="w-4 h-4 mr-1" /> Düzenle
                </Button>
                <Button onClick={() => handleDelete(slide.id)} variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingSlide ? 'Slayt Düzenle' : 'Yeni Slayt Ekle'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Başlık *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div><Label>Alt Başlık</Label><Input value={formData.subtitle || ''} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} /></div>
            <div><Label>Açıklama</Label><Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
            <div>
              <Label>Görsel *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => document.getElementById('slide-image-upload').click()} disabled={uploading} className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
                  </Button>
                  <input id="slide-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
                <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="veya Görsel URL'si" required />
                {formData.image && <img src={formData.image} alt="Preview" className="w-full h-40 object-cover rounded" />}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Buton Metni</Label><Input value={formData.cta_text || ''} onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })} placeholder="Projeleri İncele" /></div>
              <div><Label>Buton Linki</Label><Input value={formData.cta_link || ''} onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })} placeholder="/projeler" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Sıra *</Label><Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} required /></div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                <Label>Aktif</Label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600">{editingSlide ? 'Güncelle' : 'Ekle'}</Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCarousel;
