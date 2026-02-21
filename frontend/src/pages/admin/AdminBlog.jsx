import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { blogAPI, uploadAPI } from '../../services/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const AdminBlog = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '', excerpt: '', content: '', category: 'Piyasa Analizi',
    image: '', author: 'Admin', read_time: '5 dk okuma'
  });

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    try {
      const data = await blogAPI.getAll();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await blogAPI.update(token, editingPost.id, formData);
        toast({ title: 'Başarılı', description: 'Blog güncellendi' });
      } else {
        await blogAPI.create(token, formData);
        toast({ title: 'Başarılı', description: 'Blog eklendi' });
      }
      setDialogOpen(false);
      loadPosts();
    } catch (error) {
      toast({ title: 'Hata', description: 'İşlem başarısız', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Silmek istediğinizden emin misiniz?')) return;
    try {
      await blogAPI.delete(token, id);
      toast({ title: 'Başarılı', description: 'Blog silindi' });
      loadPosts();
    } catch (error) {
      toast({ title: 'Hata', description: 'Silinemedi', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Blog Yönetimi</h1>
        <Button onClick={() => { setFormData({ title: '', excerpt: '', content: '', category: 'Piyasa Analizi', image: '', author: 'Admin', read_time: '5 dk okuma' }); setEditingPost(null); setDialogOpen(true); }} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="w-4 h-4 mr-2" /> Yeni Yazı
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-slate-200">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{post.title}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex gap-2">
                <Button onClick={() => { setEditingPost(post); setFormData(post); setDialogOpen(true); }} variant="outline" size="sm" className="flex-1">
                  <Pencil className="w-4 h-4 mr-1" /> Düzenle
                </Button>
                <Button onClick={() => handleDelete(post.id)} variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPost ? 'Blog Düzenle' : 'Yeni Blog'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Başlık *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div><Label>Kategori *</Label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border rounded-md p-2">
                <option>Piyasa Analizi</option><option>Satın Alma Rehberi</option><option>Yatırım</option><option>Finansman</option>
              </select>
            </div>
            <div><Label>Özet *</Label><Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} required rows={2} /></div>
            <div><Label>İçerik *</Label><Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows={6} /></div>
            <div><Label>Görsel URL</Label><Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Yazar</Label><Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} /></div>
              <div><Label>Okuma Süresi</Label><Input value={formData.read_time} onChange={(e) => setFormData({ ...formData, read_time: e.target.value })} /></div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600">{editingPost ? 'Güncelle' : 'Ekle'}</Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
