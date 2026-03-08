import { useEffect, useState } from 'react';
import { CheckSquare, Clock, AlertCircle, ListTodo, TrendingUp, Archive } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-borderc bg-surface px-5 py-4 shadow-sm">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: bg }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className="text-[13px] text-text2">{label}</p>
      <p className="mt-0.5 text-2xl font-bold text-textc">{value}</p>
    </div>
  </div>
);

const PIE_COLORS = ['#94a3b8', '#3b82f6', '#22c55e'];

export default function DashboardPage() {
  const { user } = useAuth();
  const { dark } = useTheme();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/tasks/dashboard'),
      api.get('/tasks?status=&search=').catch(() => ({ data: [] })),
    ])
      .then(([s, t]) => {
        setStats(s.data);
        setRecentTasks(t.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const pieData = [
    { name: 'To Do', value: stats?.todo || 0 },
    { name: 'In Progress', value: stats?.inProgress || 0 },
    { name: 'Done', value: stats?.done || 0 },
  ];

  const barData = [
    { name: 'To Do', value: stats?.todo || 0, fill: '#94a3b8' },
    { name: 'In Progress', value: stats?.inProgress || 0, fill: '#3b82f6' },
    { name: 'Done', value: stats?.done || 0, fill: '#22c55e' },
    { name: 'Overdue', value: stats?.overdue || 0, fill: '#ef4444' },
  ];

  const textColor = dark ? '#94a3b8' : '#64748b';
  const gridColor = dark ? '#334155' : '#e2e8f0';

  return (
    <div className="flex max-w-full flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textc">
          สวัสดี, {user?.username} 👋
        </h1>
        <p className="mt-1 text-sm text-text2">
          นี่คือภาพรวมงานของคุณวันนี้
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={ListTodo} label="งานทั้งหมด" value={stats?.total ?? 0} color="#6366f1" bg="#eef2ff" />
        <StatCard icon={Clock} label="กำลังดำเนินการ" value={stats?.inProgress ?? 0} color="#3b82f6" bg="#eff6ff" />
        <StatCard icon={CheckSquare} label="เสร็จแล้ว" value={stats?.done ?? 0} color="#22c55e" bg="#f0fdf4" />
        <StatCard icon={AlertCircle} label="เกินกำหนด" value={stats?.overdue ?? 0} color="#ef4444" bg="#fef2f2" />
        <StatCard icon={Archive} label="งานที่เก็บ" value={stats?.archived ?? 0} color="#f59e0b" bg="#fef3c7" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Pie Chart */}
        <div className="rounded-2xl border border-borderc bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-text2" />
            <h3 className="text-[13px] font-semibold text-textc">สัดส่วนงานตามสถานะ</h3>
          </div>
          {stats?.total > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: dark ? '#1e293b' : '#fff', border: `1px solid ${gridColor}`, borderRadius: 8 }}
                  labelStyle={{ color: dark ? '#f1f5f9' : '#0f172a' }}
                />
                <Legend formatter={(v) => <span style={{ color: textColor, fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-48 items-center justify-center text-[13px] text-text2">
              ยังไม่มีข้อมูลงาน
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="rounded-2xl border border-borderc bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-text2" />
            <h3 className="text-[13px] font-semibold text-textc">จำนวนงานแต่ละสถานะ</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: dark ? '#1e293b' : '#fff', border: `1px solid ${gridColor}`, borderRadius: 8 }}
                cursor={{ fill: dark ? '#334155' : '#f1f5f9' }}
              />
              <Bar dataKey="value" name="จำนวน" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks & Archived Tasks */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Recent Tasks */}
        <div className="overflow-hidden rounded-2xl border border-borderc bg-surface shadow-sm">
          <div className="border-b border-borderc px-5 py-3">
            <h3 className="text-[13px] font-semibold text-textc">งานล่าสุด</h3>
          </div>
          {recentTasks.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-text2">
              ยังไม่มีงาน — ไปสร้างงานแรกของคุณได้เลย!
            </div>
          ) : (
            <div>
              {recentTasks.map((task, i) => {
                const statusColors = {
                  todo: { bg: '#f1f5f9', text: '#64748b' },
                  'in-progress': { bg: '#eff6ff', text: '#3b82f6' },
                  done: { bg: '#f0fdf4', text: '#22c55e' },
                };
                const s = statusColors[task.status];
                const statusLabels = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
                return (
                  <div key={task._id} className={i > 0 ? 'flex items-center justify-between gap-3 border-t border-borderc px-5 py-3' : 'flex items-center justify-between gap-3 px-5 py-3'}>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-textc">{task.title}</p>
                      {task.category && (
                        <span className="text-[11px] text-text2">{task.category.name}</span>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full px-2.5 py-[3px] text-[11px] font-medium" style={{ background: s.bg, color: s.text }}>
                      {statusLabels[task.status]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Archived Tasks */}
        {stats?.recentArchivedTasks && stats.recentArchivedTasks.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-borderc bg-surface shadow-sm">
            <div className="border-b border-borderc px-5 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-textc flex items-center gap-2">
                  <Archive size={14} className="text-amber-500" />
                  งานที่เก็บล่าสุด
                </h3>
                <span className="text-[11px] text-text2">ทั้งหมด {stats.archived} งาน</span>
              </div>
            </div>
            <div>
              {stats.recentArchivedTasks.map((task, i) => (
                <div key={task._id} className={i > 0 ? 'flex items-center justify-between gap-3 border-t border-borderc px-5 py-3' : 'flex items-center justify-between gap-3 px-5 py-3'}>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-textc">{task.title}</p>
                    <span className="text-[11px] text-text2">เก็บเมื่อ {new Date(task.updatedAt).toLocaleDateString('th-TH')}</span>
                  </div>
                  <span className="shrink-0 rounded-full px-2.5 py-[3px] text-[11px] font-medium bg-amber-100 text-amber-700">
                    Archived
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Empty state for archived tasks
          <div className="overflow-hidden rounded-2xl border border-borderc bg-surface shadow-sm">
            <div className="border-b border-borderc px-5 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-textc flex items-center gap-2">
                  <Archive size={14} className="text-amber-500" />
                  งานที่เก็บล่าสุด
                </h3>
                <span className="text-[11px] text-text2">ทั้งหมด 0 งาน</span>
              </div>
            </div>
            <div className="px-5 py-8 text-center text-[13px] text-text2">
              ยังไม่มีงานที่เก็บไว้
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
