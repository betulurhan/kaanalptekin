import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Award, Users, Building2, TrendingUp, ChevronLeft, ChevronRight, Phone, MapPin, Star, Home as HomeIcon, Key, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { Badge } from '../components/ui/badge';
import { aboutData } from '../mock/mockData';
import { carouselAPI, projectsAPI } from '../services/api';

export const Home = () => {
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [slides, projectsData] = await Promise.all([
        carouselAPI.getAll(true),
        projectsAPI.getAll()
      ]);
      setCarouselSlides(slides);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedType === 'all' 
    ? projects.filter(p => p.status === 'completed').slice(0, 6)
    : projects.filter(p => p.status === 'completed' && p.type === selectedType).slice(0, 6);

  const projectTypes = ['all', 'Rezidans', 'Apartman', 'Villa', 'Ticari'];
  const projectTypeLabels = {
    'all': 'Tümü',
    'Rezidans': 'Rezidans',
    'Apartman': 'Apartman', 
    'Villa': 'Villa',
    'Ticari': 'Ticari'
  };
  
  const stats = [
    { icon: Award, value: '15+', label: 'Yıl Deneyim' },
    { icon: Building2, value: '200+', label: 'Tamamlanan Proje' },
    { icon: Users, value: '500+', label: 'Mutlu Müşteri' },
    { icon: TrendingUp, value: '%98', label: 'Memnuniyet Oranı' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative h-screen">
        {loading || carouselSlides.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <Carousel className="h-full" opts={{ loop: true }}>
            <CarouselContent>
              {carouselSlides.map((slide, index) => (
                <CarouselItem key={slide.id}>
                  <div className="relative h-screen">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${slide.image}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50"></div>
                    </div>
                    
                    <div className="relative z-10 h-full flex items-center justify-center">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
                          {slide.title}
                          {slide.subtitle && (
                            <span className="block mt-2 bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                              {slide.subtitle}
                            </span>
                          )}
                        </h1>
                        {slide.description && (
                          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                            {slide.description}
                          </p>
                        )}
                        {slide.cta_text && slide.cta_link && (
                          <Button
                            asChild
                            size="lg"
                            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          >
                            <Link to={slide.cta_link}>
                              {slide.cta_text}
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        )}
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="border-none shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <Icon className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                    <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Profesyonel Gayrimenkul Danışmanlığı
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {aboutData.shortBio}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">15 yılı aşkın sektör deneyimi</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Geniş proje portföyü ve referanslar</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Müşteri odaklı çözümler ve şeffaf süreç</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Piyasa analizi ve yatırım danışmanlığı</span>
                </li>
              </ul>
              <Button
                asChild
                size="lg"
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 rounded-xl transition-all duration-300"
              >
                <Link to="/hakkimda">
                  Daha Fazla Bilgi
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <img
                  src={aboutData.image}
                  alt="About"
                  className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-amber-500 text-white p-6 rounded-xl shadow-xl">
                  <p className="text-4xl font-bold">{aboutData.experience}</p>
                  <p className="text-sm">Tecrübe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Öne Çıkan Projeler
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Tamamlanmış projelerimizden seçkiler. Her biri kalite ve müşteri memnuniyetinin göstergesi.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-slate-800 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {projectTypeLabels[type]}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link to={`/projeler/${project.id}`} key={project.id}>
                <Card
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-none cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Tamamlandı
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90">
                        {project.type}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{project.title}</h3>
                    <p className="text-slate-600 text-sm mb-3">{project.location}</p>
                    <p className="text-slate-700 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-amber-600 font-bold text-lg">{project.price}</p>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">Bu kategoride proje bulunmuyor.</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-300 hover:bg-slate-100 px-8 rounded-xl transition-all duration-300"
            >
              <Link to="/projeler">
                Tüm Projeleri Görüntüle
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hayalinizdeki Mülkü Birlikte Bulalım
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Uzman gayrimenkul danışmanlığı için hemen iletişime geçin. Size en uygun seçenekleri birlikte değerlendirelim.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Link to="/iletisim">
              Hemen İletişime Geç
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
