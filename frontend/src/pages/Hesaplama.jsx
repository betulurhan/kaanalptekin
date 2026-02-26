import React, { useState, useEffect } from 'react';
import { Calculator, Home, Percent, PiggyBank, TrendingUp, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SEOHead } from '../components/SEOHead';
import { useSEO } from '../context/SEOContext';
import { ilceAPI } from '../services/api';

export const Hesaplama = () => {
  const { seoSettings } = useSEO();
  const [ilceVerileri, setIlceVerileri] = useState([]);
  
  useEffect(() => {
    loadIlceVerileri();
  }, []);

  const loadIlceVerileri = async () => {
    try {
      const data = await ilceAPI.getAll(true); // sadece aktif olanlar
      setIlceVerileri(data);
    } catch (error) {
      console.error('İlçe verileri yüklenemedi:', error);
    }
  };
  
  // Taksit Hesaplama State
  const [taksitData, setTaksitData] = useState({
    satisFiyati: '',
    pesinatOrani: '20',
    vade: '12'
  });
  const [taksitSonuc, setTaksitSonuc] = useState(null);

  // Emlak Vergisi State
  const [emlakData, setEmlakData] = useState({
    gayrimenkulDegeri: '',
    gayrimenkulTuru: 'konut',
    konum: 'buyuksehir'
  });
  const [emlakSonuc, setEmlakSonuc] = useState(null);

  // Mevduat Faizi State
  const [mevduatData, setMevduatData] = useState({
    anapara: '',
    faizOrani: '45',
    vade: '12'
  });
  const [mevduatSonuc, setMevduatSonuc] = useState(null);

  // Kira Getirisi State
  const [kiraData, setKiraData] = useState({
    ilce: '',
    metrekare: '',
    satisFiyati: '',
    aylikKira: ''
  });
  const [kiraSonuc, setKiraSonuc] = useState(null);

  // Taksit Hesaplama
  const hesaplaTaksit = () => {
    const fiyat = parseFloat(taksitData.satisFiyati.replace(/[.,]/g, '')) || 0;
    const pesinatOrani = parseFloat(taksitData.pesinatOrani) / 100;
    const vade = parseInt(taksitData.vade);

    const pesinat = fiyat * pesinatOrani;
    const kalanBorc = fiyat - pesinat;
    const aylikTaksit = kalanBorc / vade;

    setTaksitSonuc({
      pesinat,
      kalanBorc,
      aylikTaksit,
      toplamOdeme: fiyat,
      vade
    });
  };

  // Emlak Vergisi Hesaplama (Antalya - Büyükşehir oranları)
  const hesaplaEmlakVergisi = () => {
    const deger = parseFloat(emlakData.gayrimenkulDegeri.replace(/[.,]/g, '')) || 0;
    
    // 2024 Emlak Vergisi Oranları (Büyükşehir)
    // Konut: Binde 2, İşyeri: Binde 4, Arsa: Binde 6, Arazi: Binde 2
    const oranlar = {
      konut: 0.002,      // Binde 2
      isyeri: 0.004,     // Binde 4
      arsa: 0.006,       // Binde 6
      arazi: 0.002       // Binde 2
    };

    const oran = oranlar[emlakData.gayrimenkulTuru] || 0.002;
    const yillikVergi = deger * oran;
    
    // Taşınmaz Kültür Varlıkları Katkı Payı (%10)
    const kulturKatkiPayi = yillikVergi * 0.10;
    
    const toplamVergi = yillikVergi + kulturKatkiPayi;

    setEmlakSonuc({
      gayrimenkulDegeri: deger,
      vergiOrani: oran * 1000,
      yillikVergi,
      kulturKatkiPayi,
      toplamVergi,
      taksit1: toplamVergi / 2, // Mart-Mayıs
      taksit2: toplamVergi / 2  // Kasım
    });
  };

  // Mevduat Faizi Hesaplama
  const hesaplaMevduatFaizi = () => {
    const anapara = parseFloat(mevduatData.anapara.replace(/[.,]/g, '')) || 0;
    const yillikFaiz = parseFloat(mevduatData.faizOrani) / 100;
    const vadeAy = parseInt(mevduatData.vade);

    // Basit faiz hesabı
    const brutFaiz = anapara * yillikFaiz * (vadeAy / 12);
    const stopaj = brutFaiz * 0.15; // %15 stopaj
    const netFaiz = brutFaiz - stopaj;
    const vadeSonuToplam = anapara + netFaiz;
    const aylikOrtalama = netFaiz / vadeAy;

    setMevduatSonuc({
      anapara,
      brutFaiz,
      stopaj,
      netFaiz,
      vadeSonuToplam,
      aylikOrtalama,
      vadeAy
    });
  };

  // Para formatla
  const formatPara = (sayi) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(sayi);
  };

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <SEOHead 
        title="Hesaplama Araçları | Gayrimenkul Hesaplayıcı" 
        description="Taksit hesaplama, emlak vergisi hesaplama, mevduat faizi hesaplama araçları. Antalya gayrimenkul yatırımı için faydalı hesaplayıcılar." 
      />
      
      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calculator className="w-16 h-16 mx-auto mb-4 text-amber-400" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hesaplama Araçları</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Gayrimenkul yatırımınız için ihtiyacınız olan tüm hesaplama araçları
          </p>
        </div>
      </section>

      {/* Calculator Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* 1. Taksit Hesaplama */}
            <Card className="shadow-xl border-t-4 border-t-amber-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Home className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Taksit Hesaplama</CardTitle>
                    <CardDescription>Aylık taksit tutarınızı hesaplayın</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Satış Fiyatı (₺)</Label>
                  <Input
                    type="text"
                    placeholder="2.500.000"
                    value={taksitData.satisFiyati}
                    onChange={(e) => setTaksitData({ ...taksitData, satisFiyati: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Peşinat Oranı (%)</Label>
                  <Select value={taksitData.pesinatOrani} onValueChange={(v) => setTaksitData({ ...taksitData, pesinatOrani: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">%10</SelectItem>
                      <SelectItem value="20">%20</SelectItem>
                      <SelectItem value="25">%25</SelectItem>
                      <SelectItem value="30">%30</SelectItem>
                      <SelectItem value="35">%35</SelectItem>
                      <SelectItem value="40">%40</SelectItem>
                      <SelectItem value="50">%50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vade (Ay)</Label>
                  <Select value={taksitData.vade} onValueChange={(v) => setTaksitData({ ...taksitData, vade: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 Ay</SelectItem>
                      <SelectItem value="12">12 Ay</SelectItem>
                      <SelectItem value="18">18 Ay</SelectItem>
                      <SelectItem value="24">24 Ay</SelectItem>
                      <SelectItem value="36">36 Ay</SelectItem>
                      <SelectItem value="48">48 Ay</SelectItem>
                      <SelectItem value="60">60 Ay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={hesaplaTaksit} className="w-full bg-amber-500 hover:bg-amber-600">
                  Hesapla
                </Button>

                {taksitSonuc && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Peşinat:</span>
                      <span className="font-semibold">{formatPara(taksitSonuc.pesinat)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Kalan Borç:</span>
                      <span className="font-semibold">{formatPara(taksitSonuc.kalanBorc)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Vade:</span>
                      <span className="font-semibold">{taksitSonuc.vade} Ay</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg">
                      <span className="text-slate-800 font-semibold">Aylık Taksit:</span>
                      <span className="font-bold text-amber-600">{formatPara(taksitSonuc.aylikTaksit)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Emlak Vergisi Hesaplama */}
            <Card className="shadow-xl border-t-4 border-t-blue-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Percent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Emlak Vergisi</CardTitle>
                    <CardDescription>Antalya için yıllık vergi hesabı</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Gayrimenkul Değeri (₺)</Label>
                  <Input
                    type="text"
                    placeholder="2.500.000"
                    value={emlakData.gayrimenkulDegeri}
                    onChange={(e) => setEmlakData({ ...emlakData, gayrimenkulDegeri: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Gayrimenkul Türü</Label>
                  <Select value={emlakData.gayrimenkulTuru} onValueChange={(v) => setEmlakData({ ...emlakData, gayrimenkulTuru: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="konut">Konut (Binde 2)</SelectItem>
                      <SelectItem value="isyeri">İşyeri (Binde 4)</SelectItem>
                      <SelectItem value="arsa">Arsa (Binde 6)</SelectItem>
                      <SelectItem value="arazi">Arazi (Binde 2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <strong>Not:</strong> Antalya büyükşehir belediyesi oranları uygulanmaktadır.
                </div>
                <Button onClick={hesaplaEmlakVergisi} className="w-full bg-blue-500 hover:bg-blue-600">
                  Hesapla
                </Button>

                {emlakSonuc && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Vergi Oranı:</span>
                      <span className="font-semibold">Binde {emlakSonuc.vergiOrani}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Yıllık Vergi:</span>
                      <span className="font-semibold">{formatPara(emlakSonuc.yillikVergi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Kültür Katkı Payı (%10):</span>
                      <span className="font-semibold">{formatPara(emlakSonuc.kulturKatkiPayi)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg">
                      <span className="text-slate-800 font-semibold">Toplam Vergi:</span>
                      <span className="font-bold text-blue-600">{formatPara(emlakSonuc.toplamVergi)}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      <p>1. Taksit (Mart-Mayıs): {formatPara(emlakSonuc.taksit1)}</p>
                      <p>2. Taksit (Kasım): {formatPara(emlakSonuc.taksit2)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3. Mevduat Faizi Hesaplama */}
            <Card className="shadow-xl border-t-4 border-t-green-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <PiggyBank className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Mevduat Faizi</CardTitle>
                    <CardDescription>Vadeli mevduat getirisi hesabı</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Anapara (₺)</Label>
                  <Input
                    type="text"
                    placeholder="500.000"
                    value={mevduatData.anapara}
                    onChange={(e) => setMevduatData({ ...mevduatData, anapara: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Yıllık Faiz Oranı (%)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      placeholder="45"
                      value={mevduatData.faizOrani}
                      onChange={(e) => setMevduatData({ ...mevduatData, faizOrani: e.target.value })}
                    />
                    <div className="flex items-center px-3 bg-green-50 rounded-lg text-green-700 text-sm whitespace-nowrap">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Güncel
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Güncel banka faiz oranını girin</p>
                </div>
                <div>
                  <Label>Vade (Ay)</Label>
                  <Select value={mevduatData.vade} onValueChange={(v) => setMevduatData({ ...mevduatData, vade: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Ay</SelectItem>
                      <SelectItem value="3">3 Ay</SelectItem>
                      <SelectItem value="6">6 Ay</SelectItem>
                      <SelectItem value="12">12 Ay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={hesaplaMevduatFaizi} className="w-full bg-green-500 hover:bg-green-600">
                  Hesapla
                </Button>

                {mevduatSonuc && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Anapara:</span>
                      <span className="font-semibold">{formatPara(mevduatSonuc.anapara)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Brüt Faiz:</span>
                      <span className="font-semibold">{formatPara(mevduatSonuc.brutFaiz)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Stopaj (%15):</span>
                      <span className="font-semibold text-red-500">-{formatPara(mevduatSonuc.stopaj)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-slate-600">Net Faiz Geliri:</span>
                      <span className="font-bold text-green-600">{formatPara(mevduatSonuc.netFaiz)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-slate-800 font-semibold">Vade Sonu Toplam:</span>
                      <span className="font-bold text-green-600">{formatPara(mevduatSonuc.vadeSonuToplam)}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      <p>Aylık Ortalama Getiri: {formatPara(mevduatSonuc.aylikOrtalama)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Neden Bu Araçları Kullanmalısınız?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Doğru Bütçe Planlaması</h3>
              <p className="text-sm text-slate-600">Aylık taksitlerinizi önceden hesaplayarak bütçenizi planlayın.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Percent className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Vergi Bilinci</h3>
              <p className="text-sm text-slate-600">Yıllık emlak vergisi maliyetinizi önceden öğrenin.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Akıllı Yatırım</h3>
              <p className="text-sm text-slate-600">Peşin paranızı değerlendirerek taksitlerinizi finanse edin.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hesaplama;
