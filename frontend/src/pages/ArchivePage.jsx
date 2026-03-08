import { useState, useEffect } from 'react';
import { Archive, ArchiveRestore, Search, Calendar, AlertCircle, Clock, Tag } from 'lucide-react';
import api from '../lib/api';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { cn, formatDate, getDueDateStatus, statusColor, statusLabel } from '../lib/utils';

export default function ArchivePage() {
  const { dark } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchArchivedTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks?archived=true');
      setTasks(res.data);
    } catch {
      toast.error('โหลดงานที่เก็บไว้ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const handleUnarchive = async (task) => {
    try {
      await api.put(`/tasks/${task._id}/unarchive`);
      toast.success('นำงานกลับมาสำเร็จ');
      fetchArchivedTasks();
    } catch {
      toast.error('นำงานกลับมาไม่สำเร็จ');
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-textc flex items-center gap-2">
            <Archive size={24} className="text-amber-500" />
            งานที่เก็บไว้
          </h1>
          <p className="mt-0.5 text-[13px] text-text2">{tasks.length} งานที่เก็บไว้</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative min-w-56">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหางานที่เก็บไว้..."
          className="w-full rounded-lg border border-borderc bg-surface py-2 pl-9 pr-3 text-sm text-textc outline-none transition placeholder:text-text2 focus:border-primary focus:ring-4 focus:ring-indigo-500/15"
        />
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-borderc bg-surface px-6 py-12 text-center">
          <Archive size={48} className="mx-auto mb-4 text-amber-500" />
          <p className="mb-1.5 font-semibold text-textc">
            {search ? 'ไม่พบงานที่ค้นหา' : 'ยังไม่มีงานที่เก็บไว้'}
          </p>
          <p className="text-[13px] text-text2">
            {search ? 'ลองค้นหาด้วยคำอื่น' : 'งานที่เก็บไว้จะแสดงที่นี่'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-borderc bg-surface">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderc bg-surface2">
                {['ชื่องาน', 'สถานะ', 'หมวดหมู่', 'กำหนดส่ง', 'เก็บเมื่อ', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-text2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
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
                      <span className="flex items-center gap-1 text-[11px] text-text2">
                        <Calendar size={11} />
                        {formatDate(task.updatedAt)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-0.5">
                        <button 
                          onClick={() => handleUnarchive(task)} 
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-amber-500/10 hover:text-amber-500" 
                          title="นำงานกลับมา"
                        >
                          <ArchiveRestore size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
