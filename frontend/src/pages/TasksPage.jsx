import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, LayoutGrid, List, Filter, X, Archive } from 'lucide-react';
import api from '../lib/api';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskForm from '../components/tasks/TaskForm';
import toast from 'react-hot-toast';
import { cn, formatDate, getDueDateStatus, statusColor, statusLabel } from '../lib/utils';
import { AlertCircle, Calendar, Clock, Edit2, Tag, Trash2 } from 'lucide-react';

export default function TasksPage() {
  const { dark } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('kanban');

  const [filters, setFilters] = useState({ search: '', status: '', category: '', startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);
      if (filters.category) params.set('category', filters.category);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data);
    } catch {
      toast.error('โหลดงานไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { api.get('/categories').then((r) => setCategories(r.data)).catch(() => {}); }, []);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    const newStatus = destination.droppableId;
    setTasks((prev) => prev.map((t) => t._id === draggableId ? { ...t, status: newStatus } : t));
    try {
      await api.put(`/tasks/${draggableId}`, { status: newStatus });
      toast.success('อัปเดตสถานะสำเร็จ');
    } catch {
      toast.error('อัปเดตสถานะไม่สำเร็จ');
      fetchTasks();
    }
  };

  const handleEdit = (task) => { setEditTask(task); setFormOpen(true); };
  const handleDelete = (task) => setDeleteConfirm(task);

  const handleArchive = async (task) => {
    try {
      await api.put(`/tasks/${task._id}/archive`);
      toast.success('เก็บงานสำเร็จ');
      fetchTasks();
    } catch {
      toast.error('เก็บงานไม่สำเร็จ');
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/tasks/${deleteConfirm._id}`);
      toast.success('ลบงานสำเร็จ');
      setDeleteConfirm(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'ลบงานไม่สำเร็จ');
    }
  };

  const handleAddTask = (status = 'todo') => {
    setEditTask(null);
    setDefaultStatus(status);
    setFormOpen(true);
  };

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'search').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-textc">Tasks</h1>
          <p className="mt-0.5 text-[13px] text-text2">{tasks.length} งาน</p>
        </div>
        <Button onClick={() => handleAddTask()}>
          <Plus size={16} /> เพิ่มงาน
        </Button>
      </div>

      {/* Search & View Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text2" />
          <input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="ค้นหางาน..."
            className="w-full rounded-lg border border-borderc bg-surface py-2 pl-9 pr-3 text-sm text-textc outline-none transition placeholder:text-text2 focus:border-primary focus:ring-4 focus:ring-indigo-500/15"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          size="md"
          onClick={() => setShowFilters((v) => !v)}
        >
          <Filter size={15} />
          กรอง
          {activeFilters > 0 && (
            <span className="ml-1 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[11px] font-bold text-indigo-700">
              {activeFilters}
            </span>
          )}
        </Button>

        {/* View toggle */}
        <div className="flex overflow-hidden rounded-lg border border-borderc">
          <button
            onClick={() => setView('kanban')}
            title="Kanban View"
            className={cn(
              'flex items-center p-2 transition',
              view === 'kanban' ? 'bg-primary text-white' : 'bg-surface text-text2 hover:bg-surface2',
            )}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            title="List View"
            className={cn(
              'flex items-center p-2 transition',
              view === 'list' ? 'bg-primary text-white' : 'bg-surface text-text2 hover:bg-surface2',
            )}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="grid gap-3 rounded-2xl border border-borderc bg-surface p-4 sm:grid-cols-2 xl:grid-cols-4">
          {[{label: 'สถานะ', key: 'status', opts: [['', 'ทั้งหมด'], ['todo', 'To Do'], ['in-progress', 'In Progress'], ['done', 'Done']]}, {label: 'หมวดหมู่', key: 'category', opts: [['', 'ทั้งหมด'], ...categories.map(c => [c._id, c.name])]}].map(({label, key, opts}) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-text2">{label}</label>
              <select
                value={filters[key]}
                onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
                className="cursor-pointer rounded-lg border border-borderc bg-surface2 px-2.5 py-[7px] text-[13px] text-textc outline-none transition focus:border-primary focus:ring-4 focus:ring-indigo-500/15"
              >
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
          {[['startDate', 'วันที่เริ่ม'], ['endDate', 'วันที่สิ้นสุด']].map(([key, label]) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-text2">{label}</label>
              <input type="date" value={filters[key]} onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))} className="rounded-lg border border-borderc bg-surface2 px-2.5 py-[7px] text-[13px] text-textc outline-none transition focus:border-primary focus:ring-4 focus:ring-indigo-500/15" />
            </div>
          ))}
          {activeFilters > 0 && (
            <div className="flex justify-end sm:col-span-2 xl:col-span-4">
              <button onClick={() => setFilters({ search: filters.search, status: '', category: '', startDate: '', endDate: '' })} className="flex items-center gap-1 text-xs text-red-500 transition hover:text-red-600">
                <X size={12} /> ล้างตัวกรอง
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : view === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDragEnd={handleDragEnd}
          onAddTask={handleAddTask}
          onArchive={handleArchive}
          dark={dark}
        />
      ) : (
        /* List View */
        <div className="overflow-hidden rounded-2xl border border-borderc bg-surface">
          {tasks.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
                <Search size={24} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-textc">ไม่พบงาน</p>
              <p className="mt-1 text-xs text-text2">ลองเปลี่ยนตัวกรองหรือเพิ่มงานใหม่</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-borderc bg-surface2">
                  {['ชื่องาน', 'สถานะ', 'หมวดหมู่', 'กำหนดส่ง', 'ผู้ร่วมงาน', ''].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-text2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const due = getDueDateStatus(task.dueDate, task.status);
                  const dueColors = { overdue: '#ef4444', soon: '#f59e0b', ok: '#22c55e' };
                  return (
                    <tr key={task._id} className="border-b border-borderc transition hover:bg-surface2">
                      <td className="px-4 py-2.5">
                        <p className="text-[13px] font-medium text-textc">{task.title}</p>
                        {task.description && <p className="mt-0.5 max-w-[240px] truncate text-[11px] text-text2">{task.description}</p>}
                        {task.tags?.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {task.tags.map((t) => <span key={t} className="rounded-full bg-surface2 px-1.5 py-0.5 text-[10px] text-text2">#{t}</span>)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={cn('rounded-full px-2.5 py-[3px] text-[11px] font-medium', statusColor(task.status))}>
                          {statusLabel(task.status)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {task.category ? (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: task.category.color }}>
                            <Tag size={9} />{task.category.name}
                          </span>
                        ) : <span className="text-[11px] text-text2">-</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        {task.dueDate ? (
                          <span className="flex items-center gap-1 text-[11px]" style={{ color: due ? dueColors[due] : undefined }}>
                            {due === 'overdue' ? <AlertCircle size={11} /> : due === 'soon' ? <Clock size={11} /> : <Calendar size={11} />}
                            {formatDate(task.dueDate)}
                          </span>
                        ) : <span className="text-[11px] text-text2">-</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex">
                          {task.assignedTo?.map((u) => (
                            <div key={u._id} title={u.username} className="-ml-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-primary text-[10px] font-bold text-white first:ml-0">
                              {u.username[0].toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => handleEdit(task)} className="rounded-md p-1.5 text-slate-400 transition hover:bg-indigo-500/10 hover:text-primary"><Edit2 size={13} /></button>
                          <button onClick={() => handleArchive(task)} className="rounded-md p-1.5 text-slate-400 transition hover:bg-amber-500/10 hover:text-amber-500" title="เก็บงาน"><Archive size={13} /></button>
                          <button onClick={() => handleDelete(task)} className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-500"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTask(null); }}
        onSaved={fetchTasks}
        task={editTask || null}
        defaultStatus={defaultStatus}
      />

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-2xl bg-surface p-6 shadow-overlay">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="mb-1.5 text-center font-semibold text-textc">ลบงานนี้?</h3>
            <p className="mb-5 text-center text-[13px] text-text2">"{deleteConfirm.title}" จะถูกลบถาวร</p>
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
