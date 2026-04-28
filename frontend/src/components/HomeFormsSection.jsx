import React, { useState } from 'react';
import { FileText, ClipboardList, Clock, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TalepFormu } from './TalepFormu';
import { EkspertizFormu } from './EkspertizFormu';

export const HomeFormsSection = () => {
  const [activeTab, setActiveTab] = useState('talep');

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden bg-slate-50">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-slate-200/60 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs sm:text-sm font-semibold mb-4"
            data-testid="home-forms-sla-badge"
          >
            <Clock className="w-4 h-4" />
            3 Gün İçinde Dönüş Garantisi
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 leading-tight">
            Aradığınızı Bulalım,{' '}
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              Mülkünüzü Değerlendirelim
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Hızlı talep formuyla aradığınız gayrimenkulü bildirin veya ücretsiz ekspertiz için
            mülk bilgilerinizi paylaşın.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 max-w-md mx-auto mb-6 sm:mb-8 bg-white shadow-md p-1.5 h-auto rounded-xl"
            data-testid="home-forms-tabs"
          >
            <TabsTrigger
              value="talep"
              data-testid="home-forms-tab-talep"
              className="gap-2 py-2.5 sm:py-3 text-sm sm:text-base data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg transition-all"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">Talep Formu</span>
              <span className="xs:hidden sm:hidden">Talep</span>
            </TabsTrigger>
            <TabsTrigger
              value="ekspertiz"
              data-testid="home-forms-tab-ekspertiz"
              className="gap-2 py-2.5 sm:py-3 text-sm sm:text-base data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">Ekspertiz</span>
              <span className="xs:hidden sm:hidden">Ekspertiz</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="talep" className="mt-0">
            <TalepFormu onClose={() => {}} />
          </TabsContent>
          <TabsContent value="ekspertiz" className="mt-0">
            <EkspertizFormu onClose={() => {}} />
          </TabsContent>
        </Tabs>

        {/* Trust strip */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Ücretsiz Danışmanlık</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Hızlı Geri Dönüş</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Kişisel Veri Güvenliği</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFormsSection;
