import React from 'react';
import { Shield, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

export const GizlilikPolitikasi = () => {
  const currentDate = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  
  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <SEOHead 
        title="Gizlilik Politikası | Kaan Alp Tekin - Gayrimenkul Danışmanlığı" 
        description="Kaan Alp Tekin Gayrimenkul Danışmanlığı gizlilik politikası. Kişisel verilerin korunması, KVKK uyumu ve veri güvenliği hakkında detaylı bilgilendirme." 
      />
      
      {/* Hero */}
      <section className="bg-slate-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-amber-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Gizlilik Politikası</h1>
          <p className="text-slate-300 mt-2">Son güncelleme: {currentDate}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* 1. Giriş */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Giriş ve Amaç</h2>
              <p className="text-slate-600 leading-relaxed">
                Kaan Alp Tekin Gayrimenkul Danışmanlığı ("Şirket", "biz", "bizim") olarak, 6698 sayılı 
                Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuat kapsamında kişisel verilerinizin 
                korunmasına büyük önem veriyoruz. Bu Gizlilik Politikası, web sitemizi (kaanalptekin.com) 
                ziyaret ettiğinizde ve hizmetlerimizden yararlandığınızda kişisel verilerinizin nasıl 
                toplandığını, işlendiğini, saklandığını ve korunduğunu açıklamaktadır.
              </p>
              <p className="text-slate-600 leading-relaxed mt-3">
                Web sitemizi kullanarak veya hizmetlerimizden faydalanarak bu politikada belirtilen 
                koşulları kabul etmiş sayılırsınız.
              </p>
            </div>

            {/* 2. Veri Sorumlusu */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Veri Sorumlusu</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                KVKK'nın 3. maddesi uyarınca veri sorumlusu sıfatıyla hareket eden kuruluşumuzun bilgileri:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700"><strong>Unvan:</strong> Kaan Alp Tekin Gayrimenkul Danışmanlığı</p>
                <p className="text-slate-700 mt-1"><strong>Adres:</strong> Antalya, Türkiye</p>
                <p className="text-slate-700 mt-1"><strong>E-posta:</strong> info@kaanalptekin.com</p>
              </div>
            </div>

            {/* 3. Toplanan Veriler */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Toplanan Kişisel Veriler</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Web sitemiz ve hizmetlerimiz aracılığıyla aşağıdaki kişisel verileri toplayabiliriz:
              </p>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">3.1. Kimlik Bilgileri</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                <li>Ad ve soyad</li>
                <li>T.C. kimlik numarası (gerektiğinde)</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">3.2. İletişim Bilgileri</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                <li>Telefon numarası</li>
                <li>E-posta adresi</li>
                <li>Adres bilgisi</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">3.3. Müşteri İşlem Bilgileri</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                <li>İlgilendiğiniz gayrimenkul projeleri ve tercihleri</li>
                <li>Bütçe ve ödeme planı tercihleri</li>
                <li>Gayrimenkul arama kriterleri</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">3.4. İşlem Güvenliği Bilgileri</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                <li>IP adresi</li>
                <li>Tarayıcı türü ve sürümü</li>
                <li>Çerez verileri</li>
                <li>Oturum bilgileri</li>
              </ul>
            </div>

            {/* 4. Veri İşleme Amaçları */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Kişisel Verilerin İşlenme Amaçları</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>Hizmet sunumu:</strong> Gayrimenkul danışmanlığı, proje koordinatörlüğü ve yatırım danışmanlığı hizmetlerinin sağlanması</li>
                <li><strong>İletişim:</strong> Taleplerinize ve sorularınıza yanıt verilmesi, randevu organizasyonu</li>
                <li><strong>Bilgilendirme:</strong> Size uygun gayrimenkul fırsatları ve projeler hakkında bilgilendirme yapılması</li>
                <li><strong>Yasal yükümlülük:</strong> Yasal düzenlemeler kapsamındaki yükümlülüklerin yerine getirilmesi</li>
                <li><strong>Kalite geliştirme:</strong> Hizmet kalitesinin ölçülmesi ve iyileştirilmesi</li>
                <li><strong>Güvenlik:</strong> Dolandırıcılık ve yetkisiz erişimin önlenmesi</li>
              </ul>
            </div>

            {/* 5. Hukuki Dayanak */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Kişisel Verilerin İşlenmesinin Hukuki Dayanağı</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                KVKK'nın 5. maddesi uyarınca kişisel verileriniz aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Açık rızanızın bulunması</li>
                <li>Sözleşmenin kurulması veya ifası için gerekli olması</li>
                <li>Hukuki yükümlülüğün yerine getirilmesi</li>
                <li>Meşru menfaatlerimiz için zorunlu olması</li>
              </ul>
            </div>

            {/* 6. Veri Paylaşımı */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Kişisel Verilerin Aktarılması</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Kişisel verileriniz, KVKK'nın 8. ve 9. maddeleri uyarınca ve yalnızca aşağıdaki durumlarda 
                üçüncü taraflarla paylaşılabilir:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Yasal düzenlemeler gereği yetkili kamu kurum ve kuruluşlarına</li>
                <li>Hizmet sunumu için zorunlu olan iş ortaklarımıza (inşaat şirketleri, bankalar vb.)</li>
                <li>Hukuki süreçler kapsamında avukatlar ve danışmanlara</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-3">
                <strong>Önemli:</strong> Kişisel verileriniz hiçbir koşulda pazarlama amaçlı olarak 
                üçüncü taraflara satılmaz veya kiralanmaz.
              </p>
            </div>

            {/* 7. Veri Güvenliği */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Veri Güvenliği Önlemleri</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Kişisel verilerinizin güvenliğini sağlamak için aşağıdaki teknik ve idari tedbirler alınmaktadır:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>SSL/TLS şifreleme ile güvenli veri iletimi</li>
                <li>Güvenlik duvarları ve saldırı tespit sistemleri</li>
                <li>Erişim yetkilendirme ve kimlik doğrulama kontrolleri</li>
                <li>Düzenli güvenlik güncellemeleri ve yamaları</li>
                <li>Çalışanlar için veri güvenliği eğitimleri</li>
                <li>Veri erişim loglarının tutulması ve denetimi</li>
              </ul>
            </div>

            {/* 8. Çerezler */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Çerez Politikası</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Web sitemiz, kullanıcı deneyimini geliştirmek ve site performansını analiz etmek 
                amacıyla çerezler kullanmaktadır.
              </p>
              
              <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">Kullanılan Çerez Türleri:</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>Zorunlu çerezler:</strong> Web sitesinin düzgün çalışması için gerekli olan çerezler</li>
                <li><strong>Performans çerezleri:</strong> Site kullanımını analiz etmek için kullanılan çerezler</li>
                <li><strong>İşlevsellik çerezleri:</strong> Tercihlerinizi hatırlamak için kullanılan çerezler</li>
              </ul>
              
              <p className="text-slate-600 leading-relaxed mt-3">
                Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilir veya silebilirsiniz. 
                Ancak bu durumda web sitemizin bazı özellikleri düzgün çalışmayabilir.
              </p>
            </div>

            {/* 9. Saklama Süresi */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Kişisel Verilerin Saklanma Süresi</h2>
              <p className="text-slate-600 leading-relaxed">
                Kişisel verileriniz, işlenme amaçlarının gerektirdiği süre boyunca ve yasal 
                saklama yükümlülüklerimiz çerçevesinde muhafaza edilir. İşleme amacı ortadan 
                kalktığında ve yasal saklama süreleri sona erdiğinde, kişisel verileriniz 
                silinir, yok edilir veya anonim hale getirilir.
              </p>
            </div>

            {/* 10. KVKK Hakları */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">10. KVKK Kapsamındaki Haklarınız</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
                <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
              </ul>
            </div>

            {/* 11. Başvuru Yöntemi */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">11. Haklarınızı Kullanma Yöntemi</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki yöntemlerle başvuruda bulunabilirsiniz:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>E-posta yoluyla: info@kaanalptekin.com adresine yazılı başvuru</li>
                <li>Posta yoluyla: Kimlik fotokopisi ile birlikte ıslak imzalı dilekçe göndererek</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-3">
                Başvurularınız en geç 30 gün içinde sonuçlandırılacaktır. İşlemin ayrıca bir 
                maliyet gerektirmesi durumunda, Kişisel Verileri Koruma Kurulu tarafından 
                belirlenen ücret tarifesi uygulanabilir.
              </p>
            </div>

            {/* 12. Değişiklikler */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">12. Politika Değişiklikleri</h2>
              <p className="text-slate-600 leading-relaxed">
                Bu Gizlilik Politikası, yasal gereklilikler veya hizmetlerimizdeki değişiklikler 
                doğrultusunda güncellenebilir. Önemli değişiklikler yapıldığında, web sitemizde 
                duyuru yapılacaktır. Politikanın en güncel halini web sitemizden takip etmenizi öneririz.
              </p>
            </div>

            {/* 13. İletişim */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">13. İletişim</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Gizlilik politikamız veya kişisel verilerinizle ilgili her türlü soru, görüş ve 
                talepleriniz için bizimle iletişime geçebilirsiniz.
              </p>
              <Link 
                to="/iletisim" 
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
              >
                <LinkIcon className="w-4 h-4" />
                İletişim Sayfasına Git
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default GizlilikPolitikasi;
