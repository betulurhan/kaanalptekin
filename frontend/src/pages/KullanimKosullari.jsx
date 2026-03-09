import React from 'react';
import { FileText } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const KullanimKosullari = () => {
  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <SEOHead 
        title="Kullanım Koşulları | Kaan Alp Tekin" 
        description="Kaan Alp Tekin Gayrimenkul Danışmanlığı web sitesi kullanım koşulları ve şartları." 
      />
      
      {/* Hero */}
      <section className="bg-slate-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-amber-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Kullanım Koşulları</h1>
          <p className="text-slate-300 mt-2">Son güncelleme: Şubat 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Genel Hükümler</h2>
              <p className="text-slate-600 leading-relaxed">
                Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. 
                Web sitemizi kullanmadan önce bu koşulları dikkatlice okumanızı öneririz. 
                Bu koşulları kabul etmiyorsanız, lütfen web sitemizi kullanmayınız.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Hizmet Tanımı</h2>
              <p className="text-slate-600 leading-relaxed">
                Kaan Alp Tekin Gayrimenkul Danışmanlığı, Antalya ve çevresinde gayrimenkul 
                danışmanlığı, proje koordinatörlüğü ve yatırım danışmanlığı hizmetleri sunmaktadır. 
                Web sitemiz, hizmetlerimiz, projelerimiz ve iletişim bilgilerimiz hakkında 
                bilgi sağlamak amacıyla tasarlanmıştır.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Fikri Mülkiyet Hakları</h2>
              <p className="text-slate-600 leading-relaxed">
                Bu web sitesindeki tüm içerik, tasarım, logo, grafik, fotoğraf ve metinler 
                Kaan Alp Tekin Gayrimenkul Danışmanlığı'na aittir veya lisanslıdır. 
                İçeriklerin izinsiz kopyalanması, çoğaltılması veya dağıtılması yasaktır.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Kullanıcı Sorumlulukları</h2>
              <p className="text-slate-600 leading-relaxed mb-3">Web sitemizi kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Doğru ve güncel bilgiler sağlamak</li>
                <li>Yasalara aykırı amaçlarla kullanmamak</li>
                <li>Web sitesinin güvenliğini tehlikeye atacak eylemlerden kaçınmak</li>
                <li>Diğer kullanıcıların haklarına saygı göstermek</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Bilgilerin Doğruluğu</h2>
              <p className="text-slate-600 leading-relaxed">
                Web sitemizde yer alan proje bilgileri, fiyatlar ve diğer detaylar bilgilendirme 
                amaçlıdır ve önceden haber vermeksizin değiştirilebilir. Kesin bilgi için 
                lütfen bizimle iletişime geçiniz. Yayınlanan fiyatlar taahhüt niteliği taşımaz.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Üçüncü Taraf Bağlantılar</h2>
              <p className="text-slate-600 leading-relaxed">
                Web sitemiz, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu bağlantılar 
                kolaylık sağlamak amacıyla sunulmaktadır. Bu sitelerin içeriğinden veya 
                gizlilik uygulamalarından sorumlu değiliz.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Sorumluluk Sınırlaması</h2>
              <p className="text-slate-600 leading-relaxed">
                Web sitemizin kullanımından kaynaklanan doğrudan veya dolaylı zararlardan 
                sorumlu tutulamayız. Web sitesi "olduğu gibi" sunulmaktadır ve kesintisiz 
                veya hatasız çalışacağı garanti edilmemektedir.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Değişiklikler</h2>
              <p className="text-slate-600 leading-relaxed">
                Bu kullanım koşullarını herhangi bir zamanda değiştirme hakkını saklı tutarız. 
                Değişiklikler web sitemizde yayınlandığı anda yürürlüğe girer. Web sitemizi 
                düzenli olarak ziyaret ederek güncellemelerden haberdar olmanızı öneririz.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Uygulanacak Hukuk</h2>
              <p className="text-slate-600 leading-relaxed">
                Bu kullanım koşulları Türkiye Cumhuriyeti kanunlarına tabidir. 
                Herhangi bir uyuşmazlık durumunda Antalya Mahkemeleri ve İcra Daireleri yetkilidir.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">10. İletişim</h2>
              <p className="text-slate-600 leading-relaxed">
                Kullanım koşulları hakkında sorularınız için bizimle iletişime geçebilirsiniz. 
                İletişim bilgilerimize web sitemizin "İletişim" sayfasından ulaşabilirsiniz.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default KullanimKosullari;
