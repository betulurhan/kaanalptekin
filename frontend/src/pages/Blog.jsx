import React, { useEffect, useState } from 'react';
import { Calendar, User, Clock, Tag, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { blogAPI } from '../services/api';

export const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = ['Tümü', 'Piyasa Analizi', 'Satın Alma Rehberi', 'Yatırım', 'Finansman', 'Yaşam', 'Değerleme'];
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogAPI.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts =
    selectedCategory === 'Tümü'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const featuredPost = posts[0];

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Gayrimenkul sektöründeki gelişmeler, uzman tavsiyeleri ve yatırım ipuçları.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">Henüz blog yazısı yok</p>
        </div>
      ) : (
        <>
      {/* Featured Post */}
      {featuredPost && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-80 md:h-auto overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-amber-500">Öne Çıkan</Badge>
                </div>
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <Badge variant="outline" className="w-fit mb-3">
                  {featuredPost.category}
                </Badge>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">{featuredPost.title}</h2>
                <p className="text-slate-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                </div>
                <button className="flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all duration-300">
                  Devamını Oku
                  <ArrowRight className="w-4 h-4" />
                </button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-slate-800 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-none"
              >
                <div className="relative h-56 overflow-hidden group">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 hover:text-amber-600 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.read_time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredPosts.length === 1 && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">Bu kategoride başka içerik bulunmuyor.</p>
            </div>
          )}
        </div>
      </section>
        </>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Güncel Kalın</h2>
          <p className="text-slate-300 mb-8 text-lg">
            Gayrimenkul piyasasındaki son gelişmeleri ve özel içeriklerimizi kaçırmayın.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300">
              Abone Ol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
