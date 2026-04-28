import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, MapPin, Calendar, ChevronLeft, ChevronRight, BarChart3, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { marketTrendsAPI } from '../services/api';

// Antalya bölgeleri ve örnek veriler
const defaultRegions = [
  { id: 'konyaalti', name: 'Konyaaltı', color: '#f59e0b' },
  { id: 'muratpasa', name: 'Muratpaşa', color: '#3b82f6' },
  { id: 'kepez', name: 'Kepez', color: '#10b981' },
  { id: 'aksu', name: 'Aksu', color: '#8b5cf6' },
  { id: 'dosemealti', name: 'Döşemealtı', color: '#ef4444' },
  { id: 'altintas', name: 'Altıntaş', color: '#ec4899' }
];

const defaultData = {
  konyaalti: [
    { year: '2020', value: 450000, change: 0 },
    { year: '2021', value: 580000, change: 28.9 },
    { year: '2022', value: 920000, change: 58.6 },
    { year: '2023', value: 1450000, change: 57.6 },
    { year: '2024', value: 2100000, change: 44.8 },
    { year: '2025', value: 2850000, change: 35.7 }
  ],
  muratpasa: [
    { year: '2020', value: 520000, change: 0 },
    { year: '2021', value: 650000, change: 25.0 },
    { year: '2022', value: 1050000, change: 61.5 },
    { year: '2023', value: 1680000, change: 60.0 },
    { year: '2024', value: 2400000, change: 42.9 },
    { year: '2025', value: 3200000, change: 33.3 }
  ],
  kepez: [
    { year: '2020', value: 280000, change: 0 },
    { year: '2021', value: 350000, change: 25.0 },
    { year: '2022', value: 550000, change: 57.1 },
    { year: '2023', value: 850000, change: 54.5 },
    { year: '2024', value: 1200000, change: 41.2 },
    { year: '2025', value: 1650000, change: 37.5 }
  ],
  aksu: [
    { year: '2020', value: 320000, change: 0 },
    { year: '2021', value: 420000, change: 31.3 },
    { year: '2022', value: 680000, change: 61.9 },
    { year: '2023', value: 1100000, change: 61.8 },
    { year: '2024', value: 1550000, change: 40.9 },
    { year: '2025', value: 2100000, change: 35.5 }
  ],
  dosemealti: [
    { year: '2020', value: 380000, change: 0 },
    { year: '2021', value: 480000, change: 26.3 },
    { year: '2022', value: 750000, change: 56.3 },
    { year: '2023', value: 1180000, change: 57.3 },
    { year: '2024', value: 1700000, change: 44.1 },
    { year: '2025', value: 2350000, change: 38.2 }
  ],
  altintas: [
    { year: '2020', value: 350000, change: 0 },
    { year: '2021', value: 450000, change: 28.6 },
    { year: '2022', value: 720000, change: 60.0 },
    { year: '2023', value: 1150000, change: 59.7 },
    { year: '2024', value: 1680000, change: 46.1 },
    { year: '2025', value: 2300000, change: 36.9 }
  ]
};

export const MarketTrends = () => {
  const [selectedRegion, setSelectedRegion] = useState('konyaalti');
  const [trendData, setTrendData] = useState(defaultData);
  const [regions, setRegions] = useState(defaultRegions);
  const scrollRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    fetchTrendData();
  }, []);

  const fetchTrendData = async () => {
    try {
      const data = await marketTrendsAPI.getAll();
      if (data && Object.keys(data).length > 0) {
        setTrendData(data);
      }
    } catch (error) {
      console.log('Using default trend data');
    }
  };

  const currentData = trendData[selectedRegion] || defaultData[selectedRegion];
  const currentRegion = regions.find(r => r.id === selectedRegion);
  const maxValue = Math.max(...currentData.map(d => d.value));
  const totalGrowth = currentData.length > 1 
    ? (((currentData[currentData.length - 1].value - currentData[0].value) / currentData[0].value) * 100).toFixed(0)
    : 0;

  const formatPrice = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ₺`;
    }
    return `${(value / 1000).toFixed(0)}K ₺`;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-amber-500 text-white mb-4">
            <TrendingUp className="w-4 h-4 mr-1" />
            Piyasa Analizi
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Antalya Emlak Değer Artışı
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Son 5 yılda Antalya'nın farklı bölgelerindeki ortalama konut fiyat değişimlerini inceleyin.
          </p>
        </div>

        {/* Region Selector - Desktop */}
        <div className="hidden md:flex justify-center gap-2 mb-8 flex-wrap">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedRegion === region.id
                  ? 'text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100 shadow'
              }`}
              style={selectedRegion === region.id ? { backgroundColor: region.color } : {}}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              {region.name}
            </button>
          ))}
        </div>

        {/* Region Selector - Mobile (Swipeable Cards) */}
        <div className="md:hidden relative mb-8">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
          
          <div 
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-8 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-xl font-medium transition-all duration-300 snap-center ${
                  selectedRegion === region.id
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-white text-slate-600 shadow'
                }`}
                style={selectedRegion === region.id ? { backgroundColor: region.color } : {}}
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                {region.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Card */}
          <Card className="lg:col-span-2 border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                {currentRegion?.name} - Fiyat Değişimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simple Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                {currentData.map((item, index) => {
                  const height = (item.value / maxValue) * 100;
                  return (
                    <div key={item.year} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full flex justify-center">
                        <div 
                          className="w-full max-w-12 rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                          style={{ 
                            height: `${height * 2}px`,
                            backgroundColor: currentRegion?.color || '#f59e0b'
                          }}
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            <p className="font-bold">{formatPrice(item.value)}</p>
                            {item.change > 0 && (
                              <p className="text-green-400">+{item.change}%</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{item.year}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl" style={{ borderLeft: `4px solid ${currentRegion?.color}` }}>
              <CardContent className="p-6">
                <p className="text-slate-500 text-sm mb-1">Toplam Değer Artışı (5 Yıl)</p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-slate-800">%{totalGrowth}</span>
                  <ArrowUpRight className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
              <CardContent className="p-6">
                <p className="text-slate-500 text-sm mb-1">2025 Ortalama m² Fiyatı</p>
                <p className="text-3xl font-bold text-slate-800">
                  {formatPrice(currentData[currentData.length - 1]?.value || 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
              <CardContent className="p-6">
                <p className="text-slate-500 text-sm mb-1">Son Yıl Artış</p>
                <p className="text-3xl font-bold text-green-600">
                  +{currentData[currentData.length - 1]?.change || 0}%
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-amber-500 to-amber-600">
              <CardContent className="p-6 text-white">
                <Calendar className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-amber-100 text-sm mb-1">Veri Güncellemesi</p>
                <p className="font-semibold">Nisan 2025</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Cards View - Swipeable */}
        <div className="md:hidden mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tüm Bölgeler</h3>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
              {regions.map((region) => {
                const regionData = trendData[region.id] || defaultData[region.id];
                const lastValue = regionData[regionData.length - 1];
                const growth = (((lastValue.value - regionData[0].value) / regionData[0].value) * 100).toFixed(0);
                
                return (
                  <Card 
                    key={region.id}
                    className="flex-shrink-0 w-64 border-none shadow-lg snap-center"
                    style={{ borderTop: `4px solid ${region.color}` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-800">{region.name}</h4>
                        <Badge className="bg-green-100 text-green-700">+{growth}%</Badge>
                      </div>
                      <p className="text-2xl font-bold text-slate-800 mb-1">
                        {formatPrice(lastValue.value)}
                      </p>
                      <p className="text-xs text-slate-500">2025 Ortalama</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketTrends;
