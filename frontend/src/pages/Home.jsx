import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Award, Users, Building2, TrendingUp, ChevronLeft, ChevronRight, Phone, MapPin, Star, Home as HomeIcon, Key, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { Badge } from '../components/ui/badge';
import { aboutData } from '../mock/mockData';
import { carouselAPI, projectsAPI, contentAPI } from '../services/api';

export const Home = () => {
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [projects, setProjects] = useState([]);
  const [heroFeatures, setHeroFeatures] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // Track current slide (autoplay disabled)
  useEffect(() => {
    if (!carouselApi) return;
    
    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    
    carouselApi.on('select', onSelect);
    return () => carouselApi.off('select', onSelect);
  }, [carouselApi]);

  const loadData = async () => {
    try {
      const [slides, projectsData, features] = await Promise.all([
        carouselAPI.getAll(true),
        projectsAPI.getAll(),
        contentAPI.getHeroFeatures().catch(() => null)
      ]);
      setCarouselSlides(slides);
      setProjects(projectsData);
      setHeroFeatures(features);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping for dynamic icons
  const getIcon = (iconName) => {
    const icons = {
      'home': HomeIcon,
      'key': Key,
      'building': Building2,
      'map-pin': MapPin,
      'users': Users,
      'award': Award,
      'star': Star,
      'phone': Phone
    };
    return icons[iconName] || Key;
  };

  const projectTypes = [
    { value: 'all', label: 'Tümü' },
    { value: 'Rezidans', label: 'Rezidans' },
    { value: 'Apartman', label: 'Apartman' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Ticari', label: 'Ticari' },
  ];

  const filteredProjects = selectedType === 'all'
    ? projects.slice(0, 6)
    : projects.filter((p) => p.type === selectedType).slice(0, 6);

  const stats = [
    { icon: Award, value: '15+', label: 'Yıllık Deneyim' },
    { icon: Building2, value: '200+', label: 'Tamamlanan Proje' },
    { icon: Users, value: '500+', label: 'Mutlu Müşteri' },
    { icon: TrendingUp, value: '%98', label: 'Memnuniyet Oranı' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        {loading || carouselSlides.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <Carousel 
            className="h-full w-full" 
            opts={{ loop: true }}
            setApi={setCarouselApi}
          >
            <CarouselContent className="-ml-0 h-screen">
              {carouselSlides.map((slide, index) => (
                <CarouselItem key={slide.id} className="pl-0 h-full">
                  <div className="relative h-full w-full">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${slide.image}')` }}
                    >
                      <div className={`absolute inset-0 ${index === 0 ? 'bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/30' : 'bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/20'}`}></div>
                    </div>
                    
                    {/* Content - Different layout for first slide vs others */}
                    {index === 0 ? (
                      /* FIRST SLIDE - Premium Design with Card */
                      <div className="relative z-10 h-full flex items-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                          <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="text-left">
                              {/* Badge */}
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full mb-6">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-amber-400 text-sm font-medium">
                                  {heroFeatures?.badge_text || 'Profesyonel Gayrimenkul Danışmanlığı'}
                                </span>
                              </div>
                              
                              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                {slide.title}
                              </h1>
                              {slide.subtitle && (
                                <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent mb-6">
                                  {slide.subtitle}
                                </p>
                              )}
                              {slide.description && (
                                <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                                  {slide.description}
                                </p>
                              )}
                              
                              {/* CTA Buttons */}
                              <div className="flex flex-wrap gap-4 mb-10">
                                {slide.cta_text && slide.cta_link && (
                                  <Button
                                    asChild
                                    size="lg"
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transform hover:scale-105 transition-all duration-300"
                                  >
                                    <Link to={slide.cta_link}>
                                      {slide.cta_text}
                                      <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                  </Button>
                                )}
                                <Button
                                  asChild
                                  size="lg"
                                  variant="outline"
                                  className="border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl transition-all duration-300"
                                >
                                  <Link to={heroFeatures?.secondary_cta_link || '/iletisim'}>
                                    <Phone className="mr-2 w-5 h-5" />
                                    {heroFeatures?.secondary_cta_text || 'Bize Ulaşın'}
                                  </Link>
                                </Button>
                              </div>
                              
                              {/* Trust Indicators - Dynamic */}
                              <div className="flex flex-wrap gap-6">
                                {(heroFeatures?.trust_indicators || [
                                  { icon: 'check-circle', text: 'Lisanslı Danışman', color: 'green' },
                                  { icon: 'shield', text: 'Güvenli İşlem', color: 'blue' },
                                  { icon: 'award', text: '15+ Yıl Tecrübe', color: 'amber' }
                                ]).filter(t => t.is_active !== false).map((indicator, idx) => {
                                  const colorClasses = {
                                    green: 'bg-green-500/20 text-green-400',
                                    blue: 'bg-blue-500/20 text-blue-400',
                                    amber: 'bg-amber-500/20 text-amber-400',
                                    red: 'bg-red-500/20 text-red-400',
                                    purple: 'bg-purple-500/20 text-purple-400'
                                  };
                                  const iconMap = {
                                    'check-circle': CheckCircle2,
                                    'shield': Shield,
                                    'award': Award,
                                    'star': Star,
                                    'users': Users
                                  };
                                  const IconComp = iconMap[indicator.icon] || CheckCircle2;
                                  return (
                                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                                      <div className={`w-10 h-10 rounded-full ${colorClasses[indicator.color] || colorClasses.green} flex items-center justify-center`}>
                                        <IconComp className="w-5 h-5" />
                                      </div>
                                      <span className="text-sm">{indicator.text}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* Right Side - Floating Info Card */}
                            <div className="hidden lg:block">
                              <div className="relative">
                                {/* Main Card */}
                                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                                  <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                      <HomeIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-slate-800 font-bold text-lg">
                                        {heroFeatures?.card_title || 'Hızlı Değerleme'}
                                      </p>
                                      <p className="text-slate-500 text-sm">
                                        {heroFeatures?.card_subtitle || 'Ücretsiz mülk değerlendirme'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Clickable Feature Links */}
                                  <div className="space-y-3 mb-6">
                                    {(heroFeatures?.features || [
                                      { icon: 'key', title: 'Satılık & Kiralık Portföy', link: '/projeler' },
                                      { icon: 'building', title: '200+ Tamamlanan Proje', link: '/projeler' },
                                      { icon: 'map-pin', title: 'Türkiye Geneli Hizmet', link: '/iletisim' }
                                    ]).filter(f => f.is_active !== false).map((feature, idx) => {
                                      const IconComponent = getIcon(feature.icon);
                                      return (
                                        <Link 
                                          key={idx} 
                                          to={feature.link}
                                          className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-amber-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-amber-200 hover:shadow-md"
                                        >
                                          <div className="w-10 h-10 bg-amber-100 group-hover:bg-amber-500 rounded-lg flex items-center justify-center transition-colors duration-300">
                                            <IconComponent className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors duration-300" />
                                          </div>
                                          <span className="text-slate-700 font-medium group-hover:text-amber-700 transition-colors duration-300">{feature.title}</span>
                                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 ml-auto opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                                        </Link>
                                      );
                                    })}
                                  </div>
                                  
                                  <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 py-6 rounded-xl text-lg shadow-lg shadow-amber-500/25">
                                    <Link to={heroFeatures?.cta_link || '/projeler'}>
                                      {heroFeatures?.cta_text || 'Projeleri Keşfet'}
                                      <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                  </Button>
                                </div>
                                
                                {/* Floating Stats */}
                                <div className="absolute -bottom-6 -left-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-xl">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                      <Users className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="text-2xl font-bold text-slate-800">{heroFeatures?.stats_count || '500+'}</p>
                                      <p className="text-slate-500 text-sm">{heroFeatures?.stats_label || 'Mutlu Müşteri'}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-4 shadow-xl">
                                  <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-white fill-white" />
                                    <span className="text-white font-bold">{heroFeatures?.rating || '4.9/5'}</span>
                                  </div>
                                  <p className="text-white/80 text-xs">{heroFeatures?.rating_label || 'Müşteri Puanı'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* OTHER SLIDES - Simple Design */
                      <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {slide.title}
                          </h2>
                          {slide.subtitle && (
                            <p className="text-xl md:text-2xl text-amber-400 font-semibold mb-4">
                              {slide.subtitle}
                            </p>
                          )}
                          {slide.description && (
                            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                              {slide.description}
                            </p>
                          )}
                          {slide.cta_text && slide.cta_link && (
                            <Button
                              asChild
                              size="lg"
                              className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                              <Link to={slide.cta_link}>
                                {slide.cta_text}
                                <ArrowRight className="ml-2 w-5 h-5" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => carouselApi?.scrollPrev()} 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => carouselApi?.scrollNext()} 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {carouselSlides.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => carouselApi?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-amber-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </Carousel>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-amber-600" />
                    </div>
                    <p className="text-4xl font-bold text-slate-800 mb-2">{stat.value}</p>
                    <p className="text-slate-600">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Öne Çıkan Projeler</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Sizin için özenle seçilmiş projelerimizi keşfedin</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {projectTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedType === type.value
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group cursor-pointer overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-amber-500">{project.type}</Badge>
                  <Badge className={`absolute top-4 right-4 ${project.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}>
                    {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-slate-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-600">{project.price}</span>
                    <Link
                      to={`/projeler/${project.id}`}
                      className="text-slate-600 hover:text-amber-600 font-medium flex items-center gap-1 transition-colors"
                    >
                      Detaylar <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-slate-800 hover:bg-slate-900">
              <Link to="/projeler">
                Tüm Projeleri Gör
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
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

export default Home;
