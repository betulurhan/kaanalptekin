import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle2, ArrowLeft, Home as HomeIcon, Ruler, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { projectsAPI } from '../services/api';

export const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unitsDialogOpen, setUnitsDialogOpen] = useState(false);
  const [floorPlanDialogOpen, setFloorPlanDialogOpen] = useState(false);

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
    ? project.images 
    : [project.image];

  const availableUnits = project.units?.filter(u => u.status === 'available').length || 0;
  const soldUnits = project.units?.filter(u => u.status === 'sold').length || 0;

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild>
            <Link to="/projeler">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Projelere Dön
            </Link>
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {allImages.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="h-[500px] rounded-xl overflow-hidden">
                    <img 
                      src={img} 
                      alt={`${project.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
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
        </div>
      </section>

      {/* Project Info */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={project.status === 'completed' ? 'bg-green-600' : 'bg-amber-500'}>
                    {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                  </Badge>
                  <Badge variant="outline">{project.type}</Badge>
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-4">{project.title}</h1>
                <div className="flex items-center text-slate-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  {project.location}
                </div>
                <p className="text-slate-700 text-lg leading-relaxed">{project.description}</p>
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
