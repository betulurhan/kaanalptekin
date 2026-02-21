import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { contentAPI, uploadAPI } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Save, Upload, Image as ImageIcon, Plus, Trash2, Home, Key, Building2, MapPin, Users, Award, Star, Phone, CheckCircle2, Shield } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const AdminContent = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ hero: false, about: false, navbar_logo: false, footer_logo: false });
  const [aboutData, setAboutData] = useState({});
  const [contactData, setContactData] = useState({});
  const [heroData, setHeroData] = useState({});
  const [siteSettings, setSiteSettings] = useState({
    site_name: 'GayrimenkulRehberi',
    navbar_logo: null,
    footer_logo: null
  });
  const [heroFeatures, setHeroFeatures] = useState({
    badge_text: 'Profesyonel Gayrimenkul Danışmanlığı',
    secondary_cta_text: 'Bize Ulaşın',
    secondary_cta_link: '/iletisim',
    trust_indicators: [],
    card_title: 'Hızlı Değerleme',
    card_subtitle: 'Ücretsiz mülk değerlendirme',
    features: [],
    cta_text: 'Projeleri Keşfet',
    cta_link: '/projeler',
    stats_count: '500+',
    stats_label: 'Mutlu Müşteri',
    rating: '4.9/5',
    rating_label: 'Müşteri Puanı'
  });

  const iconOptions = [
    { value: 'home', label: 'Ev', icon: Home },
    { value: 'key', label: 'Anahtar', icon: Key },
    { value: 'building', label: 'Bina', icon: Building2 },
    { value: 'map-pin', label: 'Konum', icon: MapPin },
    { value: 'users', label: 'Kullanıcılar', icon: Users },
    { value: 'award', label: 'Ödül', icon: Award },
    { value: 'star', label: 'Yıldız', icon: Star },
    { value: 'phone', label: 'Telefon', icon: Phone }
  ];

  const trustIconOptions = [
    { value: 'check-circle', label: 'Onay', icon: CheckCircle2 },
    { value: 'shield', label: 'Kalkan', icon: Shield },
    { value: 'award', label: 'Ödül', icon: Award },
    { value: 'star', label: 'Yıldız', icon: Star },
    { value: 'users', label: 'Kullanıcılar', icon: Users }
  ];

  const colorOptions = [
    { value: 'green', label: 'Yeşil' },
    { value: 'blue', label: 'Mavi' },
    { value: 'amber', label: 'Turuncu' },
    { value: 'red', label: 'Kırmızı' },
    { value: 'purple', label: 'Mor' }
  ];

  useEffect(() => { loadContent(); }, []);

  const loadContent = async () => {
    try {
      const [about, contact, hero, features, settings] = await Promise.all([
        contentAPI.getAbout(),
        contentAPI.getContact(),
        contentAPI.getHero(),
        contentAPI.getHeroFeatures().catch(() => null),
        contentAPI.getSiteSettings().catch(() => null)
      ]);
      setAboutData(about);
      setContactData(contact);
      setHeroData(hero);
      if (features) setHeroFeatures(features);
      if (settings) setSiteSettings(settings);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, section) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading({ ...uploading, [section]: true });
    try {
      const result = await uploadAPI.uploadImage(token, file);
      const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${result.url}`;
      
      if (section === 'hero') {
        setHeroData({ ...heroData, image: fullUrl });
      } else if (section === 'about') {
        setAboutData({ ...aboutData, image: fullUrl });
      } else if (section === 'navbar_logo') {
        setSiteSettings({ ...siteSettings, navbar_logo: fullUrl });
      } else if (section === 'footer_logo') {
        setSiteSettings({ ...siteSettings, footer_logo: fullUrl });
      }
      
      toast({ title: 'Başarılı', description: 'Görsel yüklendi' });
    } catch (error) {
      toast({ title: 'Hata', description: 'Görsel yüklenemedi', variant: 'destructive' });
    } finally {
      setUploading({ ...uploading, [section]: false });
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

  const handleSaveHeroFeatures = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.updateHeroFeatures(token, heroFeatures);
      toast({ title: 'Başarılı', description: 'Slider özellikleri güncellendi' });
    } catch (error) {
      toast({ title: 'Hata', description: 'Güncellenemedi', variant: 'destructive' });
    }
  };

  const handleSaveSiteSettings = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.updateSiteSettings(token, siteSettings);
      toast({ title: 'Başarılı', description: 'Site ayarları güncellendi' });
    } catch (error) {
      toast({ title: 'Hata', description: 'Güncellenemedi', variant: 'destructive' });
    }
  };

  const addFeature = () => {
    const newFeature = {
      id: Date.now().toString(),
      icon: 'key',
      title: '',
      link: '/projeler',
      order: heroFeatures.features?.length || 0,
      is_active: true
    };
    setHeroFeatures({
      ...heroFeatures,
      features: [...(heroFeatures.features || []), newFeature]
    });
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...heroFeatures.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setHeroFeatures({ ...heroFeatures, features: newFeatures });
  };

  const removeFeature = (index) => {
    const newFeatures = heroFeatures.features.filter((_, i) => i !== index);
    setHeroFeatures({ ...heroFeatures, features: newFeatures });
  };

  const addTrustIndicator = () => {
    const newIndicator = {
      id: Date.now().toString(),
      icon: 'check-circle',
      text: '',
      color: 'green',
      is_active: true
    };
    setHeroFeatures({
      ...heroFeatures,
      trust_indicators: [...(heroFeatures.trust_indicators || []), newIndicator]
    });
  };

  const updateTrustIndicator = (index, field, value) => {
    const newIndicators = [...(heroFeatures.trust_indicators || [])];
    newIndicators[index] = { ...newIndicators[index], [field]: value };
    setHeroFeatures({ ...heroFeatures, trust_indicators: newIndicators });
  };

  const removeTrustIndicator = (index) => {
    const newIndicators = (heroFeatures.trust_indicators || []).filter((_, i) => i !== index);
    setHeroFeatures({ ...heroFeatures, trust_indicators: newIndicators });
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">İçerik Yönetimi</h1>
      
      <Tabs defaultValue="logo">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="hero">Ana Sayfa</TabsTrigger>
          <TabsTrigger value="slider">Slider Özellikleri</TabsTrigger>
          <TabsTrigger value="about">Hakkımda</TabsTrigger>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
        </TabsList>

        <TabsContent value="logo">
          <Card><CardHeader><CardTitle>Logo Yönetimi</CardTitle></CardHeader><CardContent>
            <form onSubmit={handleSaveSiteSettings} className="space-y-6">
              <div>
                <Label>Site Adı</Label>
                <Input 
                  value={siteSettings.site_name || ''} 
                  onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })} 
                  placeholder="GayrimenkulRehberi"
                />
                <p className="text-sm text-slate-500 mt-1">Logo yüklenmezse bu isim gösterilir</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Navbar Logo */}
                <div className="border rounded-lg p-4 bg-slate-50">
                  <Label className="text-lg font-semibold mb-4 block">Üst Menü Logosu (Navbar)</Label>
                  <div className="space-y-3">
                    <Input 
                      value={siteSettings.navbar_logo || ''} 
                      onChange={(e) => setSiteSettings({ ...siteSettings, navbar_logo: e.target.value })} 
                      placeholder="Logo URL'si"
                    />
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('navbar-logo-upload').click()} 
                        disabled={uploading.navbar_logo}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading.navbar_logo ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
                      </Button>
                      {siteSettings.navbar_logo && (
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setSiteSettings({ ...siteSettings, navbar_logo: null })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <input 
                      id="navbar-logo-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e, 'navbar_logo')} 
                    />
                    {siteSettings.navbar_logo ? (
                      <div className="mt-3 p-4 bg-white rounded border">
                        <p className="text-xs text-slate-500 mb-2">Önizleme:</p>
                        <img src={siteSettings.navbar_logo} alt="Navbar Logo" className="h-12 w-auto object-contain" />
                      </div>
                    ) : (
                      <div className="mt-3 p-4 bg-white rounded border text-center text-slate-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Logo yüklenmedi</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Logo */}
                <div className="border rounded-lg p-4 bg-slate-50">
                  <Label className="text-lg font-semibold mb-4 block">Alt Kısım Logosu (Footer)</Label>
                  <div className="space-y-3">
                    <Input 
                      value={siteSettings.footer_logo || ''} 
                      onChange={(e) => setSiteSettings({ ...siteSettings, footer_logo: e.target.value })} 
                      placeholder="Logo URL'si"
                    />
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('footer-logo-upload').click()} 
                        disabled={uploading.footer_logo}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading.footer_logo ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
                      </Button>
                      {siteSettings.footer_logo && (
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setSiteSettings({ ...siteSettings, footer_logo: null })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <input 
                      id="footer-logo-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e, 'footer_logo')} 
                    />
                    {siteSettings.footer_logo ? (
                      <div className="mt-3 p-4 bg-slate-800 rounded border">
                        <p className="text-xs text-slate-400 mb-2">Önizleme (koyu arka plan):</p>
                        <img src={siteSettings.footer_logo} alt="Footer Logo" className="h-12 w-auto object-contain" />
                      </div>
                    ) : (
                      <div className="mt-3 p-4 bg-white rounded border text-center text-slate-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Logo yüklenmedi</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600"><Save className="w-4 h-4 mr-2" /> Kaydet</Button>
            </form>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card><CardHeader><CardTitle>Ana Sayfa Hero Bölümü</CardTitle></CardHeader><CardContent>
            <form onSubmit={handleSaveHero} className="space-y-4">
              <div><Label>Başlık</Label><Input value={heroData.title || ''} onChange={(e) => setHeroData({ ...heroData, title: e.target.value })} /></div>
              <div><Label>Alt Başlık</Label><Input value={heroData.subtitle || ''} onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })} /></div>
              <div><Label>Açıklama</Label><Textarea value={heroData.description || ''} onChange={(e) => setHeroData({ ...heroData, description: e.target.value })} rows={3} /></div>
              <div><Label>Arka Plan Görseli URL</Label><Input value={heroData.image || ''} onChange={(e) => setHeroData({ ...heroData, image: e.target.value })} />
                <div className="mt-2 flex gap-2">
                  <Button type="button" variant="outline" onClick={() => document.getElementById('hero-image-upload').click()} disabled={uploading.hero}>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading.hero ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
                  </Button>
                  <input id="hero-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'hero')} />
                </div>
                {heroData.image && <img src={heroData.image} alt="Hero" className="mt-2 w-full h-32 object-cover rounded" />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Birincil Buton Metni</Label><Input value={heroData.cta_primary_text || ''} onChange={(e) => setHeroData({ ...heroData, cta_primary_text: e.target.value })} /></div>
                <div><Label>İkincil Buton Metni</Label><Input value={heroData.cta_secondary_text || ''} onChange={(e) => setHeroData({ ...heroData, cta_secondary_text: e.target.value })} /></div>
              </div>
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600"><Save className="w-4 h-4 mr-2" /> Kaydet</Button>
            </form>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="slider">
          <Card><CardHeader><CardTitle>Slider Tüm Özellikleri</CardTitle></CardHeader><CardContent>
            <form onSubmit={handleSaveHeroFeatures} className="space-y-6">
              
              {/* Badge & Secondary CTA */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <Label className="text-lg font-semibold mb-4 block">Sol Üst Badge & İkinci Buton</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label>Badge Metni</Label><Input value={heroFeatures.badge_text || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, badge_text: e.target.value })} placeholder="Profesyonel Gayrimenkul Danışmanlığı" /></div>
                  <div><Label>İkinci Buton Metni</Label><Input value={heroFeatures.secondary_cta_text || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, secondary_cta_text: e.target.value })} placeholder="Bize Ulaşın" /></div>
                  <div><Label>İkinci Buton Linki</Label><Input value={heroFeatures.secondary_cta_link || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, secondary_cta_link: e.target.value })} placeholder="/iletisim" /></div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-semibold">Güven Göstergeleri (Sol Alt)</Label>
                  <Button type="button" size="sm" onClick={addTrustIndicator} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-1" /> Gösterge Ekle
                  </Button>
                </div>
                
                {(heroFeatures.trust_indicators || []).length > 0 ? (
                  <div className="space-y-3">
                    {(heroFeatures.trust_indicators || []).map((indicator, index) => (
                      <div key={indicator.id || index} className="grid grid-cols-[100px_1fr_100px_auto] gap-3 p-3 bg-white rounded border">
                        <div>
                          <Label className="text-xs text-slate-500">İkon</Label>
                          <Select value={indicator.icon} onValueChange={(val) => updateTrustIndicator(index, 'icon', val)}>
                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {trustIconOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <span className="flex items-center gap-2">
                                    <opt.icon className="w-4 h-4" /> {opt.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">Metin</Label>
                          <Input value={indicator.text} onChange={(e) => updateTrustIndicator(index, 'text', e.target.value)} placeholder="Lisanslı Danışman" className="h-9" />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">Renk</Label>
                          <Select value={indicator.color} onValueChange={(val) => updateTrustIndicator(index, 'color', val)}>
                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {colorOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 h-9" onClick={() => removeTrustIndicator(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-slate-500">Henüz güven göstergesi eklenmedi</p>
                )}
              </div>

              {/* Card Header */}
              <div className="border rounded-lg p-4 bg-amber-50">
                <Label className="text-lg font-semibold mb-4 block">Sağ Kart Başlık</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Kart Başlığı</Label><Input value={heroFeatures.card_title || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, card_title: e.target.value })} placeholder="Hızlı Değerleme" /></div>
                  <div><Label>Kart Alt Başlığı</Label><Input value={heroFeatures.card_subtitle || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, card_subtitle: e.target.value })} placeholder="Ücretsiz mülk değerlendirme" /></div>
                </div>
              </div>

              {/* Feature Links */}
              <div className="border rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-semibold">Tıklanabilir Özellik Linkleri (Kart İçi)</Label>
                  <Button type="button" size="sm" onClick={addFeature} className="bg-amber-500 hover:bg-amber-600">
                    <Plus className="w-4 h-4 mr-1" /> Link Ekle
                  </Button>
                </div>
                
                {heroFeatures.features?.length > 0 ? (
                  <div className="space-y-3">
                    {heroFeatures.features.map((feature, index) => (
                      <div key={feature.id || index} className="grid grid-cols-[100px_1fr_1fr_auto] gap-3 p-3 bg-white rounded border">
                        <div>
                          <Label className="text-xs text-slate-500">İkon</Label>
                          <Select value={feature.icon} onValueChange={(val) => updateFeature(index, 'icon', val)}>
                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {iconOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <span className="flex items-center gap-2">
                                    <opt.icon className="w-4 h-4" /> {opt.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">Başlık</Label>
                          <Input value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} placeholder="Satılık & Kiralık Portföy" className="h-9" />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">Link</Label>
                          <Input value={feature.link} onChange={(e) => updateFeature(index, 'link', e.target.value)} placeholder="/projeler" className="h-9" />
                        </div>
                        <div className="flex items-end">
                          <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 h-9" onClick={() => removeFeature(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-slate-500">Henüz link eklenmedi</p>
                )}
              </div>

              {/* CTA Button */}
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Buton Metni</Label><Input value={heroFeatures.cta_text || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, cta_text: e.target.value })} placeholder="Projeleri Keşfet" /></div>
                <div><Label>Buton Linki</Label><Input value={heroFeatures.cta_link || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, cta_link: e.target.value })} placeholder="/projeler" /></div>
              </div>

              {/* Stats & Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-green-50">
                  <Label className="font-semibold mb-2 block">Sol Alt İstatistik</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Sayı</Label><Input value={heroFeatures.stats_count || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, stats_count: e.target.value })} placeholder="500+" /></div>
                    <div><Label className="text-xs">Etiket</Label><Input value={heroFeatures.stats_label || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, stats_label: e.target.value })} placeholder="Mutlu Müşteri" /></div>
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-amber-50">
                  <Label className="font-semibold mb-2 block">Sağ Üst Puan</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Puan</Label><Input value={heroFeatures.rating || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, rating: e.target.value })} placeholder="4.9/5" /></div>
                    <div><Label className="text-xs">Etiket</Label><Input value={heroFeatures.rating_label || ''} onChange={(e) => setHeroFeatures({ ...heroFeatures, rating_label: e.target.value })} placeholder="Müşteri Puanı" /></div>
                  </div>
                </div>
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
              <div><Label>Profil Görseli URL</Label><Input value={aboutData.image || ''} onChange={(e) => setAboutData({ ...aboutData, image: e.target.value })} />
                <div className="mt-2 flex gap-2">
                  <Button type="button" variant="outline" onClick={() => document.getElementById('about-image-upload').click()} disabled={uploading.about}>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading.about ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
                  </Button>
                  <input id="about-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'about')} />
                </div>
                {aboutData.image && <img src={aboutData.image} alt="Profile" className="mt-2 w-full h-32 object-cover rounded" />}
              </div>
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
