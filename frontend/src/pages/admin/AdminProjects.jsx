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
import { Plus, Pencil, Trash2, Upload, X, Home, Building2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
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
    floor_plans: [],
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
    // Handle migration from old floor_plan to floor_plans
    const updatedProject = {
      ...project,
      floor_plans: project.floor_plans || (project.floor_plan ? [project.floor_plan] : [])
    };
    setFormData(updatedProject);
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
      floor_plans: [],
      units: []
    });
    setEditingProject(null);
  };

  const handleMultipleImageUpload = async (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadAPI.uploadImage(token, file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(result => `${process.env.REACT_APP_BACKEND_URL}${result.url}`);
      
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), ...newUrls]
      }));
      toast({ title: 'Başarılı', description: `${files.length} görsel yüklendi` });
    } catch (error) {
      toast({ title: 'Hata', description: 'Görseller yüklenemedi', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
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
              <Label>Kat Planları</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input 
                    type="file" 
                    multiple
                    onChange={(e) => handleMultipleImageUpload(e, 'floor_plans')} 
                    accept="image/*" 
                    disabled={uploading} 
                    className="flex-1" 
                  />
                  {uploading && <span className="text-sm text-slate-500">Yükleniyor...</span>}
                </div>
                <p className="text-xs text-slate-500">Birden fazla kat planı seçebilirsiniz</p>
                
                {formData.floor_plans && formData.floor_plans.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {formData.floor_plans.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Kat Planı ${index + 1}`} className="w-full h-24 object-contain rounded bg-slate-100 border" />
                        <button
                          type="button"
                          onClick={() => removeImage('floor_plans', index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Proje Görselleri (Galeri)</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input 
                    type="file" 
                    multiple
                    onChange={(e) => handleMultipleImageUpload(e, 'images')} 
                    accept="image/*" 
                    disabled={uploading} 
                    className="flex-1" 
                  />
                  {uploading && <span className="text-sm text-slate-500">Yükleniyor...</span>}
                </div>
                <p className="text-xs text-slate-500">Birden fazla proje görseli seçebilirsiniz</p>
                
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Görsel ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={() => removeImage('images', index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

            {/* Unit Management Section */}
            <div className="border rounded-lg p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-600" />
                  <Label className="text-lg font-semibold">Daire Yönetimi</Label>
                </div>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={() => {
                    const newUnit = {
                      unit_number: '',
                      floor: 1,
                      rooms: '2+1',
                      area_m2: 0,
                      price: '',
                      status: 'available'
                    };
                    setFormData({ ...formData, units: [...(formData.units || []), newUnit] });
                  }}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Daire Ekle
                </Button>
              </div>

              {formData.units && formData.units.length > 0 ? (
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="hidden lg:grid lg:grid-cols-[1fr_0.7fr_0.7fr_0.7fr_1.2fr_1fr_0.5fr] gap-2 px-3 py-2 bg-slate-800 text-white text-sm font-medium rounded-t">
                    <div>Daire No</div>
                    <div>Kat</div>
                    <div>Tip</div>
                    <div>m²</div>
                    <div>Fiyat</div>
                    <div>Durum</div>
                    <div>İşlem</div>
                  </div>
                  
                  {/* Unit Rows */}
                  {formData.units.map((unit, index) => (
                    <div key={index} className="grid grid-cols-2 lg:grid-cols-[1fr_0.7fr_0.7fr_0.7fr_1.2fr_1fr_0.5fr] gap-2 p-3 bg-white rounded border hover:shadow-md transition-shadow">
                      <div>
                        <Label className="lg:hidden text-xs text-slate-500">Daire No</Label>
                        <Input 
                          value={unit.unit_number || ''} 
                          onChange={(e) => {
                            const newUnits = [...formData.units];
                            newUnits[index] = { ...newUnits[index], unit_number: e.target.value };
                            setFormData({ ...formData, units: newUnits });
                          }}
                          placeholder="A1"
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="lg:hidden text-xs text-slate-500">Kat</Label>
                        <Input 
                          type="number"
                          value={unit.floor || ''} 
                          onChange={(e) => {
                            const newUnits = [...formData.units];
                            newUnits[index] = { ...newUnits[index], floor: parseInt(e.target.value) || 0 };
                            setFormData({ ...formData, units: newUnits });
                          }}
                          placeholder="1"
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="lg:hidden text-xs text-slate-500">Tip</Label>
                        <Select 
                          value={unit.rooms || '2+1'} 
                          onValueChange={(val) => {
                            const newUnits = [...formData.units];
                            newUnits[index] = { ...newUnits[index], rooms: val };
                            setFormData({ ...formData, units: newUnits });
                          }}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1+0">1+0</SelectItem>
                            <SelectItem value="1+1">1+1</SelectItem>
                            <SelectItem value="2+1">2+1</SelectItem>
                            <SelectItem value="3+1">3+1</SelectItem>
                            <SelectItem value="4+1">4+1</SelectItem>
                            <SelectItem value="5+1">5+1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="lg:hidden text-xs text-slate-500">m²</Label>
                        <Input 
                          type="number"
                          value={unit.area_m2 || ''} 
                          onChange={(e) => {
                            const newUnits = [...formData.units];
                            newUnits[index] = { ...newUnits[index], area_m2: parseFloat(e.target.value) || 0 };
                            setFormData({ ...formData, units: newUnits });
                          }}
                          placeholder="120"
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="lg:hidden text-xs text-slate-500">Fiyat</Label>
                        <Input 
                          value={unit.price || ''} 
                          onChange={(e) => {
                            const newUnits = [...formData.units];
                            newUnits[index] = { ...newUnits[index], price: e.target.value };
                            setFormData({ ...formData, units: newUnits });
                          }}
                          placeholder="₺5.500.000"
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="lg:hidden text-xs text-slate-500">Durum</Label>
                        <Select 
                          value={unit.status || 'available'} 
                          onValueChange={(val) => {
                            const newUnits = [...formData.units];
                            newUnits[index] = { ...newUnits[index], status: val };
                            setFormData({ ...formData, units: newUnits });
                          }}
                        >
                          <SelectTrigger className={`h-9 ${unit.status === 'sold' ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Satışta
                              </span>
                            </SelectItem>
                            <SelectItem value="sold">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                Satıldı
                              </span>
                            </SelectItem>
                            <SelectItem value="reserved">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                Rezerve
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 h-9 w-full lg:w-auto"
                          onClick={() => {
                            const newUnits = formData.units.filter((_, i) => i !== index);
                            setFormData({ ...formData, units: newUnits });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="lg:hidden ml-1">Sil</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Summary */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    <Badge variant="secondary" className="bg-slate-200">
                      Toplam: {formData.units.length} daire
                    </Badge>
                    <Badge className="bg-green-100 text-green-700">
                      Satışta: {formData.units.filter(u => u.status === 'available').length}
                    </Badge>
                    <Badge className="bg-red-100 text-red-700">
                      Satıldı: {formData.units.filter(u => u.status === 'sold').length}
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-700">
                      Rezerve: {formData.units.filter(u => u.status === 'reserved').length}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 bg-white rounded border border-dashed">
                  <Home className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Henüz daire eklenmedi</p>
                  <p className="text-sm">Yukarıdaki "Daire Ekle" butonuna tıklayarak başlayın</p>
                </div>
              )}
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
