import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, ArrowRight, Home, Filter, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SEOHead } from '../components/SEOHead';
import { useSiteData } from '../context/SiteDataContext';
import { resaleAPI } from '../services/api';
import { resolveImageUrl } from '../utils/imageUrl';
import { TalepFormu } from '../components/TalepFormu';

export const GuncelIlanlar = () => {
  const { seoSettings } = useSiteData();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTalepModal, setShowTalepModal] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    priceRange: 'all'
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await resaleAPI.getAll(
        filters.type !== 'all' ? filters.type : null,
        filters.location !== 'all' ? filters.location : null
      );
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const propertyTypes = [
    { value: 'all', label: 'Tümü' },
    { value: 'Daire', label: 'Daire' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Arsa', label: 'Arsa' },
    { value: 'Dükkan', label: 'Dükkan' },
    { value: 'Ofis', label: 'Ofis' }
  ];

  const locations = [
    { value: 'all', label: 'Tüm Bölgeler' },
    { value: 'Konyaaltı', label: 'Konyaaltı' },
    { value: 'Muratpaşa', label: 'Muratpaşa' },
    { value: 'Kepez', label: 'Kepez' },
    { value: 'Döşemealtı', label: 'Döşemealtı' },
    { value: 'Aksu', label: 'Aksu' },
    { value: 'Lara', label: 'Lara' },
    { value: 'Altıntaş', label: 'Altıntaş' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Tüm Fiyatlar' },
    { value: '0-2000000', label: '2 Milyon TL\'ye kadar' },
    { value: '2000000-5000000', label: '2-5 Milyon TL' },
    { value: '5000000-10000000', label: '5-10 Milyon TL' },
    { value: '10000000+', label: '10 Milyon TL üzeri' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead 
        title="Güncel İlanlar | 2. El Satılık & Kiralık" 
        description="Antalya'da satılık ve kiralık daire, villa, arsa ilanları. Güncel 2. el gayrimenkul portföyümüzü keşfedin." 
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-amber-500 text-white mb-4">2. El Portföy</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Güncel İlanlar</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Antalya'nın en seçkin lokasyonlarında satılık ve kiralık gayrimenkul ilanlarını keşfedin.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filtrele:</span>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {/* Property Type Filter */}
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              {/* Location Filter */}
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {locations.map((loc) => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>

              {/* Price Filter */}
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
            
            <div className="text-slate-500 text-sm">
              {listings.length} ilan bulundu
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Henüz ilan bulunmuyor</h3>
              <p className="text-slate-500">Seçtiğiniz kriterlere uygun ilan bulunamadı.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  className="group cursor-pointer overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={resolveImageUrl(listing.image || listing.images?.[0], { width: 400, quality: 50 })}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-amber-500">{listing.property_type}</Badge>
                    <Badge className={`absolute top-4 right-4 ${listing.listing_type === 'sale' ? 'bg-green-500' : 'bg-blue-500'}`}>
                      {listing.listing_type === 'sale' ? 'Satılık' : 'Kiralık'}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">
                      {listing.title}
                    </h3>
                    <div className="flex items-center text-slate-500 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{listing.location}, {listing.district}</span>
                    </div>
                    
                    {/* Property Details */}
                    <div className="flex items-center gap-4 mb-4 text-slate-600">
                      {listing.rooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span className="text-sm">{listing.rooms}</span>
                        </div>
                      )}
                      {listing.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span className="text-sm">{listing.bathrooms}</span>
                        </div>
                      )}
                      {listing.area_m2 && (
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          <span className="text-sm">{listing.area_m2} m²</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">{listing.price}</span>
                      <Link
                        to="/iletisim"
                        className="text-slate-600 hover:text-amber-600 font-medium flex items-center gap-1 transition-colors"
                      >
                        İletişim <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Aradığınız İlanı Bulamadınız mı?
          </h2>
          <p className="text-amber-100 mb-8">
            Kriterlerinizi bize iletin, size uygun ilanları bulduğumuzda haber verelim.
            <span className="block mt-2 font-semibold">3 gün içinde size geri dönüş yapılacaktır.</span>
          </p>
          <Button
            size="lg"
            className="bg-white text-amber-600 hover:bg-amber-50"
            onClick={() => setShowTalepModal(true)}
            data-testid="guncel-ilanlar-talep-btn"
          >
            Talep Oluştur
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Talep Modal */}
      {showTalepModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowTalepModal(false)}
          data-testid="talep-modal-overlay"
        >
          <div
            className="relative w-full max-w-lg my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTalepModal(false)}
              data-testid="talep-modal-close"
              className="absolute -top-3 -right-3 z-10 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
            <TalepFormu onClose={() => setShowTalepModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GuncelIlanlar;
