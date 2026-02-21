import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messagesAPI } from '../../services/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Mail, MailOpen, Trash2, Phone, Calendar } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const AdminMessages = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    try {
      const data = await messagesAPI.getAll(token);
      setMessages(data);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);
    if (!message.is_read) {
      await messagesAPI.markAsRead(token, message.id);
      loadMessages();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Mesajı silmek istediğinizden emin misiniz?')) return;
    try {
      await messagesAPI.delete(token, id);
      toast({ title: 'Başarılı', description: 'Mesaj silindi' });
      loadMessages();
      setDialogOpen(false);
    } catch (error) {
      toast({ title: 'Hata', description: 'Silinemedi', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">İletişim Mesajları</h1>
      
      <div className="space-y-4">
        {messages.map((msg) => (
          <Card key={msg.id} className={`cursor-pointer hover:shadow-lg transition-shadow ${!msg.is_read ? 'border-l-4 border-l-amber-500' : ''}`} onClick={() => handleViewMessage(msg)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {msg.is_read ? <MailOpen className="w-5 h-5 text-slate-400 mt-1" /> : <Mail className="w-5 h-5 text-amber-500 mt-1" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{msg.name}</h3>
                      {!msg.is_read && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Yeni</span>}
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                    <p className="text-sm font-semibold text-slate-800">{msg.subject}</p>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{msg.message}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(msg.created_at).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && <p className="text-center text-slate-500 py-12">Henüz mesaj yok</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Mesaj Detayı</DialogTitle></DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div><p className="text-sm text-slate-600">Gönderen</p><p className="font-semibold">{selectedMessage.name}</p></div>
                <div><p className="text-sm text-slate-600">E-posta</p><p className="font-semibold">{selectedMessage.email}</p></div>
                {selectedMessage.phone && <div><p className="text-sm text-slate-600">Telefon</p><p className="font-semibold">{selectedMessage.phone}</p></div>}
                <div><p className="text-sm text-slate-600">Tarih</p><p className="font-semibold">{new Date(selectedMessage.created_at).toLocaleString('tr-TR')}</p></div>
              </div>
              <div><p className="text-sm text-slate-600 mb-2">Konu</p><p className="font-semibold text-lg">{selectedMessage.subject}</p></div>
              <div><p className="text-sm text-slate-600 mb-2">Mesaj</p><p className="text-slate-800 whitespace-pre-wrap">{selectedMessage.message}</p></div>
              <Button onClick={() => handleDelete(selectedMessage.id)} variant="outline" className="w-full text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" /> Mesajı Sil
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;
