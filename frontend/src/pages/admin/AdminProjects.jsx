import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI, uploadAPI } from '../../services/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Pencil, Trash2, Upload, X, Home, Building2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Badge } from '../../components/ui/badge';

export const AdminProjects = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Rezidans',
    status: 'ongoing',
    image: '',
    images: [],
    description: '',
    price: '',
    features: [],
    completion_date: '',
    payment_plan: '',
    floor_plan: '',
    units: []
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      toast({ title: 'Hata', description: 'Projeler yüklenemedi', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadAPI.uploadImage(token, file);
      const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${result.url}`;
      setFormData({ ...formData, image: fullUrl });
      toast({ title: 'Başarılı', description: 'Görsel yüklendi' });
    } catch (error) {
      toast({ title: 'Hata', description: 'Görsel yüklenemedi', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectsAPI.update(token, editingProject.id, formData);
        toast({ title: 'Başarılı', description: 'Proje güncellendi' });
      } else {
        await projectsAPI.create(token, formData);
        toast({ title: 'Başarılı', description: 'Proje eklendi' });
      }
      setDialogOpen(false);
      resetForm();
      loadProjects();
    } catch (error) {
      toast({ title: 'Hata', description: 'İşlem başarısız', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;
    
    try {
      await projectsAPI.delete(token, id);
      toast({ title: 'Başarılı', description: 'Proje silindi' });
      loadProjects();
    } catch (error) {
      toast({ title: 'Hata', description: 'Proje silinemedi', variant: 'destructive' });
    }
  };

  const openEditDialog = (project) => {
    setEditingProject(project);
    setFormData(project);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      type: 'Rezidans',
      status: 'ongoing',
      image: '',
      images: [],
      description: '',
      price: '',
      features: [],
      completion_date: '',
      payment_plan: '',
      floor_plan: '',
      units: []
    });
    setEditingProject(null);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Projeler</h1>
          <p className="text-slate-600">Tüm projeleri yönetin</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Proje
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-slate-200">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{project.title}</h3>
                <span className={`px-2 py-1 rounded text-xs ${project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-2">{project.location}</p>
              <p className="text-amber-600 font-semibold mb-4">{project.price}</p>
              <div className="flex gap-2">
                <Button onClick={() => openEditDialog(project)} variant="outline" size="sm" className="flex-1">
                  <Pencil className="w-4 h-4 mr-1" />
                  Düzenle
                </Button>
                <Button onClick={() => handleDelete(project.id)} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Proje Düzenle' : 'Yeni Proje Ekle'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Proje Adı *</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <Label>Lokasyon *</Label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Tip *</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rezidans">Rezidans</SelectItem>
                    <SelectItem value="Apartman">Apartman</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Ticari">Ticari</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Durum *</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Tamamlandı</SelectItem>
                    <SelectItem value="ongoing">Devam Ediyor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Teslim Tarihi *</Label>
                <Input value={formData.completion_date} onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })} required placeholder="2025" />
              </div>
            </div>

            <div>
              <Label>Fiyat Aralığı *</Label>
              <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required placeholder="₺5.000.000 - ₺8.000.000" />
            </div>

            <div>
              <Label>Açıklama *</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} />
            </div>

            <div>
              <Label>Özellikler (virgülle ayırın) *</Label>
              <Input 
                value={formData.features.join(', ')} 
                onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()) })} 
                placeholder="Deniz Manzarası, Kapalı Havuz, Spor Salonu"
                required
              />
            </div>

            <div>
              <Label>Ödeme Planı</Label>
              <Textarea 
                value={formData.payment_plan || ''} 
                onChange={(e) => setFormData({ ...formData, payment_plan: e.target.value })} 
                placeholder="Ödeme planı detaylarını buraya yazın..."
                rows={4}
              />
            </div>

            <div>
              <Label>Kat Planı Görseli</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input type="file" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setUploading(true);
                      uploadAPI.uploadImage(token, file)
                        .then(result => {
                          const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${result.url}`;
                          setFormData({ ...formData, floor_plan: fullUrl });
                          toast({ title: 'Başarılı', description: 'Kat planı yüklendi' });
                        })
                        .catch(() => toast({ title: 'Hata', description: 'Yüklenemedi', variant: 'destructive' }))
                        .finally(() => setUploading(false));
                    }
                  }} accept="image/*" disabled={uploading} className="flex-1" />
                </div>
                <Input value={formData.floor_plan || ''} onChange={(e) => setFormData({ ...formData, floor_plan: e.target.value })} placeholder="veya Kat planı URL'si" />
                {formData.floor_plan && <img src={formData.floor_plan} alt="Floor Plan" className="w-full h-32 object-contain rounded bg-slate-50" />}
              </div>
            </div>

            <div>
              <Label>Ek Görseller (virgülle ayırın)</Label>
              <Textarea 
                value={formData.images?.join(', ') || ''} 
                onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',').map(url => url.trim()).filter(url => url) })} 
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows={2}
              />
              <p className="text-xs text-slate-500 mt-1">Galeri için ek görseller ekleyin (URL'ler virgülle ayrılmalı)</p>
            </div>

            <div>
              <Label>Görsel</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input type="file" onChange={handleImageUpload} accept="image/*" disabled={uploading} className="flex-1" />
                  <span className="text-sm text-slate-500">veya</span>
                </div>
                <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="Görsel URL'si" />
                {formData.image && <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded" />}
              </div>
            </div>

            <div>
              <Label>Daireler (JSON formatında)</Label>
              <Textarea 
                value={formData.units ? JSON.stringify(formData.units, null, 2) : '[]'} 
                onChange={(e) => {
                  try {
                    const units = JSON.parse(e.target.value);
                    setFormData({ ...formData, units });
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }} 
                placeholder='[{"unit_number":"A1","floor":1,"rooms":"2+1","area_m2":120,"price":"₺5.500.000","status":"available"}]'
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Örnek: {`[{"unit_number":"A1","floor":1,"rooms":"2+1","area_m2":120,"price":"₺5.500.000","status":"available"}]`}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600">
                {editingProject ? 'Güncelle' : 'Ekle'}
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

export default AdminProjects;
