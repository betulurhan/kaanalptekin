import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { contentAPI } from '../../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Save } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

export const AdminContent = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState({});
  const [contactData, setContactData] = useState({});
  const [heroData, setHeroData] = useState({});

  useEffect(() => { loadContent(); }, []);

  const loadContent = async () => {
    try {
      const [about, contact, hero] = await Promise.all([
        contentAPI.getAbout(),
        contentAPI.getContact(),
        contentAPI.getHero()
      ]);
      setAboutData(about);
      setContactData(contact);
      setHeroData(hero);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.updateAbout(token, aboutData);
      toast({ title: 'Başarılı', description: 'Hakkımda güncellendi' });
    } catch (error) {
      toast({ title: 'Hata', description: 'Güncellenemedi', variant: 'destructive' });
    }
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.updateContact(token, contactData);
      toast({ title: 'Başarılı', description: 'İletişim bilgileri güncellendi' });
    } catch (error) {
      toast({ title: 'Hata', description: 'Güncellenemedi', variant: 'destructive' });
    }
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.updateHero(token, heroData);
      toast({ title: 'Başarılı', description: 'Ana sayfa güncellendi' });
    } catch (error) {
      toast({ title: 'Hata', description: 'Güncellenemedi', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">İçerik Yönetimi</h1>
      
      <Tabs defaultValue="hero">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Ana Sayfa</TabsTrigger>
          <TabsTrigger value="about">Hakkımda</TabsTrigger>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card><CardHeader><CardTitle>Ana Sayfa Hero Bölümü</CardTitle></CardHeader><CardContent>
            <form onSubmit={handleSaveHero} className="space-y-4">
              <div><Label>Başlık</Label><Input value={heroData.title || ''} onChange={(e) => setHeroData({ ...heroData, title: e.target.value })} /></div>
              <div><Label>Alt Başlık</Label><Input value={heroData.subtitle || ''} onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })} /></div>
              <div><Label>Açıklama</Label><Textarea value={heroData.description || ''} onChange={(e) => setHeroData({ ...heroData, description: e.target.value })} rows={3} /></div>
              <div><Label>Arka Plan Görseli URL</Label><Input value={heroData.image || ''} onChange={(e) => setHeroData({ ...heroData, image: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Birincil Buton Metni</Label><Input value={heroData.cta_primary_text || ''} onChange={(e) => setHeroData({ ...heroData, cta_primary_text: e.target.value })} /></div>
                <div><Label>İkincil Buton Metni</Label><Input value={heroData.cta_secondary_text || ''} onChange={(e) => setHeroData({ ...heroData, cta_secondary_text: e.target.value })} /></div>
              </div>
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600"><Save className="w-4 h-4 mr-2" /> Kaydet</Button>
            </form>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="about">
          <Card><CardHeader><CardTitle>Hakkımda İçeriği</CardTitle></CardHeader><CardContent>
            <form onSubmit={handleSaveAbout} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Ad Soyad</Label><Input value={aboutData.name || ''} onChange={(e) => setAboutData({ ...aboutData, name: e.target.value })} /></div>
                <div><Label>Unvan</Label><Input value={aboutData.title || ''} onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })} /></div>
              </div>
              <div><Label>Kısa Biyografi</Label><Textarea value={aboutData.short_bio || ''} onChange={(e) => setAboutData({ ...aboutData, short_bio: e.target.value })} rows={2} /></div>
              <div><Label>Detaylı Biyografi</Label><Textarea value={aboutData.full_bio || ''} onChange={(e) => setAboutData({ ...aboutData, full_bio: e.target.value })} rows={6} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Deneyim</Label><Input value={aboutData.experience || ''} onChange={(e) => setAboutData({ ...aboutData, experience: e.target.value })} /></div>
                <div><Label>Proje Sayısı</Label><Input value={aboutData.completed_projects || ''} onChange={(e) => setAboutData({ ...aboutData, completed_projects: e.target.value })} /></div>
                <div><Label>Müşteri Sayısı</Label><Input value={aboutData.happy_clients || ''} onChange={(e) => setAboutData({ ...aboutData, happy_clients: e.target.value })} /></div>
              </div>
              <div><Label>Profil Görseli URL</Label><Input value={aboutData.image || ''} onChange={(e) => setAboutData({ ...aboutData, image: e.target.value })} /></div>
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600"><Save className="w-4 h-4 mr-2" /> Kaydet</Button>
            </form>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card><CardHeader><CardTitle>İletişim Bilgileri</CardTitle></CardHeader><CardContent>
            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Telefon</Label><Input value={contactData.phone || ''} onChange={(e) => setContactData({ ...contactData, phone: e.target.value })} /></div>
                <div><Label>E-posta</Label><Input type="email" value={contactData.email || ''} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} /></div>
              </div>
              <div><Label>Adres</Label><Input value={contactData.address || ''} onChange={(e) => setContactData({ ...contactData, address: e.target.value })} /></div>
              <div><Label>Çalışma Saatleri</Label><Input value={contactData.working_hours || ''} onChange={(e) => setContactData({ ...contactData, working_hours: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Facebook URL</Label><Input value={contactData.facebook || ''} onChange={(e) => setContactData({ ...contactData, facebook: e.target.value })} /></div>
                <div><Label>Instagram URL</Label><Input value={contactData.instagram || ''} onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })} /></div>
                <div><Label>LinkedIn URL</Label><Input value={contactData.linkedin || ''} onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })} /></div>
                <div><Label>Twitter URL</Label><Input value={contactData.twitter || ''} onChange={(e) => setContactData({ ...contactData, twitter: e.target.value })} /></div>
              </div>
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600"><Save className="w-4 h-4 mr-2" /> Kaydet</Button>
            </form>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
