import { AlertCircle, Calendar, Clock, Edit2, Tag, Trash2, Archive, User } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { cn, formatDate, getDueDateStatus } from '../../lib/utils';

export default function TaskCard({ task, index, onEdit, onDelete, onArchive, onUnarchive }) {
  const dueDateStatus = getDueDateStatus(task.dueDate, task.status);

  const dueDateColors = {
    overdue: { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' },
    soon:    { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' },
    ok:      { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            marginBottom: 8,
            boxShadow: snapshot.isDragging
              ? '0 8px 24px rgba(0,0,0,0.2)'
              : '0 1px 3px rgba(0,0,0,0.08)',
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform} rotate(2deg)`
              : provided.draggableProps.style?.transform,
            cursor: 'grab',
            transition: 'box-shadow 0.15s',
            ...provided.draggableProps.style,
          }}
          className="rounded-xl border border-borderc bg-surface p-3"
        >
          {/* Header */}
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <h4 className="flex-1 text-[13px] font-semibold leading-[1.4] text-textc">
              {task.title}
            </h4>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => onEdit(task)}
                className="flex items-center rounded-md p-1 text-slate-400 transition hover:bg-indigo-500/10 hover:text-primary"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => onArchive?.(task)}
                className="flex items-center rounded-md p-1 text-slate-400 transition hover:bg-amber-500/10 hover:text-amber-500"
                title="เก็บงาน"
              >
                <Archive size={13} />
              </button>
              <button
                onClick={() => onDelete(task)}
                className="flex items-center rounded-md p-1 text-slate-400 transition hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="mb-1.5 line-clamp-2 overflow-hidden text-xs text-text2">
              {task.description}
            </p>
          )}

          {/* Category */}
          {task.category && (
            <div className="mb-1.5">
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: task.category.color || '#6366f1' }}>
                <Tag size={9} />{task.category.name}
              </span>
            </div>
          )}

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="mb-1.5 flex flex-wrap gap-1">
              {task.tags.map((t) => (
                <span key={t} className="rounded-full bg-surface2 px-1.5 py-0.5 text-[11px] text-text2">#{t}</span>
              ))}
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div
              className={cn(
                'mb-1.5 flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium',
                dueDateStatus ? 'border' : 'text-text2',
              )}
              style={dueDateStatus ? {
                background: dueDateColors[dueDateStatus].bg,
                color: dueDateColors[dueDateStatus].text,
                borderColor: dueDateColors[dueDateStatus].border,
              } : undefined}
            >
              {dueDateStatus === 'overdue' ? <AlertCircle size={11} /> :
               dueDateStatus === 'soon' ? <Clock size={11} /> : <Calendar size={11} />}
              {dueDateStatus === 'overdue' ? 'เกินกำหนด: ' :
               dueDateStatus === 'soon' ? 'ใกล้ครบ: ' : ''}
              {formatDate(task.dueDate)}
            </div>
          )}

          {/* Assigned Users */}
          {task.assignedTo?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <User size={11} className="text-text2" />
              {task.assignedTo.map((u) => (
                <div
                  key={u._id}
                  title={u.username}
                  className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
                >
                  {u.username[0].toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
