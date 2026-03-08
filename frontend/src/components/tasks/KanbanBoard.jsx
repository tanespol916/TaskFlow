import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#64748b', lightBg: '#f8fafc', darkBg: 'rgba(100,116,139,0.1)' },
  { id: 'in-progress', label: 'In Progress', color: '#3b82f6', lightBg: '#f0f7ff', darkBg: 'rgba(59,130,246,0.1)' },
  { id: 'done', label: 'Done', color: '#22c55e', lightBg: '#f0fdf4', darkBg: 'rgba(34,197,94,0.1)' },
];

export default function KanbanBoard({ tasks, onEdit, onDelete, onDragEnd, onAddTask, onArchive, dark }) {
  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid min-h-[60vh] grid-cols-1 gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="flex w-full flex-col rounded-2xl border"
            style={{
              background: dark ? col.darkBg : col.lightBg,
              borderColor: `${col.color}33`,
            }}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: col.color }} />
                <h3 className="text-[13px] font-semibold text-textc">
                  {col.label}
                </h3>
                <span className="rounded-full px-2 py-[1px] text-[11px] font-bold" style={{ background: `${col.color}22`, color: col.color }}>
                  {tasksByStatus[col.id].length}
                </span>
              </div>
              <button
                onClick={() => onAddTask(col.id)}
                className="flex items-center rounded-md p-1 transition hover:bg-white/40"
                style={{ color: col.color }}
                title="เพิ่มงาน"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Drop Zone */}
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 rounded-xl px-2.5 pb-2.5 transition"
                  style={{
                    minHeight: 80,
                    background: snapshot.isDraggingOver ? `${col.color}15` : 'transparent',
                  }}
                >
                  {tasksByStatus[col.id].map((task, index) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      index={index}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onArchive={onArchive}
                    />
                  ))}
                  {provided.placeholder}
                  {tasksByStatus[col.id].length === 0 && !snapshot.isDraggingOver && (
                    <div className="py-8 text-center text-[13px] text-text2">
                      ไม่มีงาน
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
