import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Image, Home, MapPin, DollarSign, Eye, EyeOff, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { resaleAPI, cloudinaryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const AdminResale = () => {
  const { token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    property_type: 'Daire',
    listing_type: 'sale',
    location: 'Antalya',
    district: '',
    address: '',
    price: '',
    area_m2: '',
    rooms: '',
    bathrooms: '',
    floor: '',
    building_age: '',
    has_elevator: false,
    parking: '',
    heating: '',
    features: [],
    description: '',
    image: '',
    images: [],
    is_active: true
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await resaleAPI.getAll(null, null, null, false);
      setListings(data);
    } catch (error) {
      toast.error('İlanlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingListing) {
        await resaleAPI.update(token, editingListing.id, formData);
        toast.success('İlan güncellendi');
      } else {
        await resaleAPI.create(token, formData);
        toast.success('İlan eklendi');
      }
      fetchListings();
      resetForm();
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    try {
      await resaleAPI.delete(token, id);
      toast.success('İlan silindi');
      fetchListings();
    } catch (error) {
      toast.error('Silme işlemi başarısız');
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData(listing);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingListing(null);
    setFormData({
      title: '',
      property_type: 'Daire',
      listing_type: 'sale',
      location: 'Antalya',
      district: '',
      address: '',
      price: '',
      area_m2: '',
      rooms: '',
      bathrooms: '',
      floor: '',
      building_age: '',
      has_elevator: false,
      parking: '',
      heating: '',
      features: [],
      description: '',
      image: '',
      images: [],
      is_active: true
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const signatureData = await cloudinaryAPI.getSignature(token, 'resale');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('api_key', signatureData.api_key);
      formDataUpload.append('timestamp', signatureData.timestamp);
      formDataUpload.append('signature', signatureData.signature);
      formDataUpload.append('folder', signatureData.folder);
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`, {
        method: 'POST',
        body: formDataUpload
      });
      
      const data = await response.json();
      setFormData({ ...formData, image: data.secure_url });
      toast.success('Görsel yüklendi');
    } catch (error) {
      toast.error('Görsel yüklenemedi');
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Güncel İlanlar (2. El)</h1>
          <p className="text-slate-500">Satılık ve kiralık ilanları yönetin</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="w-4 h-4 mr-2" />
          Yeni İlan
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="İlan ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingListing ? 'İlan Düzenle' : 'Yeni İlan Ekle'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">İlan Başlığı *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Örn: Konyaaltı'nda Deniz Manzaralı 3+1 Daire"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Mülk Tipi</label>
                    <select
                      value={formData.property_type}
                      onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Daire">Daire</option>
                      <option value="Villa">Villa</option>
                      <option value="Arsa">Arsa</option>
                      <option value="Dükkan">Dükkan</option>
                      <option value="Ofis">Ofis</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">İlan Tipi</label>
                    <select
                      value={formData.listing_type}
                      onChange={(e) => setFormData({ ...formData, listing_type: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="sale">Satılık</option>
                      <option value="rent">Kiralık</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">İlçe *</label>
                    <select
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
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
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Fiyat *</label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="₺3.500.000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Alan (m²)</label>
                    <input
                      type="number"
                      value={formData.area_m2}
                      onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="120"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Oda Sayısı</label>
                    <select
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Seçiniz</option>
                      <option value="1+0">1+0</option>
                      <option value="1+1">1+1</option>
                      <option value="2+1">2+1</option>
                      <option value="3+1">3+1</option>
                      <option value="4+1">4+1</option>
                      <option value="5+1">5+1</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Açıklama</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="İlan hakkında detaylı bilgi..."
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Kapak Görseli</label>
                    <div className="flex gap-4 items-center">
                      {formData.image && (
                        <img src={formData.image} alt="Kapak" className="w-24 h-24 object-cover rounded-lg" />
                      )}
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Görsel Yükle
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_active">İlan Aktif</label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>İptal</Button>
                  <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                    {editingListing ? 'Güncelle' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Listings Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="relative h-48">
                {listing.image ? (
                  <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <Home className="w-12 h-12 text-slate-400" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge className={listing.listing_type === 'sale' ? 'bg-green-500' : 'bg-blue-500'}>
                    {listing.listing_type === 'sale' ? 'Satılık' : 'Kiralık'}
                  </Badge>
                  {!listing.is_active && <Badge className="bg-red-500">Pasif</Badge>}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{listing.title}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3" />
                  {listing.district}, {listing.location}
                </p>
                <p className="text-lg font-bold text-amber-600 mb-3">{listing.price}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(listing)}>
                    <Pencil className="w-3 h-3 mr-1" />
                    Düzenle
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDelete(listing.id)}>
                    <Trash2 className="w-3 h-3 mr-1" />
                    Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!loading && filteredListings.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Henüz ilan bulunmuyor</p>
        </div>
      )}
    </div>
  );
};

export default AdminResale;
