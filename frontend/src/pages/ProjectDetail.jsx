import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle2, ArrowLeft, Home as HomeIcon, Ruler, DollarSign, Phone, Building2, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { projectsAPI } from '../services/api';
import { resolveImageUrl } from '../utils/imageUrl';

export const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unitsDialogOpen, setUnitsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await projectsAPI.getById(id);
      setProject(data);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 text-lg mb-4">Proje bulunamadı</p>
          <Button asChild><Link to="/projeler">Projelere Dön</Link></Button>
        </div>
      </div>
    );
  }

  const allImages = project.images && project.images.length > 0 
    ? [project.image, ...project.images].map(img => resolveImageUrl(img))
    : [resolveImageUrl(project.image)];

  const availableUnits = project.units?.filter(u => u.status === 'available').length || 0;
  const soldUnits = project.units?.filter(u => u.status === 'sold').length || 0;
  const totalUnits = project.units?.length || 0;

  // Get unique room types
  const roomTypes = [...new Set(project.units?.map(u => u.rooms) || [])];

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section with Breadcrumb */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild className="text-white hover:text-amber-400 mb-4">
            <Link to="/projeler">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tüm Projelere Dön
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <Badge className={project.status === 'completed' ? 'bg-green-600' : 'bg-amber-500'}>
              {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/30">
              {project.type}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{project.title}</h1>
          <div className="flex items-center text-amber-400 text-lg">
            <MapPin className="w-5 h-5 mr-2" />
            {project.location}
          </div>
        </div>
      </div>

      {/* Quick Info Section - Sticky Info Box */}
      <section className="py-8 bg-slate-50 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-2xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center md:text-left">
                  <p className="text-sm text-slate-600 mb-2">Fiyat Aralığı</p>
                  <p className="text-3xl font-bold text-amber-600">{project.price}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-slate-600 mb-2">Teslim Tarihi</p>
                  <p className="text-2xl font-bold text-slate-800">{project.completion_date}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-slate-600 mb-2">Konum</p>
                  <p className="text-xl font-bold text-slate-800">{project.location.split(',')[0]}</p>
                </div>
                <div className="text-center md:text-left">
                  {totalUnits > 0 && (
                    <>
                      <p className="text-sm text-slate-600 mb-2">Durum</p>
                      <div className="flex gap-2 justify-center md:justify-start">
                        <Badge className="bg-green-600 text-white">{availableUnits} Satışta</Badge>
                        <Badge variant="secondary">{soldUnits} Satıldı</Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t grid md:grid-cols-2 gap-4">
                <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Link to="/iletisim">
                    <Phone className="w-5 h-5 mr-2" />
                    Hemen Bilgi Alın
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-300">
                  <Link to="/iletisim">
                    İletişim Formu
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Image Grid - 3 Big Images */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Proje Görselleri</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {allImages.slice(0, 3).map((img, index) => (
              <div 
                key={index}
                className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img} 
                  alt={`${project.title} - ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          
          {/* Thumbnail Gallery - Rest of Images */}
          {allImages.length > 3 && (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {allImages.slice(3, 11).map((img, idx) => (
                <div 
                  key={idx + 3}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-amber-500 transition-all shadow-md"
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 4}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Overview Cards */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Building2 className="w-10 h-10 mx-auto mb-3 text-amber-600" />
                <p className="text-sm text-slate-600 mb-1">Proje Tipi</p>
                <p className="text-lg font-bold text-slate-800">{project.type}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Calendar className="w-10 h-10 mx-auto mb-3 text-amber-600" />
                <p className="text-sm text-slate-600 mb-1">Teslim Yılı</p>
                <p className="text-lg font-bold text-slate-800">{project.completion_date}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <HomeIcon className="w-10 h-10 mx-auto mb-3 text-amber-600" />
                <p className="text-sm text-slate-600 mb-1">Toplam Ünite</p>
                <p className="text-lg font-bold text-slate-800">{totalUnits || 'Bilgi Yok'}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="w-10 h-10 mx-auto mb-3 text-amber-600" />
                <p className="text-sm text-slate-600 mb-1">Daire Tipleri</p>
                <p className="text-lg font-bold text-slate-800">{roomTypes.length || 'Çeşitli'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content - Tabs */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="aciklama" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-8 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="aciklama" className="rounded-lg">Açıklama</TabsTrigger>
              <TabsTrigger value="ozellikler" className="rounded-lg">Özellikler</TabsTrigger>
              <TabsTrigger value="daireler" className="rounded-lg">Daireler</TabsTrigger>
              {project.payment_plan && <TabsTrigger value="odeme" className="rounded-lg">Ödeme</TabsTrigger>}
              {(project.floor_plans?.length > 0 || project.floor_plan) && <TabsTrigger value="kat" className="rounded-lg">Kat Planları</TabsTrigger>}
            </TabsList>

            <TabsContent value="aciklama">
              <Card className="border-none shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-slate-800 mb-6">Proje Hakkında</h2>
                  <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ozellikler">
              <Card className="border-none shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-slate-800 mb-6">Proje Özellikleri</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <span className="text-slate-800 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="daireler">
              <Card className="border-none shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-slate-800 mb-6">Ünite Tipleri</h2>
                  
                  {/* Unit Types - Compact inline badges */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {roomTypes.map((type, idx) => (
                      <div key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border-2 border-amber-200">
                        <HomeIcon className="w-5 h-5 text-amber-600" />
                        <span className="text-lg font-bold text-slate-800">{type}</span>
                      </div>
                    ))}
                  </div>

                  {/* Units Table */}
                  {project.units && project.units.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-800 text-white">
                          <tr>
                            <th className="px-4 py-3 text-left">Daire No</th>
                            <th className="px-4 py-3 text-left">Kat</th>
                            <th className="px-4 py-3 text-left">Tip</th>
                            <th className="px-4 py-3 text-left">m²</th>
                            <th className="px-4 py-3 text-left">Fiyat</th>
                            <th className="px-4 py-3 text-left">Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.units.map((unit, idx) => (
                            <tr key={idx} className={`border-b ${unit.status === 'sold' ? 'bg-slate-50' : 'hover:bg-amber-50'}`}>
                              <td className="px-4 py-4 font-bold">{unit.unit_number}</td>
                              <td className="px-4 py-4">{unit.floor}. Kat</td>
                              <td className="px-4 py-4 font-semibold">{unit.rooms}</td>
                              <td className="px-4 py-4">{unit.area_m2} m²</td>
                              <td className="px-4 py-4 font-bold text-amber-600">{unit.price}</td>
                              <td className="px-4 py-4">
                                <Badge className={unit.status === 'available' ? 'bg-green-600' : 'bg-slate-400'}>
                                  {unit.status === 'available' ? 'Satışta' : 'Satıldı'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {project.payment_plan && (
              <TabsContent value="odeme">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6">Ödeme Planı</h2>
                    <div className="prose max-w-none">
                      <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
                        {project.payment_plan}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {(project.floor_plans?.length > 0 || project.floor_plan) && (
              <TabsContent value="kat">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6">Kat Planları</h2>
                    {/* Multiple Floor Plans */}
                    {project.floor_plans && project.floor_plans.length > 0 ? (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {project.floor_plans.map((floorPlan, idx) => (
                            <div 
                              key={idx}
                              className="cursor-pointer rounded-xl overflow-hidden hover:shadow-xl transition-all border-2 border-slate-200 hover:border-amber-500 group"
                              onClick={() => setSelectedImage(resolveImageUrl(floorPlan))}
                            >
                              <div className="relative">
                                <img 
                                  src={resolveImageUrl(floorPlan)} 
                                  alt={`Kat Planı ${idx + 1}`}
                                  className="w-full h-64 object-contain bg-slate-50 group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute top-2 left-2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                  Plan {idx + 1}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-slate-500 text-center">Büyütmek için tıklayın</p>
                      </div>
                    ) : project.floor_plan ? (
                      // Fallback for old single floor_plan field
                      <div>
                        <div 
                          className="cursor-pointer rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage(resolveImageUrl(project.floor_plan))}
                        >
                          <img 
                            src={resolveImageUrl(project.floor_plan)} 
                            alt="Kat Planı"
                            className="w-full h-auto"
                          />
                        </div>
                        <p className="text-sm text-slate-500 mt-3 text-center">Büyütmek için tıklayın</p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>

      {/* CTA Section - Simplified */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {project.title} Hakkında Detaylı Bilgi Alın
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Uzman danışmanlarımız size yardımcı olmak için hazır. Hemen iletişime geçin!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white px-10">
              <Link to="/iletisim">
                <Phone className="w-5 h-5 mr-2" />
                Hemen Ara
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-10">
              <Link to="/iletisim">
                Form Doldur
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Image Lightbox Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{project.title}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="mt-4">
              <img 
                src={selectedImage} 
                alt="Preview"
                className="w-full h-auto"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
