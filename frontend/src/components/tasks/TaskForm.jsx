import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function TaskForm({ open, onClose, onSaved, task, defaultStatus = 'todo' }) {
  const isEdit = !!task;
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    category: '',
    dueDate: '',
    assignedTo: [],
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      api.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
      api.get('/auth/users').then((r) => setUsers(r.data)).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        category: task.category?._id || task.category || '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        assignedTo: task.assignedTo?.map((u) => u._id || u) || [],
        tags: task.tags || [],
      });
    } else {
      setForm({ title: '', description: '', status: defaultStatus, category: '', dueDate: '', assignedTo: [], tags: [] });
      setTagInput('');
    }
  }, [task, open]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleUser = (uid) => {
    setForm((f) => ({
      ...f,
      assignedTo: f.assignedTo.includes(uid)
        ? f.assignedTo.filter((id) => id !== uid)
        : [...f.assignedTo, uid],
    }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
      setTagInput('');
    }
  };

  const removeTag = (t) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('กรุณาระบุชื่องาน');
    setLoading(true);
    try {
      const payload = {
        ...form,
        category: form.category || null,
        dueDate: form.dueDate || null,
      };
      if (isEdit) {
        await api.put(`/tasks/${task._id}`, payload);
        toast.success('แก้ไขงานสำเร็จ');
      } else {
        await api.post('/tasks', payload);
        toast.success('เพิ่มงานสำเร็จ');
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
    <Modal open={open} onClose={onClose} title={isEdit ? 'แก้ไขงาน' : 'เพิ่มงานใหม่'} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input label="ชื่องาน *" value={form.title} onChange={set('title')} placeholder="ระบุชื่องาน..." />
        <Textarea label="รายละเอียด" value={form.description} onChange={set('description')} placeholder="รายละเอียดงาน..." rows={3} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="สถานะ" value={form.status} onChange={set('status')}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </Select>
          <Select label="หมวดหมู่" value={form.category} onChange={set('category')}>
            <option value="">-- ไม่มีหมวดหมู่ --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </Select>
        </div>

        <Input label="วันที่กำหนดส่ง" type="date" value={form.dueDate} onChange={set('dueDate')} />

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-textc">แท็ก</label>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="พิมพ์แท็ก แล้วกด Enter"
              className="flex-1 rounded-lg border border-borderc bg-surface px-3 py-2 text-[13px] text-textc outline-none transition placeholder:text-text2 focus:border-primary focus:ring-4 focus:ring-indigo-500/15"
            />
            <Button type="button" size="icon" variant="outline" onClick={addTag}>
              <Plus size={16} />
            </Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-primary">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="flex items-center p-0 text-inherit">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Assign Users */}
        {users.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-textc">แท็กผู้ร่วมงาน</label>
            <div className="flex flex-wrap gap-2 rounded-lg border border-borderc p-2">
              {users.map((u) => {
                const selected = form.assignedTo.includes(u._id);
                return (
                  <button
                    key={u._id}
                    type="button"
                    onClick={() => toggleUser(u._id)}
                    className={selected ? 'inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white transition' : 'inline-flex items-center gap-1.5 rounded-full bg-surface2 px-2.5 py-1 text-xs font-medium text-textc transition hover:bg-borderc'}
                  >
                    <div className={selected ? 'flex h-5 w-5 items-center justify-center rounded-full bg-indigo-400 text-[10px] font-bold text-white' : 'flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700'}>
                      {u.username[0].toUpperCase()}
                    </div>
                    {u.username}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>ยกเลิก</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มงาน'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
