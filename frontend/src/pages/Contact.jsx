import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { messagesAPI } from '../services/api';
import { SEOHead } from '../components/SEOHead';
import { useSiteData } from '../context/SiteDataContext';

export const Contact = () => {
  const { toast } = useToast();
  const { seoSettings, contactInfo, projects, loaded } = useSiteData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: 'Tüm Projeler',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send to backend
    messagesAPI.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: `İlgilenilen Proje: ${formData.project}`,
      message: `İlgilenilen Proje: ${formData.project}`
    })
      .then(() => {
        toast({
          title: 'Mesajınız Gönderildi!',
          description: 'En kısa sürede size geri dönüş yapacağız.',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          project: 'Tüm Projeler',
        });
      })
      .catch((error) => {
        toast({
          title: 'Hata!',
          description: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
          variant: 'destructive'
        });
      });
  };

  if (!loaded) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  const contactCards = [
    {
      icon: Phone,
      title: 'Telefon',
      content: contactInfo?.phone || '',
      link: contactInfo?.phone ? `tel:${contactInfo.phone}` : '#',
    },
    {
      icon: Mail,
      title: 'E-posta',
      content: contactInfo?.email || '',
      link: contactInfo?.email ? `mailto:${contactInfo.email}` : '#',
    },
    {
      icon: MapPin,
      title: 'Adres',
      content: contactInfo?.address || '',
      link: '#',
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      content: contactInfo?.working_hours || '',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <SEOHead 
        title={seoSettings?.contact_title || 'İletişim | ' + (seoSettings?.site_title || '')} 
        description={seoSettings?.contact_description || seoSettings?.site_description} 
      />
      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">İletişim</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Sorularınız için bize ulaşın. Size en kısa sürede dönüş yapacağız.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card
                  key={index}
                  className="text-center border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{card.title}</h3>
                    {card.link !== '#' ? (
                      <a
                        href={card.link}
                        className="text-sm text-slate-600 hover:text-amber-600 transition-colors"
                      >
                        {card.content}
                      </a>
                    ) : (
                      <p className="text-sm text-slate-600">{card.content}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Bilgi Alın</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Adınız Soyadınız *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-2"
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-2"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project">İlgilendiğiniz Proje *</Label>
                    <Select 
                      value={formData.project} 
                      onValueChange={(value) => setFormData({ ...formData, project: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Proje seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tüm Projeler">Tüm Projeler</SelectItem>
                        {(projects || []).map((project) => (
                          <SelectItem key={project.id} value={project.title}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              <Card className="border-none shadow-xl overflow-hidden">
                <div className="h-80 bg-slate-200">
                  {contactInfo?.map_embed_url ? (
                    <iframe
                      src={contactInfo.map_embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Office Location"
                    ></iframe>
                  ) : (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102239.63555676tried!2d30.6089!3d36.8969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c39aaeddadadc1%3A0x95c69f76bca6e1d1!2sAntalya%2C%20T%C3%BCrkiye!5e0!3m2!1str!2str!4v1621234567890!5m2!1str!2str"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Office Location"
                    ></iframe>
                  )}
                </div>
              </Card>
              <Card className="border-none shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Ofisimizi Ziyaret Edin</h3>
                  <p className="text-slate-600 mb-6">
                    Randevu alarak ofisimize gelebilir, projelerimizi detaylı inceleyebilir ve yüz yüze görüşme yapabilirsiniz.
                  </p>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{contactInfo?.address || ''}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{contactInfo?.working_hours || ''}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Sıkça Sorulan Sorular
          </h2>
          <div className="space-y-4">
            <Card className="border-l-4 border-l-amber-500 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-800 mb-2">Danışmanlık ücreti alıyor musunuz?</h3>
                <p className="text-slate-600">
                  İlk görüşme ve danışmanlık hizmetimiz tamamen ücretsizdir. Satış işlemi gerçekleştiğinde komisyon alınır.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-800 mb-2">Hangi bölgelerde hizmet veriyorsunuz?</h3>
                <p className="text-slate-600">
                  Başta Ankara, İstanbul, İzmir olmak üzere Türkiye'nin tüm büyük şehirlerinde aktif olarak hizmet vermekteyiz.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-800 mb-2">Yatırım danışmanlığı yapıyor musunuz?</h3>
                <p className="text-slate-600">
                  Evet, gayrimenkul yatırımı yapmak isteyenlere piyasa analizi ve karlı yatırım önerileri sunuyoruz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
