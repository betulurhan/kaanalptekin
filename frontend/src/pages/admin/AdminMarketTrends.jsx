import React, { useState, useEffect } from 'react';
import { Save, TrendingUp, Plus, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { marketTrendsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const REGIONS = [
  { id: 'konyaalti', name: 'Konyaaltı' },
  { id: 'muratpasa', name: 'Muratpaşa' },
  { id: 'kepez', name: 'Kepez' },
  { id: 'aksu', name: 'Aksu' },
  { id: 'dosemealti', name: 'Döşemealtı' },
  { id: 'altintas', name: 'Altıntaş' }
];

const DEFAULT_REGION_DATA = () => [
  { year: '2020', value: 0, change: 0 },
  { year: '2021', value: 0, change: 0 },
  { year: '2022', value: 0, change: 0 },
  { year: '2023', value: 0, change: 0 },
  { year: '2024', value: 0, change: 0 },
  { year: '2025', value: 0, change: 0 }
];

const AdminMarketTrends = () => {
  const { token } = useAuth();
  const [trends, setTrends] = useState({});
  const [activeRegion, setActiveRegion] = useState('konyaalti');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const data = await marketTrendsAPI.getAll();
      const initial = {};
      REGIONS.forEach(r => {
        initial[r.id] = data[r.id] || DEFAULT_REGION_DATA();
      });
      setTrends(initial);
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateYearValue = (regionId, idx, field, value) => {
    setTrends(prev => {
      const regionData = [...(prev[regionId] || [])];
      regionData[idx] = {
        ...regionData[idx],
        [field]: field === 'year' ? value : Number(value) || 0
      };
      return { ...prev, [regionId]: regionData };
    });
  };

  const recalculateChanges = (regionId) => {
    setTrends(prev => {
      const regionData = [...(prev[regionId] || [])];
      const updated = regionData.map((item, idx) => {
        if (idx === 0) return { ...item, change: 0 };
        const prevValue = regionData[idx - 1].value;
        if (!prevValue) return { ...item, change: 0 };
        const change = ((item.value - prevValue) / prevValue) * 100;
        return { ...item, change: Math.round(change * 10) / 10 };
      });
      return { ...prev, [regionId]: updated };
    });
    toast.success('Değişim oranları yeniden hesaplandı');
  };

  const addYear = (regionId) => {
    setTrends(prev => {
      const regionData = [...(prev[regionId] || [])];
      const lastYear = regionData.length > 0
        ? parseInt(regionData[regionData.length - 1].year) + 1
        : new Date().getFullYear();
      regionData.push({ year: String(lastYear), value: 0, change: 0 });
      return { ...prev, [regionId]: regionData };
    });
  };

  const removeYear = (regionId, idx) => {
    setTrends(prev => {
      const regionData = [...(prev[regionId] || [])];
      regionData.splice(idx, 1);
      return { ...prev, [regionId]: regionData };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await marketTrendsAPI.update(token, { data: trends });
      toast.success('Piyasa trendi başarıyla güncellendi');
    } catch (error) {
      toast.error('Güncelleme başarısız oldu');
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M ₺`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K ₺`;
    return `${value} ₺`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12" data-testid="admin-market-trends-loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const currentRegionData = trends[activeRegion] || [];

  return (
    <div className="space-y-6" data-testid="admin-market-trends-page">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            Piyasa Trendi Yönetimi
          </h1>
          <p className="text-slate-500">Antalya bölge bazlı m² fiyat verilerini yönetin</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          data-testid="admin-market-trends-save-btn"
          className="bg-amber-500 hover:bg-amber-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
        </Button>
      </div>

      {/* Region Tabs */}
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveRegion(r.id)}
            data-testid={`admin-market-region-${r.id}`}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeRegion === r.id
                ? 'bg-slate-800 text-white shadow-lg'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Year Editor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{REGIONS.find(r => r.id === activeRegion)?.name} - Yıllık m² Fiyatları</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => recalculateChanges(activeRegion)}
              data-testid="admin-market-recalc-btn"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Değişimi Hesapla
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addYear(activeRegion)}
              data-testid="admin-market-add-year-btn"
            >
              <Plus className="w-4 h-4 mr-1" />
              Yıl Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-sm font-medium text-slate-600 pb-3">Yıl</th>
                  <th className="text-left text-sm font-medium text-slate-600 pb-3">Ortalama m² Fiyatı (₺)</th>
                  <th className="text-left text-sm font-medium text-slate-600 pb-3">Değişim (%)</th>
                  <th className="text-left text-sm font-medium text-slate-600 pb-3">Önizleme</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {currentRegionData.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="py-3 pr-3">
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => updateYearValue(activeRegion, idx, 'year', e.target.value)}
                        data-testid={`admin-market-year-${idx}`}
                        className="w-24 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => updateYearValue(activeRegion, idx, 'value', e.target.value)}
                        data-testid={`admin-market-value-${idx}`}
                        className="w-40 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <input
                        type="number"
                        step="0.1"
                        value={item.change}
                        onChange={(e) => updateYearValue(activeRegion, idx, 'change', e.target.value)}
                        data-testid={`admin-market-change-${idx}`}
                        className="w-24 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <Badge className={item.change > 0 ? 'bg-green-500' : item.change < 0 ? 'bg-red-500' : 'bg-slate-400'}>
                        {formatPrice(item.value)} {item.change !== 0 && `(${item.change > 0 ? '+' : ''}${item.change}%)`}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeYear(activeRegion, idx)}
                        data-testid={`admin-market-remove-${idx}`}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentRegionData.length === 0 && (
              <p className="text-center text-slate-500 py-8">Henüz veri yok. "Yıl Ekle" ile başlayın.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4 text-sm text-amber-900">
          <strong>Not:</strong> Veriler ana sayfadaki "Antalya Emlak Değer Artışı" bölümünde yayınlanır.
          Tüm bölgeler için değişiklik yaptıktan sonra "Tüm Değişiklikleri Kaydet" butonuna basın.
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMarketTrends;
