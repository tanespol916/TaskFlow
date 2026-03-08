import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import api from '../lib/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  '#6366f1', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b',
];

function CategoryForm({ open, onClose, onSaved, category }) {
  const isEdit = !!category;
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color || '#6366f1');
    } else {
      setName('');
      setColor('#6366f1');
    }
  }, [category, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('กรุณาระบุชื่อหมวดหมู่');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/categories/${category._id}`, { name, color });
        toast.success('แก้ไขหมวดหมู่สำเร็จ');
      } else {
        await api.post('/categories', { name, color });
        toast.success('สร้างหมวดหมู่สำเร็จ');
      }
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'แก้ไขหมวดหมู่' : 'สร้างหมวดหมู่ใหม่'} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input label="ชื่อหมวดหมู่ *" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น Work, Study, Personal..." />

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium text-textc">สีหมวดหมู่</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="h-7 w-7 rounded-full border-0 transition-transform"
                style={{ background: c, transform: color === c ? 'scale(1.25)' : 'scale(1)', outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: 2 }}
              />
            ))}
          </div>
          <div className="mt-0.5 flex items-center gap-2.5">
            <div className="h-7 w-7 shrink-0 rounded-full" style={{ background: color }} />
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-7 w-9 cursor-pointer rounded-md border-0 p-0" title="เลือกสีเอง" />
            <span className="font-mono text-xs text-text2">{color}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-surface2 p-2.5">
          <span className="text-[13px] text-text2">ตัวอย่าง:</span>
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-[3px] text-[13px] font-medium text-white" style={{ background: color }}>
            <Tag size={11} />{name || 'ชื่อหมวดหมู่'}
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>ยกเลิก</Button>
          <Button type="submit" disabled={loading}>{loading ? 'กำลังบันทึก...' : isEdit ? 'บันทึก' : 'สร้าง'}</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch {
      toast.error('โหลดหมวดหมู่ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleEdit = (cat) => { setEditCat(cat); setFormOpen(true); };
  const handleAdd = () => { setEditCat(null); setFormOpen(true); };

  const confirmDelete = async () => {
    try {
      await api.delete(`/categories/${deleteConfirm._id}`);
      toast.success('ลบหมวดหมู่สำเร็จ');
      setDeleteConfirm(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'ลบไม่สำเร็จ');
    }
  };

  return (
    <div className="flex max-w-full flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-textc">หมวดหมู่</h1>
          <p className="mt-0.5 text-[13px] text-text2">{categories.length} หมวดหมู่</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus size={16} /> สร้างหมวดหมู่
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-borderc bg-surface px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
            <Tag size={26} className="text-primary" />
          </div>
          <p className="mb-1.5 font-semibold text-textc">ยังไม่มีหมวดหมู่</p>
          <p className="mb-4 text-[13px] text-text2">สร้างหมวดหมู่เพื่อจัดระเบียบงานของคุณ</p>
          <Button onClick={handleAdd}><Plus size={15} /> สร้างหมวดหมู่แรก</Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between rounded-2xl border border-borderc bg-surface p-3.5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px]" style={{ background: `${cat.color}22` }}>
                  <Tag size={17} style={{ color: cat.color }} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-textc">{cat.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-text2">{cat.color}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button onClick={() => handleEdit(cat)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-indigo-500/10 hover:text-primary"><Pencil size={14} /></button>
                <button onClick={() => setDeleteConfirm(cat)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Default suggestions */}
      {categories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-borderc bg-surface2 p-3.5">
          <p className="mb-2 text-[11px] font-medium text-text2">หมวดหมู่แนะนำ:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Work', color: '#3b82f6' },
              { name: 'Study', color: '#8b5cf6' },
              { name: 'Personal', color: '#22c55e' },
              { name: 'Health', color: '#ef4444' },
              { name: 'Finance', color: '#f59e0b' },
            ].map((s) => (
              <button
                key={s.name}
                onClick={async () => {
                  try {
                    await api.post('/categories', s);
                    toast.success(`สร้าง "${s.name}" สำเร็จ`);
                    fetchCategories();
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
                  }
                }}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white transition hover:opacity-80"
                style={{ background: s.color }}
              >
                <Plus size={10} /> {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <CategoryForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditCat(null); }}
        onSaved={fetchCategories}
        category={editCat}
      />

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-2xl bg-surface p-6 shadow-overlay">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="mb-1.5 text-center font-semibold text-textc">ลบหมวดหมู่นี้?</h3>
            <p className="mb-5 text-center text-[13px] text-text2">&quot;{deleteConfirm.name}&quot; จะถูกลบ และงานที่ใช้หมวดหมู่นี้จะถูกเปลี่ยนเป็นไม่มีหมวดหมู่</p>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(null)}>ยกเลิก</Button>
              <Button variant="danger" className="flex-1" onClick={confirmDelete}>ลบ</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
