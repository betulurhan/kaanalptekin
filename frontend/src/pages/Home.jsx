import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Award, Users, Building2, TrendingUp, ChevronLeft, ChevronRight, Phone, MapPin, Star, Home as HomeIcon, Key, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { Badge } from '../components/ui/badge';
import { aboutData } from '../mock/mockData';
import { carouselAPI, projectsAPI, contentAPI } from '../services/api';
import useEmblaCarousel from 'embla-carousel-react';

export const Home = () => {
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [projects, setProjects] = useState([]);
  const [heroFeatures, setHeroFeatures] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoplayRef = useRef(null);
  
  // Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    loadData();
  }, []);

  // Autoplay effect - 1.5 second interval
  useEffect(() => {
    if (!emblaApi) return;
    
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 1500);
    
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentSlide(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

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
      {/* Hero Carousel Section - Premium Design */}
      <section className="relative h-screen overflow-hidden">
        {loading || carouselSlides.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="h-full relative">
            <div className="overflow-hidden h-full" ref={emblaRef}>
              <div className="flex h-full">
                {carouselSlides.map((slide, index) => (
                  <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative h-full">
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
                                <span className="text-amber-400 text-sm font-medium">Profesyonel Gayrimenkul Danışmanlığı</span>
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
                                  <Link to="/iletisim">
                                    <Phone className="mr-2 w-5 h-5" />
                                    Bize Ulaşın
                                  </Link>
                                </Button>
                              </div>
                              
                              {/* Trust Indicators */}
                              <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-2 text-slate-300">
                                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                  </div>
                                  <span className="text-sm">Lisanslı Danışman</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                  </div>
                                  <span className="text-sm">Güvenli İşlem</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-amber-400" />
                                  </div>
                                  <span className="text-sm">15+ Yıl Tecrübe</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Right Side - Floating Info Card with Clickable Items */}
                            <div className="hidden lg:block">
                              <div className="relative">
                                {/* Main Card - Light & Clean Design */}
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
                                
                                {/* Floating Stats - Clean Style */}
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
                      /* OTHER SLIDES - Simple Design with Image and Text */
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
                ))}
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => emblaApi?.scrollPrev()} 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => emblaApi?.scrollNext()} 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {carouselSlides.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-amber-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        )}
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
