import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { contentAPI } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Save, Search, BarChart3, Building2, Globe, FileText } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const AdminSEO = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState({
    site_title: '',
    site_description: '',
    site_keywords: '',
    google_analytics_id: '',
    organization_name: '',
    organization_phone: '',
    organization_email: '',
    organization_address: '',
    home_title: '',
    home_description: '',
    projects_title: '',
    projects_description: '',
    about_title: '',
    about_description: '',
    blog_title: '',
    blog_description: '',
    contact_title: '',
    contact_description: ''
  });

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const data = await contentAPI.getSEOSettings();
      setSeoData(data);
    } catch (error) {
      console.error('Failed to load SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.updateSEOSettings(token, seoData);
      toast({ title: 'Başarılı', description: 'SEO ayarları güncellendi' });
    } catch (error) {
      toast({ title: 'Hata', description: 'Güncellenemedi', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Search className="w-8 h-8 text-amber-500" />
        <div>
          <h1 className="text-3xl font-bold text-slate-800">SEO Ayarları</h1>
          <p className="text-slate-500">Arama motoru optimizasyonu ve Google Analytics</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <Tabs defaultValue="global">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> Genel
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Şirket Bilgisi
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Sayfa SEO
            </TabsTrigger>
          </TabsList>

          {/* Global SEO Tab */}
          <TabsContent value="global">
            <Card>
              <CardHeader>
                <CardTitle>Genel SEO Ayarları</CardTitle>
                <CardDescription>Sitenizin arama motorlarında nasıl görüneceğini belirleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Site Başlığı (Title Tag)</Label>
                  <Input
                    value={seoData.site_title || ''}
                    onChange={(e) => setSeoData({ ...seoData, site_title: e.target.value })}
                    placeholder="Özpınarlar İnşaat Grubu | Gayrimenkul Danışmanlığı"
                  />
                  <p className="text-xs text-slate-500 mt-1">Google arama sonuçlarında görünecek başlık (50-60 karakter önerilir)</p>
                </div>

                <div>
                  <Label>Site Açıklaması (Meta Description)</Label>
                  <Textarea
                    value={seoData.site_description || ''}
                    onChange={(e) => setSeoData({ ...seoData, site_description: e.target.value })}
                    placeholder="15 yıllık deneyimle profesyonel gayrimenkul danışmanlığı..."
                    rows={3}
                  />
                  <p className="text-xs text-slate-500 mt-1">Arama sonuçlarında görünecek açıklama (150-160 karakter önerilir)</p>
                </div>

                <div>
                  <Label>Anahtar Kelimeler (Keywords)</Label>
                  <Textarea
                    value={seoData.site_keywords || ''}
                    onChange={(e) => setSeoData({ ...seoData, site_keywords: e.target.value })}
                    placeholder="gayrimenkul, emlak, konut, satılık daire, kiralık daire..."
                    rows={2}
                  />
                  <p className="text-xs text-slate-500 mt-1">Virgülle ayrılmış anahtar kelimeler</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Google Analytics</CardTitle>
                <CardDescription>Ziyaretçi istatistiklerini takip edin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Google Analytics Measurement ID</Label>
                  <Input
                    value={seoData.google_analytics_id || ''}
                    onChange={(e) => setSeoData({ ...seoData, google_analytics_id: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Google Analytics 4 Measurement ID'nizi girin. 
                    <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline ml-1">
                      analytics.google.com
                    </a> adresinden alabilirsiniz.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Google Analytics Nasıl Kurulur?</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>analytics.google.com adresine gidin</li>
                    <li>Yeni bir "Property" oluşturun</li>
                    <li>Admin → Data Streams → Web seçin</li>
                    <li>Measurement ID'yi (G-XXXXXXXX) kopyalayın</li>
                    <li>Yukarıdaki alana yapıştırın ve kaydedin</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Tab */}
          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle>Şirket Bilgileri (Schema.org)</CardTitle>
                <CardDescription>Google'da zengin sonuçlar için yapısal veri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Şirket Adı</Label>
                    <Input
                      value={seoData.organization_name || ''}
                      onChange={(e) => setSeoData({ ...seoData, organization_name: e.target.value })}
                      placeholder="Özpınarlar İnşaat Grubu"
                    />
                  </div>
                  <div>
                    <Label>Telefon</Label>
                    <Input
                      value={seoData.organization_phone || ''}
                      onChange={(e) => setSeoData({ ...seoData, organization_phone: e.target.value })}
                      placeholder="+90 532 123 45 67"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>E-posta</Label>
                    <Input
                      type="email"
                      value={seoData.organization_email || ''}
                      onChange={(e) => setSeoData({ ...seoData, organization_email: e.target.value })}
                      placeholder="info@ozpinarlar.com"
                    />
                  </div>
                  <div>
                    <Label>Adres / Konum</Label>
                    <Input
                      value={seoData.organization_address || ''}
                      onChange={(e) => setSeoData({ ...seoData, organization_address: e.target.value })}
                      placeholder="Ankara, Türkiye"
                    />
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Bu bilgiler ne işe yarar?</h4>
                  <p className="text-sm text-green-700">
                    Bu bilgiler Google'a sitenizin bir gayrimenkul şirketine ait olduğunu söyler. 
                    Böylece arama sonuçlarında şirket bilgileriniz, telefon numaranız ve adresiniz 
                    zengin snippet olarak görünebilir.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page-specific SEO Tab */}
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Sayfa Bazlı SEO</CardTitle>
                <CardDescription>Her sayfa için özel başlık ve açıklama (boş bırakırsanız genel ayarlar kullanılır)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Home Page */}
                <div className="border rounded-lg p-4 bg-slate-50">
                  <Label className="text-lg font-semibold mb-3 block">🏠 Ana Sayfa</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label className="text-sm">Başlık</Label>
                      <Input
                        value={seoData.home_title || ''}
                        onChange={(e) => setSeoData({ ...seoData, home_title: e.target.value })}
                        placeholder="Ana Sayfa | Özpınarlar İnşaat"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Açıklama</Label>
                      <Input
                        value={seoData.home_description || ''}
                        onChange={(e) => setSeoData({ ...seoData, home_description: e.target.value })}
                        placeholder="Profesyonel gayrimenkul danışmanlığı..."
                      />
                    </div>
                  </div>
                </div>

                {/* Projects Page */}
                <div className="border rounded-lg p-4 bg-slate-50">
                  <Label className="text-lg font-semibold mb-3 block">🏗️ Projeler</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label className="text-sm">Başlık</Label>
                      <Input
                        value={seoData.projects_title || ''}
                        onChange={(e) => setSeoData({ ...seoData, projects_title: e.target.value })}
                        placeholder="Projelerimiz | Özpınarlar İnşaat"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Açıklama</Label>
                      <Input
                        value={seoData.projects_description || ''}
                        onChange={(e) => setSeoData({ ...seoData, projects_description: e.target.value })}
                        placeholder="Tamamlanan ve devam eden projelerimiz..."
                      />
                    </div>
                  </div>
                </div>

                {/* About Page */}
                <div className="border rounded-lg p-4 bg-slate-50">
                  <Label className="text-lg font-semibold mb-3 block">👤 Hakkımda</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label className="text-sm">Başlık</Label>
                      <Input
                        value={seoData.about_title || ''}
                        onChange={(e) => setSeoData({ ...seoData, about_title: e.target.value })}
                        placeholder="Hakkımızda | Özpınarlar İnşaat"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Açıklama</Label>
                      <Input
                        value={seoData.about_description || ''}
                        onChange={(e) => setSeoData({ ...seoData, about_description: e.target.value })}
                        placeholder="15 yıllık tecrübe ile gayrimenkul danışmanlığı..."
                      />
                    </div>
                  </div>
                </div>

                {/* Blog Page */}
                <div className="border rounded-lg p-4 bg-slate-50">
                  <Label className="text-lg font-semibold mb-3 block">📝 Blog</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label className="text-sm">Başlık</Label>
                      <Input
                        value={seoData.blog_title || ''}
                        onChange={(e) => setSeoData({ ...seoData, blog_title: e.target.value })}
                        placeholder="Blog | Gayrimenkul Haberleri"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Açıklama</Label>
                      <Input
                        value={seoData.blog_description || ''}
                        onChange={(e) => setSeoData({ ...seoData, blog_description: e.target.value })}
                        placeholder="Gayrimenkul sektörü hakkında güncel yazılar..."
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Page */}
                <div className="border rounded-lg p-4 bg-slate-50">
                  <Label className="text-lg font-semibold mb-3 block">📞 İletişim</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label className="text-sm">Başlık</Label>
                      <Input
                        value={seoData.contact_title || ''}
                        onChange={(e) => setSeoData({ ...seoData, contact_title: e.target.value })}
                        placeholder="İletişim | Bize Ulaşın"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Açıklama</Label>
                      <Input
                        value={seoData.contact_description || ''}
                        onChange={(e) => setSeoData({ ...seoData, contact_description: e.target.value })}
                        placeholder="Gayrimenkul danışmanlığı için bizimle iletişime geçin..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
            <Save className="w-4 h-4 mr-2" /> Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSEO;
