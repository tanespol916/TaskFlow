import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Tag, Archive, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/categories', icon: Tag, label: 'Categories' },
  { to: '/archive', icon: Archive, label: 'Archive' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex h-full w-64 flex-col border-r border-borderc bg-surface transition-transform lg:static lg:z-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-borderc p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <CheckSquare size={16} color="white" />
            </div>
            <span className="text-[15px] font-bold text-textc">TaskFlow</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text2 transition hover:bg-surface2 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
            return (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text2 hover:bg-surface2',
                )}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-borderc p-4">
          <div className="mb-2.5 flex items-center gap-2.5 px-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-textc">{user?.username}</p>
              <p className="truncate text-[11px] text-text2">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-red-500 transition hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
