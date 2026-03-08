import { Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ onMenuClick }) {
  const { dark, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-borderc bg-surface px-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center rounded-lg p-2 text-text2 transition hover:bg-surface2 lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex items-center justify-center rounded-lg p-2 text-text2 transition hover:bg-surface2"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
