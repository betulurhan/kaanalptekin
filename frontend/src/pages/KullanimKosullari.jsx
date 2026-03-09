import React from 'react';
import { FileText, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

export const KullanimKosullari = () => {
  const currentDate = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  
  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <SEOHead 
        title="Kullanım Koşulları | Kaan Alp Tekin - Gayrimenkul Danışmanlığı" 
        description="Kaan Alp Tekin Gayrimenkul Danışmanlığı web sitesi kullanım koşulları, şartları ve hukuki bilgilendirme." 
      />
      
      {/* Hero */}
      <section className="bg-slate-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-amber-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Kullanım Koşulları</h1>
          <p className="text-slate-300 mt-2">Son güncelleme: {currentDate}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Uyarı */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">
                Bu web sitesini kullanmaya devam ederek, aşağıda belirtilen tüm koşulları 
                okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz.
              </p>
            </div>

            {/* 1. Taraflar ve Tanımlar */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Taraflar ve Tanımlar</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                İşbu Kullanım Koşulları Sözleşmesi ("Sözleşme"), Kaan Alp Tekin Gayrimenkul 
                Danışmanlığı ("Şirket", "biz", "bizim") ile web sitesini kullanan gerçek 
                veya tüzel kişi ("Kullanıcı", "siz", "sizin") arasında akdedilmiştir.
              </p>
              <p className="text-slate-600 leading-relaxed">
                <strong>"Web Sitesi":</strong> kaanalptekin.com alan adı altında yayınlanan 
                ve Şirket tarafından işletilen internet sitesi ile tüm alt sayfaları.
              </p>
            </div>

            {/* 2. Hizmet Kapsamı */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Hizmet Kapsamı</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Kaan Alp Tekin Gayrimenkul Danışmanlığı, Antalya ili başta olmak üzere 
                Türkiye genelinde aşağıdaki hizmetleri sunmaktadır:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Konut ve ticari gayrimenkul alım-satım danışmanlığı</li>
                <li>Kiralama danışmanlığı</li>
                <li>Gayrimenkul yatırım danışmanlığı</li>
                <li>Proje koordinatörlüğü</li>
                <li>Gayrimenkul değerleme hizmetleri</li>
                <li>Pazar araştırması ve analizi</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-3">
                Web sitemiz, bu hizmetler, mevcut projeler ve iletişim bilgilerimiz 
                hakkında bilgilendirme amacıyla tasarlanmıştır.
              </p>
            </div>

            {/* 3. Kullanım Şartları */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Kullanım Şartları ve Koşulları</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Web sitemizi kullanırken aşağıdaki koşullara uymayı kabul ve taahhüt edersiniz:
              </p>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">3.1. Genel Kullanım Kuralları</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>Web sitesini yalnızca yasal amaçlarla kullanmak</li>
                <li>Doğru, güncel ve eksiksiz bilgiler sağlamak</li>
                <li>Başkalarının haklarına saygı göstermek</li>
                <li>Web sitesinin normal işleyişini bozmamak</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">3.2. Yasak Eylemler</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>Zararlı yazılım veya kod yüklemek veya yaymak</li>
                <li>Web sitesinin güvenlik önlemlerini aşmaya çalışmak</li>
                <li>Sahte, yanıltıcı veya aldatıcı bilgi sağlamak</li>
                <li>Spam, zincirleme mesaj veya istenmeyen iletişimler göndermek</li>
                <li>Web sitesinin sunucu veya ağlarını aşırı yüklemek</li>
                <li>Otomatik veri toplama araçları (bot, scraper vb.) kullanmak</li>
              </ul>
            </div>

            {/* 4. Fikri Mülkiyet */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Fikri Mülkiyet Hakları</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Web sitesinde yer alan tüm içerikler fikri mülkiyet hakları kapsamında korunmaktadır:
              </p>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">4.1. Korunan İçerikler</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                <li>Web sitesi tasarımı ve düzeni</li>
                <li>Logo, marka ve ticari kimlik unsurları</li>
                <li>Metin, makale ve blog içerikleri</li>
                <li>Fotoğraf, görsel ve grafik materyaller</li>
                <li>Video ve multimedya içerikler</li>
                <li>Yazılım ve kaynak kodları</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">4.2. Kullanım Kısıtlamaları</h3>
              <p className="text-slate-600 leading-relaxed">
                Web sitesi içeriklerinin önceden yazılı izin alınmaksızın kısmen veya tamamen 
                kopyalanması, çoğaltılması, yeniden yayınlanması, dağıtılması, işlenmesi veya 
                ticari amaçlarla kullanılması kesinlikle yasaktır. İzinsiz kullanım halinde 
                yasal yollara başvurma hakkımız saklıdır.
              </p>
            </div>

            {/* 5. Proje ve Fiyat Bilgileri */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Proje ve Fiyat Bilgileri Hakkında</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Web sitemizde yer alan gayrimenkul projeleri ve fiyat bilgileri hakkında 
                önemli hususlar:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>Bilgilendirme amacı:</strong> Tüm proje detayları, fiyatlar, görseller 
                ve teknik özellikler yalnızca bilgilendirme amaçlıdır</li>
                <li><strong>Değişiklik hakkı:</strong> Proje bilgileri, fiyatlar ve özellikler 
                önceden haber vermeksizin değiştirilebilir</li>
                <li><strong>Taahhüt yoktur:</strong> Web sitesinde yayınlanan fiyatlar bağlayıcı 
                değildir ve satış taahhüdü niteliği taşımaz</li>
                <li><strong>Güncel bilgi:</strong> En güncel ve doğru bilgi için lütfen 
                doğrudan bizimle iletişime geçiniz</li>
                <li><strong>Görseller:</strong> Kullanılan görseller temsili olabilir ve 
                gerçek durumdan farklılık gösterebilir</li>
              </ul>
            </div>

            {/* 6. İletişim Formu */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. İletişim Formu ve Mesajlar</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Web sitemiz üzerinden gönderdiğiniz iletişim formları ve mesajlar hakkında:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Mesajlarınız mümkün olan en kısa sürede değerlendirilecektir</li>
                <li>Gönderilen bilgiler, Gizlilik Politikamız kapsamında işlenecektir</li>
                <li>Mesaj göndermeniz, sizinle iletişime geçmemiz için izin verdiğiniz anlamına gelir</li>
                <li>Spam, hakaret içeren veya uygunsuz mesajlar değerlendirmeye alınmayacaktır</li>
              </ul>
            </div>

            {/* 7. Üçüncü Taraf Bağlantılar */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Üçüncü Taraf Bağlantıları</h2>
              <p className="text-slate-600 leading-relaxed">
                Web sitemiz, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu bağlantılar 
                yalnızca kolaylık sağlamak amacıyla sunulmaktadır. Üçüncü taraf web sitelerinin 
                içeriği, gizlilik politikaları veya uygulamaları üzerinde hiçbir kontrolümüz 
                bulunmamaktadır ve bu sitelerden kaynaklanan herhangi bir zarar veya kayıptan 
                sorumlu tutulamayız. Üçüncü taraf sitelerine eriştiğinizde kendi risk ve 
                sorumluluğunuz dahilinde hareket ettiğinizi kabul edersiniz.
              </p>
            </div>

            {/* 8. Sorumluluk Sınırlaması */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Sorumluluk Sınırlaması ve Garanti Reddi</h2>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">8.1. Hizmet Sunumu</h3>
              <p className="text-slate-600 leading-relaxed">
                Web sitesi "OLDUĞU GİBİ" ve "MEVCUT OLDUĞU ŞEKİLDE" sunulmaktadır. Web sitesinin 
                kesintisiz, hatasız veya güvenli olacağına dair açık veya zımni hiçbir garanti verilmemektedir.
              </p>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">8.2. Zarar Sorumluluğu</h3>
              <p className="text-slate-600 leading-relaxed">
                Yasaların izin verdiği azami ölçüde, Şirket ve çalışanları, web sitesinin 
                kullanımından veya kullanılamamasından kaynaklanan doğrudan, dolaylı, arızi, 
                özel veya sonuç olarak ortaya çıkan zararlardan (kar kaybı, veri kaybı, 
                itibar kaybı dahil ancak bunlarla sınırlı olmaksızın) sorumlu tutulamaz.
              </p>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">8.3. Bilgi Doğruluğu</h3>
              <p className="text-slate-600 leading-relaxed">
                Web sitesinde yer alan bilgilerin doğruluğu ve güncelliği için azami özen 
                gösterilmekle birlikte, bilgilerin eksiksiz, doğru veya güncel olduğu garanti edilmez.
              </p>
            </div>

            {/* 9. Tazminat */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Tazminat Yükümlülüğü</h2>
              <p className="text-slate-600 leading-relaxed">
                Web sitesini bu Kullanım Koşullarına aykırı şekilde kullanmanızdan kaynaklanan 
                her türlü talep, dava, zarar, kayıp ve masrafa (avukatlık ücretleri dahil) 
                karşı Şirketi, yöneticilerini, çalışanlarını ve temsilcilerini tazmin etmeyi 
                ve zarar görmelerini engellemeyi kabul ve taahhüt edersiniz.
              </p>
            </div>

            {/* 10. Değişiklikler */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">10. Koşulların Değiştirilmesi</h2>
              <p className="text-slate-600 leading-relaxed">
                Bu Kullanım Koşullarını herhangi bir zamanda, tamamen kendi takdirimize bağlı 
                olarak değiştirme, güncelleme veya revize etme hakkını saklı tutarız. 
                Değişiklikler, web sitemizde yayınlandığı anda yürürlüğe girer. Web sitesini 
                değişikliklerden sonra kullanmaya devam etmeniz, güncellenen koşulları 
                kabul ettiğiniz anlamına gelir.
              </p>
            </div>

            {/* 11. Bölünebilirlik */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">11. Bölünebilirlik</h2>
              <p className="text-slate-600 leading-relaxed">
                Bu Kullanım Koşullarının herhangi bir hükmünün geçersiz veya uygulanamaz 
                bulunması halinde, söz konusu hüküm mümkün olan en dar kapsamda yorumlanacak 
                ve diğer hükümler tam olarak yürürlükte kalmaya devam edecektir.
              </p>
            </div>

            {/* 12. Feragat */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">12. Feragat</h2>
              <p className="text-slate-600 leading-relaxed">
                Bu Kullanım Koşullarının herhangi bir hükmünü uygulamamız veya uygulamamızda 
                gecikmemiz, söz konusu hükümden veya diğer haklarımızdan feragat ettiğimiz 
                anlamına gelmez.
              </p>
            </div>

            {/* 13. Uygulanacak Hukuk */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">13. Uygulanacak Hukuk ve Yetki</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Bu Kullanım Koşulları, Türkiye Cumhuriyeti kanunlarına tabi olup, bu kanunlara 
                göre yorumlanacaktır.
              </p>
              <p className="text-slate-600 leading-relaxed">
                İşbu Sözleşmeden kaynaklanan veya bununla bağlantılı her türlü uyuşmazlığın 
                çözümünde <strong>Antalya Mahkemeleri ve İcra Daireleri</strong> münhasıran yetkilidir.
              </p>
            </div>

            {/* 14. İletişim */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">14. İletişim</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Bu Kullanım Koşulları hakkında sorularınız veya görüşleriniz için 
                bizimle iletişime geçebilirsiniz.
              </p>
              <Link 
                to="/iletisim" 
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
              >
                <LinkIcon className="w-4 h-4" />
                İletişim Sayfasına Git
              </Link>
            </div>

            {/* Gizlilik Politikası Linki */}
            <div className="border-t pt-6">
              <p className="text-slate-600">
                Kişisel verilerinizin nasıl işlendiği hakkında bilgi için lütfen{' '}
                <Link to="/gizlilik-politikasi" className="text-amber-600 hover:text-amber-700 font-medium">
                  Gizlilik Politikamızı
                </Link>{' '}
                inceleyiniz.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default KullanimKosullari;
