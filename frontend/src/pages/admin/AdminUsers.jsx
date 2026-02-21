import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Plus, Trash2, User, Mail, Calendar, Key, Lock } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const AdminUsers = () => {
  const { token, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await authAPI.getUsers(token);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.register(formData.username, formData.email, formData.password);
      toast({ title: 'Başarılı', description: 'Kullanıcı oluşturuldu' });
      setDialogOpen(false);
      setFormData({ username: '', email: '', password: '' });
      loadUsers();
    } catch (error) {
      toast({ title: 'Hata', description: error.response?.data?.detail || 'Kullanıcı oluşturulamadı', variant: 'destructive' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: 'Hata', description: 'Yeni şifreler eşleşmiyor', variant: 'destructive' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({ title: 'Hata', description: 'Şifre en az 6 karakter olmalıdır', variant: 'destructive' });
      return;
    }
    
    try {
      await authAPI.changePassword(token, passwordData.currentPassword, passwordData.newPassword);
      toast({ title: 'Başarılı', description: 'Şifreniz değiştirildi' });
      setPasswordDialogOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({ title: 'Hata', description: error.response?.data?.detail || 'Şifre değiştirilemedi', variant: 'destructive' });
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    try {
      await authAPI.deleteUser(token, userId);
      toast({ title: 'Başarılı', description: 'Kullanıcı silindi' });
      loadUsers();
    } catch (error) {
      toast({ title: 'Hata', description: error.response?.data?.detail || 'Kullanıcı silinemedi', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Kullanıcı Yönetimi</h1>
        <div className="flex gap-2">
          <Button onClick={() => setPasswordDialogOpen(true)} variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
            <Key className="w-4 h-4 mr-2" /> Şifre Değiştir
          </Button>
          <Button onClick={() => setDialogOpen(true)} className="bg-amber-500 hover:bg-amber-600">
            <Plus className="w-4 h-4 mr-2" /> Yeni Kullanıcı
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-amber-600" />
                </div>
                {user.username !== currentUser?.username && (
                  <Button onClick={() => handleDelete(user.id)} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <h3 className="font-bold text-lg mb-2">{user.username}</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(user.created_at).toLocaleDateString('tr-TR')}
                </div>
              </div>
              {user.username === currentUser?.username && (
                <div className="mt-3 px-2 py-1 bg-green-100 text-green-700 text-xs rounded text-center">
                  Aktif Kullanıcı
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Yeni Kullanıcı Ekle</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Kullanıcı Adı *</Label><Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required /></div>
            <div><Label>E-posta *</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
            <div><Label>Şifre *</Label><Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} /></div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600">Kullanıcı Ekle</Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Lock className="w-5 h-5" /> Şifre Değiştir</DialogTitle></DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label>Mevcut Şifre *</Label>
              <Input 
                type="password" 
                value={passwordData.currentPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
                required 
                placeholder="Mevcut şifrenizi girin"
              />
            </div>
            <div>
              <Label>Yeni Şifre *</Label>
              <Input 
                type="password" 
                value={passwordData.newPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                required 
                minLength={6}
                placeholder="En az 6 karakter"
              />
            </div>
            <div>
              <Label>Yeni Şifre (Tekrar) *</Label>
              <Input 
                type="password" 
                value={passwordData.confirmPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                required 
                minLength={6}
                placeholder="Yeni şifreyi tekrar girin"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600">Şifreyi Değiştir</Button>
              <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)}>İptal</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
