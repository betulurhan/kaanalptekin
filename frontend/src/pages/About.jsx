import React from 'react';
import { Award, Target, Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { SEOHead } from '../components/SEOHead';
import { useSiteData } from '../context/SiteDataContext';
import { resolveImageUrl } from '../utils/imageUrl';

export const About = () => {
  const { seoSettings, aboutContent: aboutData, loaded } = useSiteData();

  const values = [
    {
      icon: Heart,
      title: 'Müşteri Odaklılık',
      description: 'Müşterilerimizin ihtiyaçlarını öncelik olarak görüyor, onların memnuniyeti için çalışıyoruz.',
    },
    {
      icon: Award,
      title: 'Profesyonellik',
      description: 'Sektördeki deneyimimiz ve uzmanlığımızla, en yüksek standartlarda hizmet sunuyoruz.',
    },
    {
      icon: Target,
      title: 'Güvenilirlik',
      description: 'Şeffaflık ve dürüstlük ilkeleriyle, uzun vadeli güven ilişkileri kuruyoruz.',
    },
    {
      icon: TrendingUp,
      title: 'Yatırım Odaklı Yaklaşım',
      description: 'Sadece ev değil, geleceğinize yapacağınız yatırımın en iyisini sunuyoruz.',
    },
  ];

  if (!loaded) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-slate-500">İçerik yüklenemedi</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <SEOHead 
        title={seoSettings?.about_title || 'Hakkımızda | ' + (seoSettings?.site_title || '')} 
        description={seoSettings?.about_description || seoSettings?.site_description} 
      />
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left - Photo */}
            <div className="flex justify-center md:justify-start">
              <div className="relative inline-block">
                <img
                  src={resolveImageUrl(aboutData?.image) || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'}
                  alt={aboutData?.name || 'Profil'}
                  className="rounded-2xl shadow-2xl max-w-xs md:max-w-sm h-auto object-contain"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            </div>
            
            {/* Right - Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
                {aboutData?.name}
              </h1>
              <p className="text-xl text-amber-600 font-semibold mb-6">{aboutData?.title}</p>
              
              {/* Biography */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Biyografi</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {aboutData?.full_bio || aboutData?.fullBio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <p className="text-4xl font-bold text-slate-800 mb-2">{aboutData?.experience}</p>
                <p className="text-slate-600">Sektör Deneyimi</p>
              </CardContent>
            </Card>
            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-4xl font-bold text-slate-800 mb-2">{aboutData?.completedProjects}</p>
                <p className="text-slate-600">Tamamlanan Proje</p>
              </CardContent>
            </Card>
            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-4xl font-bold text-slate-800 mb-2">{aboutData?.happyClients}</p>
                <p className="text-slate-600">Mutlu Müşteri</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Çalışma prensipleri ve iş ahlakımız, başarımızın temel taşlarıdır.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="text-center border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{value.title}</h3>
                    <p className="text-sm text-slate-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 text-center">
            Uzmanlık Alanlarım
          </h2>
          <div className="space-y-6">
            <Card className="border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Konut Satış ve Kiralama</h3>
                <p className="text-slate-600">
                  Rezidans, apartman dairesi, villa gibi konut tiplerine özel satış ve kiralama danışmanlığı. Müşterilerimize en uygun fiyat ve lokasyon seçeneklerini sunuyorum.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Ticari Gayrimenkul Danışmanlığı</h3>
                <p className="text-slate-600">
                  Ofis, dükkan, işyeri gibi ticari gayrimenkullerin alım-satım süreçlerinde profesyonel destek ve piyasa analizi.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Yatırım Danışmanlığı</h3>
                <p className="text-slate-600">
                  Gayrimenkul yatırımlarında doğru seçimler yapmanız için piyasa trendleri, değer artış potansiyeli ve getiri analizi.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Değerleme ve Pazarlama</h3>
                <p className="text-slate-600">
                  Mülkünüzün gerçek değerini belirleyerek, en uygun pazarlama stratejileriyle alıcılara ulaştırıyorum.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hayalinizdeki Gayrimenkul İçin Benimle İletişime Geçin
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            15 yıllık deneyimimle, size en uygun mülk seçeneklerini sunmak için hazırım.
          </p>
          <a
            href="/iletisim"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Ücretsiz Danışmanlık Alın
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
