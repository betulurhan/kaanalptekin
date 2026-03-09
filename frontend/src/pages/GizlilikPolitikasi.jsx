import React from 'react';
import { Shield } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const GizlilikPolitikasi = () => {
  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <SEOHead 
        title="Gizlilik Politikası | Kaan Alp Tekin" 
        description="Kaan Alp Tekin Gayrimenkul Danışmanlığı gizlilik politikası ve kişisel verilerin korunması hakkında bilgilendirme." 
      />
      
      {/* Hero */}
      <section className="bg-slate-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-amber-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Gizlilik Politikası</h1>
          <p className="text-slate-300 mt-2">Son güncelleme: Şubat 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Giriş</h2>
              <p className="text-slate-600 leading-relaxed">
                Kaan Alp Tekin Gayrimenkul Danışmanlığı olarak, kişisel verilerinizin gizliliğine önem veriyoruz. 
                Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde ve hizmetlerimizi kullandığınızda 
                kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklamaktadır.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Toplanan Bilgiler</h2>
              <p className="text-slate-600 leading-relaxed mb-3">Web sitemiz üzerinden aşağıdaki bilgileri toplayabiliriz:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Ad ve soyad</li>
                <li>Telefon numarası</li>
                <li>E-posta adresi</li>
                <li>İlgilendiğiniz projeler ve gayrimenkul tercihleri</li>
                <li>İletişim formları aracılığıyla gönderdiğiniz mesajlar</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Bilgilerin Kullanımı</h2>
              <p className="text-slate-600 leading-relaxed mb-3">Topladığımız bilgileri şu amaçlarla kullanırız:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Size gayrimenkul danışmanlığı hizmeti sunmak</li>
                <li>Taleplerinize ve sorularınıza yanıt vermek</li>
                <li>Sizinle ilgilendiğiniz projeler hakkında iletişime geçmek</li>
                <li>Hizmet kalitemizi geliştirmek</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Bilgi Güvenliği</h2>
              <p className="text-slate-600 leading-relaxed">
                Kişisel verilerinizi yetkisiz erişime, değişikliğe, ifşaya veya imhaya karşı korumak için 
                uygun teknik ve organizasyonel güvenlik önlemleri uyguluyoruz. Verileriniz güvenli 
                sunucularda saklanmakta ve şifreleme teknolojileri kullanılmaktadır.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Üçüncü Taraflarla Paylaşım</h2>
              <p className="text-slate-600 leading-relaxed">
                Kişisel bilgilerinizi, yasal zorunluluklar dışında üçüncü taraflarla paylaşmayız. 
                Bilgileriniz hiçbir koşulda pazarlama amaçlı olarak satılmaz veya kiralanmaz.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Çerezler (Cookies)</h2>
              <p className="text-slate-600 leading-relaxed">
                Web sitemiz, kullanıcı deneyimini geliştirmek için çerezler kullanabilir. Çerezler, 
                tarayıcınız tarafından saklanan küçük metin dosyalarıdır. Tarayıcı ayarlarınızdan 
                çerezleri devre dışı bırakabilirsiniz.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. KVKK Kapsamındaki Haklarınız</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerinizin düzeltilmesini isteme</li>
                <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. İletişim</h2>
              <p className="text-slate-600 leading-relaxed">
                Gizlilik politikamız hakkında sorularınız veya kişisel verilerinizle ilgili talepleriniz 
                için bizimle iletişime geçebilirsiniz. İletişim bilgilerimize web sitemizin 
                "İletişim" sayfasından ulaşabilirsiniz.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default GizlilikPolitikasi;
