import React, { useEffect, useState } from 'react';
import { Award, Target, Heart, TrendingUp, Building2, Users, Clock, CheckCircle2, Hammer, HardHat, Ruler, Shield } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { contentAPI } from '../services/api';

export const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await contentAPI.getAbout();
      setAboutData(data);
    } catch (error) {
      console.error('Failed to load about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const values = [
    {
      icon: Shield,
      title: 'Güvenilirlik',
      description: 'Her projemizde kalite ve güvenliği ön planda tutuyoruz.',
    },
    {
      icon: Award,
      title: 'Kalite',
      description: 'A sınıfı malzemeler ve işçilik garantisi sunuyoruz.',
    },
    {
      icon: Clock,
      title: 'Zamanında Teslim',
      description: 'Projelerimizi taahhüt ettiğimiz sürede teslim ediyoruz.',
    },
    {
      icon: Users,
      title: 'Müşteri Memnuniyeti',
      description: 'Satış sonrası destek ve hizmet garantisi veriyoruz.',
    },
  ];

  const milestones = [
    { year: '2008', title: 'Kuruluş', desc: 'Özpınarlar İnşaat kuruldu' },
    { year: '2012', title: 'İlk Büyük Proje', desc: '50 daireli konut projesi tamamlandı' },
    { year: '2016', title: 'Genişleme', desc: 'Ticari projeler segmentine giriş' },
    { year: '2020', title: '100. Proje', desc: '100. başarılı proje tamamlandı' },
    { year: '2024', title: 'Bugün', desc: 'Sektörün öncü firmalarından biri' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
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
      {/* Hero Section - Full Width with Overlay */}
      <section className="relative min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${aboutData.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-6">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium">Hakkımızda</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {aboutData.name}
            </h1>
            <p className="text-xl md:text-2xl text-amber-400 font-semibold mb-6">
              {aboutData.title}
            </p>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              {aboutData.shortBio || aboutData.fullBio?.substring(0, 200) + '...'}
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-400">{aboutData.experience}</p>
                <p className="text-slate-400 text-sm">Yıllık Deneyim</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-400">{aboutData.completedProjects}+</p>
                <p className="text-slate-400 text-sm">Tamamlanan Proje</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-400">{aboutData.happyClients}+</p>
                <p className="text-slate-400 text-sm">Mutlu Müşteri</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600" 
                    alt="İnşaat"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600" 
                    alt="Proje"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600" 
                    alt="Bina"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" 
                    alt="Konut"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Right - Content */}
            <div>
              <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
                Bizi Tanıyın
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Güvenle İnşa Ediyoruz, <br />
                <span className="text-amber-500">Geleceği Şekillendiriyoruz</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
                {aboutData.fullBio}
              </p>
              
              {/* Features List */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-slate-700 font-medium">Lisanslı Firma</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-slate-700 font-medium">Garantili İş</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-slate-700 font-medium">Uzman Ekip</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-slate-700 font-medium">7/24 Destek</span>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600">
                <Link to="/projeler">
                  <Building2 className="w-5 h-5 mr-2" />
                  Projelerimizi İnceleyin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Dark Background */}
      <section className="py-16 bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">{aboutData.experience}</p>
              <p className="text-slate-400">Yıllık Tecrübe</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">{aboutData.completedProjects}+</p>
              <p className="text-slate-400">Tamamlanan Proje</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">{aboutData.happyClients}+</p>
              <p className="text-slate-400">Mutlu Müşteri</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HardHat className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">50+</p>
              <p className="text-slate-400">Uzman Personel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
              Değerlerimiz
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Neden Bizi Tercih Etmelisiniz?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Müşterilerimize sunduğumuz değerler ve iş prensiplerimiz
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <CardContent className="p-8 relative">
                    {/* Background decoration */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                      <p className="text-slate-600">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
              Tarihçemiz
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Yolculuğumuz
            </h2>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-amber-200 -translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-5 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  <div className="md:text-center">
                    {/* Dot */}
                    <div className="hidden md:flex w-6 h-6 bg-amber-500 rounded-full mx-auto mb-4 relative z-10 ring-4 ring-amber-100"></div>
                    
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <CardContent className="p-6">
                        <p className="text-2xl font-bold text-amber-500 mb-2">{milestone.year}</p>
                        <h4 className="text-lg font-bold text-slate-800 mb-1">{milestone.title}</h4>
                        <p className="text-sm text-slate-600">{milestone.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-semibold mb-4">
              Hizmetlerimiz
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Uzmanlık Alanlarımız
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                <Building2 className="w-7 h-7 text-amber-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Konut Projeleri</h3>
              <p className="text-slate-400">Modern tasarımlı, kaliteli konut projeleri</p>
            </div>
            
            <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                <Hammer className="w-7 h-7 text-amber-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ticari İnşaat</h3>
              <p className="text-slate-400">İş merkezleri ve ticari yapılar</p>
            </div>
            
            <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                <Ruler className="w-7 h-7 text-amber-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Renovasyon</h3>
              <p className="text-slate-400">Bina yenileme ve tadilat işleri</p>
            </div>
            
            <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                <Target className="w-7 h-7 text-amber-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Danışmanlık</h3>
              <p className="text-slate-400">Proje yönetimi ve danışmanlık</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Hayalinizdeki Projeyi Birlikte Gerçekleştirelim
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            İnşaat ve gayrimenkul projeleriniz için bize ulaşın. Uzman ekibimiz sizinle iletişime geçsin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-slate-100">
              <Link to="/iletisim">
                Bizimle İletişime Geçin
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/projeler">
                Projelerimizi İnceleyin
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
