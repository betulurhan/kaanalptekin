import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { SEOHead } from '../components/SEOHead';
import { useSiteData } from '../context/SiteDataContext';
import { MarketTrends } from '../components/MarketTrends';

export const DegerArtisi = () => {
  const { seoSettings } = useSiteData();

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="Değer Artışı | Antalya Emlak Piyasa Analizi"
        description="Antalya'nın bölgelerine göre son 5 yılın konut m² fiyat değişimi ve piyasa trendleri."
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-amber-500 text-white mb-4">
            <TrendingUp className="w-4 h-4 mr-1" />
            Piyasa Analizi
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Antalya Emlak Değer Artışı
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Konyaaltı'ndan Aksu'ya, Antalya bölgelerinin son 5 yıldaki ortalama m² fiyat değişimini
            ve gerçek yatırım potansiyelini inceleyin.
          </p>
        </div>
      </section>

      {/* Market Trends */}
      <MarketTrends />
    </div>
  );
};

export default DegerArtisi;
