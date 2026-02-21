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
    ? [project.image, ...project.images] 
    : [project.image];

  const availableUnits = project.units?.filter(u => u.status === 'available').length || 0;
  const soldUnits = project.units?.filter(u => u.status === 'sold').length || 0;
  const totalUnits = project.units?.length || 0;

  // Get unique room types
  const roomTypes = [...new Set(project.units?.map(u => u.rooms) || [])];

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section with Breadcrumb */}
      <div className="bg-slate-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild className="text-white hover:text-amber-400 mb-4">
            <Link to="/projeler">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tüm Projelere Dön
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
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

      {/* Main Image Carousel */}
      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {allImages.map((img, index) => (
                <CarouselItem key={index}>
                  <div 
                    className="h-[600px] rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img 
                      src={img} 
                      alt={`${project.title} - ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {allImages.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
          
          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="mt-6 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {allImages.slice(0, 8).map((img, idx) => (
                <div 
                  key={idx}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-amber-500 transition-all"
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Overview Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 mb-12">
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
                <p className="text-sm text-slate-600 mb-1">Teslim Tarihi</p>
                <p className="text-lg font-bold text-slate-800">{project.completion_date}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <MapPin className="w-10 h-10 mx-auto mb-3 text-amber-600" />
                <p className="text-sm text-slate-600 mb-1">Konum</p>
                <p className="text-lg font-bold text-slate-800">{project.location.split(',')[0]}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <HomeIcon className="w-10 h-10 mx-auto mb-3 text-amber-600" />
                <p className="text-sm text-slate-600 mb-1">Toplam Ünite</p>
                <p className="text-lg font-bold text-slate-800">{totalUnits} Daire</p>
              </CardContent>
            </Card>
          </div>

              {/* Features */}
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Özellikler</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {project.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Plan */}
              {project.payment_plan && (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Ödeme Planı</h2>
                    <p className="text-slate-700 whitespace-pre-line mb-4">{project.payment_plan}</p>
                  </CardContent>
                </Card>
              )}

              {/* Floor Plan */}
              {project.floor_plan && (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Kat Planı</h2>
                    <div 
                      className="cursor-pointer rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      onClick={() => setFloorPlanDialogOpen(true)}
                    >
                      <img 
                        src={project.floor_plan} 
                        alt="Kat Planı"
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-sm text-slate-500 mt-2">Büyütmek için tıklayın</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card className="border-none shadow-lg sticky top-24">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-2">Fiyat Aralığı</p>
                    <p className="text-3xl font-bold text-amber-600">{project.price}</p>
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Teslim Tarihi</span>
                      <span className="font-semibold">{project.completion_date}</span>
                    </div>
                    {project.units && project.units.length > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Satışta</span>
                          <span className="font-semibold text-green-600">{availableUnits} Daire</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Satıldı</span>
                          <span className="font-semibold text-slate-500">{soldUnits} Daire</span>
                        </div>
                      </>
                    )}
                  </div>

                  {project.units && project.units.length > 0 && (
                    <Button 
                      onClick={() => setUnitsDialogOpen(true)}
                      className="w-full bg-amber-500 hover:bg-amber-600 mb-3"
                    >
                      <HomeIcon className="w-4 h-4 mr-2" />
                      Daireleri Görüntüle
                    </Button>
                  )}

                  <Button asChild variant="outline" className="w-full">
                    <Link to="/iletisim">
                      Bilgi Al
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Units Dialog */}
      <Dialog open={unitsDialogOpen} onOpenChange={setUnitsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Daire Listesi - {project.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="mb-4 flex gap-4">
              <Badge className="bg-green-600">Satışta: {availableUnits}</Badge>
              <Badge variant="secondary">Satıldı: {soldUnits}</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Daire No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Kat</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Tip</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">m²</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Fiyat</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {project.units.map((unit, idx) => (
                    <tr key={idx} className={`border-b ${unit.status === 'sold' ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                      <td className="px-4 py-3 font-medium">{unit.unit_number}</td>
                      <td className="px-4 py-3">{unit.floor}. Kat</td>
                      <td className="px-4 py-3">{unit.rooms}</td>
                      <td className="px-4 py-3">{unit.area_m2} m²</td>
                      <td className="px-4 py-3 font-semibold text-amber-600">{unit.price}</td>
                      <td className="px-4 py-3">
                        <Badge className={unit.status === 'available' ? 'bg-green-600' : 'bg-slate-400'}>
                          {unit.status === 'available' ? 'Satışta' : 'Satıldı'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floor Plan Dialog */}
      <Dialog open={floorPlanDialogOpen} onOpenChange={setFloorPlanDialogOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Kat Planı - {project.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img 
              src={project.floor_plan} 
              alt="Kat Planı"
              className="w-full h-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
