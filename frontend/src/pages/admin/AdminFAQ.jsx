import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, HelpCircle, GripVertical } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '../../components/ui/alert-dialog';
import { faqAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const COLOR_OPTIONS = [
  { value: 'amber', label: 'Sarı', cls: 'border-l-amber-500' },
  { value: 'blue', label: 'Mavi', cls: 'border-l-blue-500' },
  { value: 'green', label: 'Yeşil', cls: 'border-l-green-500' },
  { value: 'red', label: 'Kırmızı', cls: 'border-l-red-500' },
  { value: 'purple', label: 'Mor', cls: 'border-l-purple-500' },
];

const blankForm = { question: '', answer: '', color: 'amber', sort_order: 0, is_active: true };

const AdminFAQ = () => {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // id or 'new'
  const [formData, setFormData] = useState(blankForm);

  const fetchFaqs = async () => {
    try {
      const data = await faqAPI.getAll(false);
      setFaqs(data);
    } catch (e) {
      toast.error('SSS yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const startNew = () => {
    setFormData({ ...blankForm, sort_order: faqs.length + 1 });
    setEditing('new');
  };

  const startEdit = (faq) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      color: faq.color || 'amber',
      sort_order: faq.sort_order || 0,
      is_active: faq.is_active !== false
    });
    setEditing(faq.id);
  };

  const cancel = () => {
    setEditing(null);
    setFormData(blankForm);
  };

  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Soru ve cevap zorunlu');
      return;
    }
    try {
      if (editing === 'new') {
        await faqAPI.create(token, formData);
        toast.success('SSS eklendi');
      } else {
        await faqAPI.update(token, editing, formData);
        toast.success('SSS güncellendi');
      }
      cancel();
      fetchFaqs();
    } catch (e) {
      toast.error('Kaydedilemedi');
    }
  };

  const handleDelete = async (id) => {
    try {
      await faqAPI.delete(token, id);
      toast.success('SSS silindi');
      fetchFaqs();
    } catch (e) {
      toast.error('Silinemedi');
    }
  };

  const handleToggleActive = async (faq) => {
    try {
      await faqAPI.update(token, faq.id, { is_active: !faq.is_active });
      fetchFaqs();
    } catch (e) {
      toast.error('Güncellenemedi');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-faq-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-500" />
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-slate-500 text-sm">İletişim sayfasındaki SSS bölümünü yönetin</p>
        </div>
        {editing === null && (
          <Button onClick={startNew} className="bg-amber-500 hover:bg-amber-600" data-testid="admin-faq-add-btn">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Soru Ekle
          </Button>
        )}
      </div>

      {/* Editor (new or edit) */}
      {editing && (
        <Card className="border-amber-200 shadow-lg">
          <CardContent className="p-5 space-y-4">
            <h2 className="font-semibold text-slate-800">{editing === 'new' ? 'Yeni SSS' : 'SSS Düzenle'}</h2>
            <div>
              <Label>Soru *</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Soru metnini yazın..."
                data-testid="admin-faq-question-input"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Cevap *</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Cevap metnini yazın..."
                rows={4}
                data-testid="admin-faq-answer-input"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Sıra</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Renk</Label>
                <Select value={formData.color} onValueChange={(v) => setFormData({ ...formData, color: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label className="cursor-pointer">Aktif</Label>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={cancel} data-testid="admin-faq-cancel-btn">
                <X className="w-4 h-4 mr-2" /> İptal
              </Button>
              <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600" data-testid="admin-faq-save-btn">
                <Save className="w-4 h-4 mr-2" /> Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-3">
        {faqs.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-slate-500">
              Henüz SSS eklenmedi. "Yeni Soru Ekle" ile başlayın.
            </CardContent>
          </Card>
        )}
        {faqs.map((faq) => {
          const colorOpt = COLOR_OPTIONS.find(c => c.value === (faq.color || 'amber'));
          return (
            <Card
              key={faq.id}
              className={`border-l-4 ${colorOpt?.cls || 'border-l-amber-500'} ${!faq.is_active ? 'opacity-60' : ''}`}
              data-testid={`admin-faq-item-${faq.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="w-5 h-5 text-slate-300 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">#{faq.sort_order}</Badge>
                      {!faq.is_active && <Badge variant="outline" className="text-[10px]">Pasif</Badge>}
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">{faq.question}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    <Switch
                      checked={faq.is_active}
                      onCheckedChange={() => handleToggleActive(faq)}
                      data-testid={`admin-faq-toggle-${faq.id}`}
                    />
                    <Button size="sm" variant="ghost" onClick={() => startEdit(faq)} data-testid={`admin-faq-edit-${faq.id}`}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" data-testid={`admin-faq-delete-${faq.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>SSS Silinecek</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{faq.question}" silinecek. Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(faq.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminFAQ;
