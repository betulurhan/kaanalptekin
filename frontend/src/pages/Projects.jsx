import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { projectsAPI } from '../services/api';
import { SEOHead } from '../components/SEOHead';
import { useSEO } from '../context/SEOContext';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const { seoSettings } = useSEO();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedProjects = projects.filter((p) => p.status === 'completed');
  const ongoingProjects = projects.filter((p) => p.status === 'ongoing');

  const filterProjects = (projectList) => {
    if (selectedType === 'all') return projectList;
    return projectList.filter((p) => p.type === selectedType);
  };

  const ProjectCard = ({ project }) => (
    <Link to={`/projeler/${project.id}`}>
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-none cursor-pointer">
      <div className="relative h-72 overflow-hidden group">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex flex-wrap gap-2 mb-3">
              {project.features.map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className={project.status === 'completed' ? 'bg-green-600' : 'bg-amber-500'}>
            {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-3">
          <Badge variant="outline" className="mb-3">
            {project.type}
          </Badge>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{project.title}</h3>
          <div className="flex items-center text-slate-600 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {project.location}
          </div>
        </div>
        <p className="text-slate-700 mb-4 line-clamp-2">{project.description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500 mb-1">Fiyat Aralığı</p>
            <p className="text-amber-600 font-bold text-lg">{project.price}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Teslim</p>
            <p className="text-slate-800 font-semibold">{project.completion_date}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      {/* Hero Section */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      ) : (
        <>
      <section className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projelerimiz</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Tamamladığımız ve devam eden projelerimizi keşfedin. Her biri kalite ve müşteri memnuniyetinin göstergesi.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedType === 'all'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedType('Rezidans')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedType === 'Rezidans'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Rezidans
            </button>
            <button
              onClick={() => setSelectedType('Apartman')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedType === 'Apartman'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Apartman
            </button>
            <button
              onClick={() => setSelectedType('Villa')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedType === 'Villa'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Villa
            </button>
            <button
              onClick={() => setSelectedType('Ticari')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedType === 'Ticari'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Ticari
            </button>
          </div>
        </div>
      </section>

      {/* Projects Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="completed" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-slate-200 p-1 rounded-xl">
              <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Tamamlanan ({completedProjects.length})
              </TabsTrigger>
              <TabsTrigger value="ongoing" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
                <TrendingUp className="w-4 h-4 mr-2" />
                Devam Eden ({ongoingProjects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="completed">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterProjects(completedProjects).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              {filterProjects(completedProjects).length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-500 text-lg">Bu kategoride tamamlanmış proje bulunmuyor.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ongoing">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterProjects(ongoingProjects).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              {filterProjects(ongoingProjects).length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-500 text-lg">Bu kategoride devam eden proje bulunmuyor.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Size Özel Proje Önerileri
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            İhtiyaçlarınıza ve bütçenize uygun en iyi projeleri birlikte bulalım.
          </p>
          <a
            href="/iletisim"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Ücretsiz Danışmanlık
          </a>
        </div>
      </section>
        </>
      )}
    </div>
  );
};

export default Projects;
