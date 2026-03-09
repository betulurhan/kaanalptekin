import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { SEOHead } from '../components/SEOHead';
import { blogAPI } from '../services/api';

export const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getById(id);
      setBlog(data);
      
      // Load related blogs from same category
      const allBlogs = await blogAPI.getAll();
      const related = allBlogs
        .filter(b => b.category === data.category && b.id !== id)
        .slice(0, 3);
      setRelatedBlogs(related);
    } catch (error) {
      console.error('Failed to load blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Blog yazısı bulunamadı</h1>
          <Link to="/blog">
            <Button className="bg-amber-500 hover:bg-amber-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Blog'a Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <SEOHead 
        title={`${blog.title} | Kaan Alp Tekin Blog`}
        description={blog.excerpt}
      />

      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img 
          src={blog.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200'} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link to="/blog">
            <Button variant="outline" className="bg-white/90 hover:bg-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full mb-4">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {blog.author || 'Kaan Alp Tekin'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.created_at)}
              </span>
              {blog.read_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {blog.read_time} okuma
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            {/* Main Content */}
            <div>
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  {/* Excerpt */}
                  <p className="text-lg text-slate-600 font-medium mb-8 pb-8 border-b border-slate-200">
                    {blog.excerpt}
                  </p>
                  
                  {/* Blog Content */}
                  <div 
                    className="prose prose-slate prose-lg max-w-none
                      prose-headings:text-slate-800 prose-headings:font-bold
                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                      prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
                      prose-strong:text-slate-800
                      prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                      prose-li:text-slate-600 prose-li:mb-2
                      prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ 
                      __html: blog.content
                        .replace(/\n\n## /g, '</p><h2>')
                        .replace(/\n\n### /g, '</p><h3>')
                        .replace(/## /g, '<h2>')
                        .replace(/### /g, '<h3>')
                        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\n- /g, '</p><ul><li>')
                        .replace(/\n\n1\. /g, '</p><ol><li>')
                        .replace(/✓/g, '✓')
                        .split('<h2>').join('</p><h2>')
                        .split('<h3>').join('</p><h3>')
                        .replace(/<\/h2>/g, '</h2><p>')
                        .replace(/<\/h3>/g, '</h3><p>')
                    }}
                  />
                </CardContent>
              </Card>

              {/* Share Buttons */}
              <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <Share2 className="w-5 h-5" />
                    Bu yazıyı paylaş
                  </span>
                  <div className="flex gap-3">
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a 
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Author Card */}
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{blog.author || 'Kaan Alp Tekin'}</h3>
                  <p className="text-sm text-slate-500 mb-4">Gayrimenkul Danışmanı</p>
                  <Link to="/iletisim">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">
                      İletişime Geç
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Category */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-amber-500" />
                    Kategori
                  </h3>
                  <Link 
                    to={`/blog?category=${encodeURIComponent(blog.category)}`}
                    className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                  >
                    {blog.category}
                  </Link>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedBlogs.length > 0 && (
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Benzer Yazılar</h3>
                    <div className="space-y-4">
                      {relatedBlogs.map((related) => (
                        <Link 
                          key={related.id}
                          to={`/blog/${related.id}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            <img 
                              src={related.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100'} 
                              alt={related.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div>
                              <h4 className="text-sm font-medium text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-2">
                                {related.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1">
                                {formatDate(related.created_at)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-12 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Gayrimenkul Danışmanlığı Hizmeti Alın
          </h2>
          <p className="text-slate-300 mb-6">
            Antalya'da gayrimenkul yatırımı için profesyonel destek alın.
          </p>
          <Link to="/iletisim">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600">
              Ücretsiz Danışmanlık
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
