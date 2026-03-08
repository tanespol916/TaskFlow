import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('เข้าสู่ระบบสำเร็จ');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed right-4 top-4 flex items-center justify-center rounded-full border border-borderc bg-surface p-2 text-text2 transition hover:bg-surface2"
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-[0_4px_24px_rgba(99,102,241,0.35)]">
            <CheckSquare size={28} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-textc">TaskFlow</h1>
          <p className="mt-1.5 text-sm text-text2">จัดการงานของคุณอย่างมืออาชีพ</p>
        </div>

        {/* Card */}
        <div className="rounded-[20px] border border-borderc bg-surface p-7 shadow-soft">
          <h2 className="mb-5 text-lg font-semibold text-textc">เข้าสู่ระบบ</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="อีเมล"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={set('email')}
              required
              className="rounded-xl bg-surface2 px-3.5 py-2.5"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-textc">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  required
                  className="w-full rounded-xl border border-borderc bg-surface2 px-3.5 py-2.5 pr-10 text-sm text-textc outline-none transition placeholder:text-text2 focus:border-primary focus:ring-4 focus:ring-indigo-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-text2"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl py-[11px] text-[15px] font-semibold"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>
          <p className="mt-5 text-center text-[13px] text-text2">
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" className="font-semibold text-primary no-underline hover:text-primary-hover">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
