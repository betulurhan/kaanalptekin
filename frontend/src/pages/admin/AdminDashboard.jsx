import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  FolderOpen, 
  BookOpen, 
  Mail, 
  Users,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { projectsAPI, blogAPI, messagesAPI, authAPI } from '../../services/api';

export const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalBlogPosts: 0,
    unreadMessages: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [projects, blogPosts, messages, users] = await Promise.all([
        projectsAPI.getAll(),
        blogAPI.getAll(),
        messagesAPI.getUnreadCount(token),
        authAPI.getUsers(token)
      ]);

      setStats({
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        totalBlogPosts: blogPosts.length,
        unreadMessages: messages.unread_count,
        totalUsers: users.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Toplam Proje',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-500',
      trend: `${stats.completedProjects} tamamlandı`
    },
    {
      title: 'Blog Yazıları',
      value: stats.totalBlogPosts,
      icon: BookOpen,
      color: 'bg-green-500',
      trend: 'Yayınlanan'
    },
    {
      title: 'Okunmamış Mesaj',
      value: stats.unreadMessages,
      icon: Mail,
      color: 'bg-amber-500',
      trend: 'Bekleyen'
    },
    {
      title: 'Kullanıcılar',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      trend: 'Aktif'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/projects"
              className="p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all text-center"
            >
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="font-semibold text-slate-800">Yeni Proje Ekle</p>
            </a>
            <a
              href="/admin/blog"
              className="p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all text-center"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="font-semibold text-slate-800">Yeni Blog Yazısı</p>
            </a>
            <a
              href="/admin/messages"
              className="p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all text-center"
            >
              <Mail className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="font-semibold text-slate-800">Mesajları Görüntüle</p>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Message */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Sistem Hazır!</h3>
              <p className="text-amber-50">
                Admin paneli başarıyla kuruldu. Artık web sitenizin tüm içeriklerini bu panel üzerinden yönetebilirsiniz.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
