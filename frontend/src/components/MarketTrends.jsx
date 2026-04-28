import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TrendingUp, MapPin, Calendar, ChevronLeft, ChevronRight, BarChart3, ArrowUpRight, LineChart as LineChartIcon, Table as TableIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { marketTrendsAPI } from '../services/api';

const REGION_META = [
  { id: 'konyaalti', name: 'Konyaaltı', color: '#f59e0b' },
  { id: 'muratpasa', name: 'Muratpaşa', color: '#3b82f6' },
  { id: 'kepez', name: 'Kepez', color: '#10b981' },
  { id: 'aksu', name: 'Aksu', color: '#8b5cf6' },
  { id: 'dosemealti', name: 'Döşemealtı', color: '#ef4444' },
  { id: 'altintas', name: 'Altıntaş', color: '#ec4899' }
];

const DEFAULT_DATA = {
  konyaalti: [
    { year: '2020', value: 450000, change: 0 },
    { year: '2021', value: 580000, change: 28.9 },
    { year: '2022', value: 920000, change: 58.6 },
    { year: '2023', value: 1450000, change: 57.6 },
    { year: '2024', value: 2100000, change: 44.8 },
    { year: '2025', value: 2850000, change: 35.7 },
    { year: '2026', value: 3650000, change: 28.1 }
  ],
  muratpasa: [
    { year: '2020', value: 520000, change: 0 },
    { year: '2021', value: 650000, change: 25.0 },
    { year: '2022', value: 1050000, change: 61.5 },
    { year: '2023', value: 1680000, change: 60.0 },
    { year: '2024', value: 2400000, change: 42.9 },
    { year: '2025', value: 3200000, change: 33.3 },
    { year: '2026', value: 4050000, change: 26.6 }
  ],
  kepez: [
    { year: '2020', value: 280000, change: 0 },
    { year: '2021', value: 350000, change: 25.0 },
    { year: '2022', value: 550000, change: 57.1 },
    { year: '2023', value: 850000, change: 54.5 },
    { year: '2024', value: 1200000, change: 41.2 },
    { year: '2025', value: 1650000, change: 37.5 },
    { year: '2026', value: 2150000, change: 30.3 }
  ],
  aksu: [
    { year: '2020', value: 320000, change: 0 },
    { year: '2021', value: 420000, change: 31.3 },
    { year: '2022', value: 680000, change: 61.9 },
    { year: '2023', value: 1100000, change: 61.8 },
    { year: '2024', value: 1550000, change: 40.9 },
    { year: '2025', value: 2100000, change: 35.5 },
    { year: '2026', value: 2750000, change: 31.0 }
  ],
  dosemealti: [
    { year: '2020', value: 380000, change: 0 },
    { year: '2021', value: 480000, change: 26.3 },
    { year: '2022', value: 750000, change: 56.3 },
    { year: '2023', value: 1180000, change: 57.3 },
    { year: '2024', value: 1700000, change: 44.1 },
    { year: '2025', value: 2350000, change: 38.2 },
    { year: '2026', value: 3050000, change: 29.8 }
  ],
  altintas: [
    { year: '2020', value: 350000, change: 0 },
    { year: '2021', value: 450000, change: 28.6 },
    { year: '2022', value: 720000, change: 60.0 },
    { year: '2023', value: 1150000, change: 59.7 },
    { year: '2024', value: 1680000, change: 46.1 },
    { year: '2025', value: 2300000, change: 36.9 },
    { year: '2026', value: 3000000, change: 30.4 }
  ]
};

