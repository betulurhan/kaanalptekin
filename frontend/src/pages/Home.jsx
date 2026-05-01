import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Award, Users, Building2, TrendingUp, ChevronLeft, ChevronRight, Phone, MapPin, Star, Home as HomeIcon, Key, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '../components/ui/carousel';
import { Badge } from '../components/ui/badge';
import { SEOHead } from '../components/SEOHead';
import { useSiteData } from '../context/SiteDataContext';
import { resolveImageUrl } from '../utils/imageUrl';
import { LazySection } from '../components/LazySection';
import { HomeFormsSection } from '../components/HomeFormsSection';

export const Home = () => {
  const { seoSettings, carousel, projects, heroFeatures, homeStats, homeCTA, loaded } = useSiteData();
  const [selectedType, setSelectedType] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Track current slide
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on('select', onSelect);
    return () => carouselApi.off('select', onSelect);
  }, [carouselApi]);

  // Preload first carousel image
  useEffect(() => {
    if (carousel?.[0]?.image) {
      const img = new Image();
      img.src = resolveImageUrl(carousel[0].image, { width: isMobile ? 640 : 1280, quality: isMobile ? 40 : 50 });
    }
  }, [carousel, isMobile]);

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
      'phone': Phone,
      'trending-up': TrendingUp,
      'bar-chart': TrendingUp,
      'shield': Shield,
      'check-circle': CheckCircle2
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
    ? projects.slice(0, 3)
    : projects.filter((p) => p.type === selectedType).slice(0, 3);

  // Dynamic stats from admin or defaults
  const displayStats = (homeStats?.stats?.length > 0) 
    ? homeStats.stats.filter(s => s.is_active !== false)
    : [
        { icon: 'award', value: '15+', label: 'Yıllık Deneyim' },
        { icon: 'building', value: '200+', label: 'Tamamlanan Proje' },
        { icon: 'users', value: '500+', label: 'Mutlu Müşteri' },
        { icon: 'trending-up', value: '%98', label: 'Memnuniyet Oranı' },
      ];

  // Dynamic CTA from admin or defaults
  const displayCTA = homeCTA || {
    title: 'Hayalinizdeki Gayrimenkul İçin Benimle İletişime Geçin',
    description: '15 yıllık deneyimimle, size en uygun mülk seçeneklerini sunmak için hazırım.',
    button_text: 'Ücretsiz Danışmanlık Alın',
    button_link: '/iletisim'
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        title={seoSettings?.home_title || seoSettings?.site_title} 
        description={seoSettings?.home_description || seoSettings?.site_description} 
      />
      {/* Hero Carousel Section */}
      <section className="relative h-[45vh] max-h-[400px] sm:h-screen sm:max-h-none overflow-hidden">
        {!loaded || carousel.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <Carousel 
            className="h-full w-full" 
            opts={{ loop: true }}
            setApi={setCarouselApi}
          >
            <CarouselContent className="-ml-0 h-[45vh] max-h-[400px] sm:h-screen sm:max-h-none">
              {carousel.map((slide, index) => (
                <CarouselItem key={slide.id} className="pl-0 h-full">
                  <div className="relative h-full w-full">
                    {/* Background Image - only load current slide (mobile) or current+adjacent (desktop) */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-slate-100"
                      style={(index === currentSlide || (!isMobile && Math.abs(currentSlide - index) <= 1))
                        ? { backgroundImage: `url('${resolveImageUrl(slide.image, { width: isMobile ? 640 : 1280, quality: isMobile ? 40 : 50 })}')` }
                        : {}
                      }
                    />
                    
                    {/* Content - Different layout for first slide vs others */}
                    {index === 0 ? (
                      /* FIRST SLIDE - Premium Design with Card */
                      <div className="relative z-10 h-full flex items-center pt-16 sm:pt-0">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* Left Content */}
                            <div className="text-left">
                              {/* Badge - hidden on mobile to save space */}
                              <div className="hidden sm:inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-full mb-4 sm:mb-6">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                                <span className="text-white text-xs sm:text-sm font-medium [text-shadow:_0_1px_4px_rgba(0,0,0,0.6)]">
                                  {heroFeatures?.badge_text || 'Profesyonel Gayrimenkul Danışmanlığı'}
                                </span>
                              </div>
                              
                              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight line-clamp-2 [text-shadow:_0_2px_12px_rgba(0,0,0,0.7),_0_4px_24px_rgba(0,0,0,0.4)]">
                                {slide.title}
                              </h1>
                              {slide.subtitle && (
                                <p className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-6 line-clamp-1 [text-shadow:_0_2px_12px_rgba(0,0,0,0.7),_0_4px_24px_rgba(0,0,0,0.4)]">
                                  {slide.subtitle}
                                </p>
                              )}
                              {slide.description && (
                                <p className="hidden sm:block text-sm sm:text-lg text-white mb-4 sm:mb-8 max-w-xl leading-relaxed [text-shadow:_0_2px_10px_rgba(0,0,0,0.7)]">
                                  {slide.description}
                                </p>
                              )}
                              
                              {/* CTA Buttons - compact on mobile */}
                              <div className="flex flex-row flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-10">
                                {slide.cta_text && slide.cta_link && (
                                  <Button
                                    asChild
                                    size="sm"
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-8 py-2.5 sm:py-6 text-sm sm:text-lg rounded-lg sm:rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 sm:transform sm:hover:scale-105 transition-all duration-300"
                                  >
                                    <Link to={slide.cta_link}>
                                      {slide.cta_text}
                                      <ArrowRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                    </Link>
                                  </Button>
                                )}
                                <Button
                                  asChild
                                  size="sm"
                                  variant="outline"
                                  className="border-white/40 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:text-white px-4 sm:px-8 py-2.5 sm:py-6 text-sm sm:text-lg rounded-lg sm:rounded-xl transition-all duration-300"
                                >
                                  <Link to={heroFeatures?.secondary_cta_link || '/iletisim'}>
                                    <Phone className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                                    {heroFeatures?.secondary_cta_text || 'Bize Ulaşın'}
                                  </Link>
                                </Button>
                              </div>
                              
                              {/* Trust Indicators - hidden on mobile */}
                              <div className="hidden sm:flex flex-row flex-wrap gap-3 sm:gap-6">
                                {(heroFeatures?.trust_indicators || [
                                  { icon: 'check-circle', text: 'Lisanslı Danışman', color: 'green' },
                                  { icon: 'shield', text: 'Güvenli İşlem', color: 'blue' },
                                  { icon: 'award', text: '15+ Yıl Tecrübe', color: 'amber' }
                                ]).filter(t => t.is_active !== false).map((indicator, idx) => {
                                  const colorClasses = {
                                    green: 'bg-green-500/30 text-green-300',
                                    blue: 'bg-blue-500/30 text-blue-300',
                                    amber: 'bg-amber-500/30 text-amber-300',
                                    red: 'bg-red-500/30 text-red-300',
                                    purple: 'bg-purple-500/30 text-purple-300'
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
                                    <div key={idx} className="flex items-center gap-2 text-white [text-shadow:_0_1px_4px_rgba(0,0,0,0.7)]">
                                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${colorClasses[indicator.color] || colorClasses.green} backdrop-blur-sm flex items-center justify-center`}>
                                        <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                                      </div>
                                      <span className="text-xs sm:text-sm font-medium">{indicator.text}</span>
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
                      <div className="relative z-10 h-full flex items-center justify-center px-4 pt-16 sm:pt-0">
                        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 text-center">
                          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-6 leading-tight line-clamp-2 [text-shadow:_0_2px_12px_rgba(0,0,0,0.7),_0_4px_24px_rgba(0,0,0,0.4)]">
                            {slide.title}
                          </h2>
                          {slide.subtitle && (
                            <p className="text-base sm:text-xl md:text-2xl text-white font-semibold mb-2 sm:mb-4 line-clamp-1 [text-shadow:_0_2px_12px_rgba(0,0,0,0.7),_0_4px_24px_rgba(0,0,0,0.4)]">
                              {slide.subtitle}
                            </p>
                          )}
                          {slide.description && (
                            <p className="hidden sm:block text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto [text-shadow:_0_2px_10px_rgba(0,0,0,0.7)]">
                              {slide.description}
                            </p>
                          )}
                          {slide.cta_text && slide.cta_link && (
                            <Button
                              asChild
                              size="sm"
                              className="bg-amber-500 hover:bg-amber-600 text-white px-5 sm:px-10 py-2.5 sm:py-6 text-sm sm:text-lg rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl sm:transform sm:hover:scale-105 transition-all duration-300"
                            >
                              <Link to={slide.cta_link}>
                                {slide.cta_text}
                                <ArrowRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
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
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full hidden sm:flex items-center justify-center transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button 
              onClick={() => carouselApi?.scrollNext()} 
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full hidden sm:flex items-center justify-center transition-all duration-300 z-20"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-2 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {carousel.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => carouselApi?.scrollTo(idx)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-6 sm:w-8 bg-amber-500' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </Carousel>
        )}
      </section>

      {/* Home Forms Section - Talep & Ekspertiz right under slider */}
      <LazySection>
        <HomeFormsSection />
      </LazySection>

      {/* Projects Section - Lazy loaded */}
      <LazySection>
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
                    src={resolveImageUrl(project.image, { width: isMobile ? 300 : 400, quality: isMobile ? 40 : 50 })}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
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
      </LazySection>

      {/* CTA Section - Lazy loaded */}
      <LazySection>
      <section className="py-20 bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {displayCTA.title}
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            {displayCTA.description}
          </p>
          <a
            href={displayCTA.button_link}
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {displayCTA.button_text}
          </a>
        </div>
      </section>
      </LazySection>
    </div>
  );
};

export default Home;