const formatPrice = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M ₺`;
  return `${(value / 1000).toFixed(0)}K ₺`;
};

// Single-region bar chart
const SingleRegionChart = ({ data, color }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <div className="h-56 sm:h-64 flex items-end justify-between gap-1.5 sm:gap-3 px-1 sm:px-2">
      {data.map((item) => {
        const height = (item.value / maxValue) * 100;
        return (
          <div key={item.year} className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div className="relative w-full flex justify-center">
              <div
                className="w-full max-w-[40px] sm:max-w-12 rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                style={{
                  height: `${height * 2}px`,
                  backgroundColor: color
                }}
                data-testid={`bar-${item.year}`}
              >
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-1.5 rounded-lg text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <p className="font-bold">{formatPrice(item.value)}</p>
                  {item.change > 0 && <p className="text-green-400">+{item.change}%</p>}
                </div>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">{item.year}</span>
          </div>
        );
      })}
    </div>
  );
};

// Multi-region SVG line chart
const ComparisonLineChart = ({ data, regions, selectedIds }) => {
  const visibleRegions = regions.filter(r => selectedIds.includes(r.id));
  const allValues = visibleRegions.flatMap(r => (data[r.id] || []).map(d => d.value));
  if (allValues.length === 0) return null;
  const maxV = Math.max(...allValues);
  const years = (data[visibleRegions[0]?.id] || []).map(d => d.year);

  const W = 760;
  const H = 320;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const xFor = (i) => padL + (years.length === 1 ? innerW / 2 : (i / (years.length - 1)) * innerW);
  const yFor = (v) => padT + innerH - (v / maxV) * innerH;

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (maxV / yTicks) * i);

  return (
    <div className="overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full min-w-[640px] h-72 sm:h-80"
        preserveAspectRatio="xMidYMid meet"
        data-testid="comparison-line-chart"
      >
        {/* Grid */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke="#e2e8f0"
              strokeDasharray="3,3"
            />
            <text x={padL - 8} y={yFor(t) + 4} textAnchor="end" fontSize="10" fill="#64748b">
              {formatPrice(t)}
            </text>
          </g>
        ))}
        {/* X axis labels */}
        {years.map((y, i) => (
          <text key={y} x={xFor(i)} y={H - 12} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="500">
            {y}
          </text>
        ))}
        {/* Lines per region */}
        {visibleRegions.map((r) => {
          const series = data[r.id] || [];
          const path = series
            .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.value)}`)
            .join(' ');
          return (
            <g key={r.id}>
              <path d={path} fill="none" stroke={r.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {series.map((d, i) => (
                <circle key={i} cx={xFor(i)} cy={yFor(d.value)} r="3.5" fill={r.color} stroke="#fff" strokeWidth="1.5">
                  <title>{`${r.name} ${d.year}: ${formatPrice(d.value)}${d.change ? ` (+${d.change}%)` : ''}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const MarketTrends = () => {
  const [selectedRegion, setSelectedRegion] = useState('konyaalti');
  const [trendData, setTrendData] = useState(DEFAULT_DATA);
  const [comparisonRegions, setComparisonRegions] = useState(REGION_META.map(r => r.id));
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchTrendData();
  }, []);

  const fetchTrendData = async () => {
    try {
      const data = await marketTrendsAPI.getAll();
      if (data && Object.keys(data).length > 0) {
        // Merge with defaults for missing regions
        const merged = { ...DEFAULT_DATA };
        Object.keys(data).forEach(k => {
          if (Array.isArray(data[k]) && data[k].length > 0) merged[k] = data[k];
        });
        setTrendData(merged);
      }
    } catch (error) {
      // ignore — defaults
    }
  };

  const currentData = trendData[selectedRegion] || DEFAULT_DATA[selectedRegion];
  const currentRegion = REGION_META.find(r => r.id === selectedRegion);
  const totalGrowth = currentData.length > 1
    ? (((currentData[currentData.length - 1].value - currentData[0].value) / currentData[0].value) * 100).toFixed(0)
    : 0;
  const lastYear = currentData[currentData.length - 1] || { value: 0, change: 0, year: '' };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleComparison = (id) => {
    setComparisonRegions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Years universe for the comparison table
  const allYears = useMemo(() => {
    const years = new Set();
    Object.values(trendData).forEach(arr => (arr || []).forEach(d => years.add(d.year)));
    return Array.from(years).sort();
  }, [trendData]);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <Badge className="bg-amber-500 text-white mb-4">
            <TrendingUp className="w-4 h-4 mr-1" />
            Piyasa Analizi
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
            Antalya Emlak Değer Artışı
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            2020'den 2026'ya — Antalya'nın farklı bölgelerindeki ortalama m² konut fiyat değişimleri.
          </p>
        </div>

        {/* Region Selector - Desktop */}
        <div className="hidden md:flex justify-center gap-2 mb-8 flex-wrap">
          {REGION_META.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              data-testid={`region-tab-${region.id}`}
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

        {/* Region Selector - Mobile (Swipeable) */}
        <div className="md:hidden relative mb-6">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center"
            aria-label="Sola kaydır"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center"
            aria-label="Sağa kaydır"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-8 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {REGION_META.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-xl font-medium transition-all duration-300 snap-center text-sm ${
                  selectedRegion === region.id ? 'text-white shadow-lg scale-105' : 'bg-white text-slate-600 shadow'
                }`}
                style={selectedRegion === region.id ? { backgroundColor: region.color } : {}}
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                {region.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Single region */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="lg:col-span-2 border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                {currentRegion?.name} - Yıllık Değer Değişimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="min-w-[520px]">
                  <SingleRegionChart data={currentData} color={currentRegion?.color || '#f59e0b'} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 sm:space-y-6">
            <Card className="border-none shadow-xl" style={{ borderLeft: `4px solid ${currentRegion?.color}` }}>
              <CardContent className="p-5 sm:p-6">
                <p className="text-slate-500 text-xs sm:text-sm mb-1">Toplam Değer Artışı (6 Yıl)</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-800">%{totalGrowth}</span>
                  <ArrowUpRight className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
              <CardContent className="p-5 sm:p-6">
                <p className="text-slate-500 text-xs sm:text-sm mb-1">{lastYear.year} Ortalama m² Fiyatı</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                  {formatPrice(lastYear.value || 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
              <CardContent className="p-5 sm:p-6">
                <p className="text-slate-500 text-xs sm:text-sm mb-1">Son Yıl Artış</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  +{lastYear.change || 0}%
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-amber-500 to-amber-600">
              <CardContent className="p-5 sm:p-6 text-white">
                <Calendar className="w-7 h-7 sm:w-8 sm:h-8 mb-2 opacity-80" />
                <p className="text-amber-100 text-xs sm:text-sm mb-1">Veri Güncellemesi</p>
                <p className="font-semibold">Nisan 2026</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Cards View - Quick summary all regions */}
        <div className="md:hidden mt-8">
          <h3 className="text-base font-semibold text-slate-800 mb-3">Tüm Bölgeler — Son Veriler</h3>
          <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {REGION_META.map((region) => {
              const arr = trendData[region.id] || DEFAULT_DATA[region.id];
              const lv = arr[arr.length - 1];
              const growth = (((lv.value - arr[0].value) / arr[0].value) * 100).toFixed(0);
              return (
                <Card
                  key={region.id}
                  className="flex-shrink-0 w-60 border-none shadow-lg snap-center"
                  style={{ borderTop: `4px solid ${region.color}` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 text-sm">{region.name}</h4>
                      <Badge className="bg-green-100 text-green-700 text-xs">+{growth}%</Badge>
                    </div>
                    <p className="text-xl font-bold text-slate-800">{formatPrice(lv.value)}</p>
                    <p className="text-[11px] text-slate-500">{lv.year} Ortalama</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Interactive Comparison Tool */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-6 sm:mb-8">
            <Badge className="bg-slate-800 text-white mb-3">
              <LineChartIcon className="w-4 h-4 mr-1" />
              İnteraktif Karşılaştırma
            </Badge>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              Bölgeleri Yan Yana Kıyaslayın
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Görmek istediğiniz bölgeleri seçin; trend çizgileri ve yıllık karşılaştırma tablosu güncellensin.
            </p>
          </div>

          {/* Region toggles */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {REGION_META.map((r) => {
              const active = comparisonRegions.includes(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => toggleComparison(r.id)}
                  data-testid={`compare-toggle-${r.id}`}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border-2 transition-all ${
                    active ? 'text-white shadow-md' : 'bg-white text-slate-500 border-slate-200'
                  }`}
                  style={
                    active
                      ? { backgroundColor: r.color, borderColor: r.color }
                      : {}
                  }
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: active ? '#fff' : r.color }}
                  />
                  {r.name}
                </button>
              );
            })}
          </div>

          {/* Line chart */}
          <Card className="border-none shadow-xl mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <LineChartIcon className="w-5 h-5 text-amber-500" />
                Yıllara Göre m² Fiyat Trendi
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {comparisonRegions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Karşılaştırmak için en az bir bölge seçin.
                </div>
              ) : (
                <ComparisonLineChart
                  data={trendData}
                  regions={REGION_META}
                  selectedIds={comparisonRegions}
                />
              )}
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Card className="border-none shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TableIcon className="w-5 h-5 text-amber-500" />
                Karşılaştırma Tablosu (m² Fiyatları)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="min-w-full text-xs sm:text-sm" data-testid="comparison-table">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left font-semibold text-slate-700 py-2 px-2 sm:px-3 sticky left-0 bg-white z-10">Bölge</th>
                      {allYears.map((y) => (
                        <th key={y} className="text-right font-semibold text-slate-700 py-2 px-2 sm:px-3 whitespace-nowrap">
                          {y}
                        </th>
                      ))}
                      <th className="text-right font-semibold text-slate-700 py-2 px-2 sm:px-3 whitespace-nowrap">
                        Toplam Artış
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {REGION_META.filter(r => comparisonRegions.includes(r.id)).map((r) => {
                      const arr = trendData[r.id] || DEFAULT_DATA[r.id];
                      const byYear = Object.fromEntries(arr.map(d => [d.year, d]));
                      const first = arr[0]?.value || 0;
                      const last = arr[arr.length - 1]?.value || 0;
                      const total = first ? (((last - first) / first) * 100).toFixed(0) : 0;
                      return (
                        <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-2.5 px-2 sm:px-3 sticky left-0 bg-white z-10">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                              <span className="font-medium text-slate-800">{r.name}</span>
                            </div>
                          </td>
                          {allYears.map((y) => (
                            <td key={y} className="text-right py-2.5 px-2 sm:px-3 text-slate-700 whitespace-nowrap">
                              {byYear[y] ? formatPrice(byYear[y].value) : '—'}
                            </td>
                          ))}
                          <td className="text-right py-2.5 px-2 sm:px-3 whitespace-nowrap">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-green-100 text-green-700 font-semibold">
                              %{total}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {comparisonRegions.length === 0 && (
                      <tr>
                        <td colSpan={allYears.length + 2} className="text-center py-8 text-slate-500">
                          Tabloyu doldurmak için en az bir bölge seçin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="md:hidden text-[11px] text-slate-400 mt-2 text-center">
                ← Tablodaki tüm yılları görmek için yatayda kaydırın →
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated Footer */}
        <div className="mt-10 sm:mt-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs sm:text-sm text-slate-500"
            data-testid="last-updated-note"
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            <span><strong className="text-slate-700">Son Güncelleme:</strong> Nisan 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketTrends;
