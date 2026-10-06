import { createContext, useContext, ReactNode } from 'react';
import { Assignment, Priority } from '../types/assignment';
import { formatDateDisplay, getDeadlineInfo } from '../utils/dateUtils';
import { AlertCircle, Calendar, CheckCircle2, Clock, Trash2 } from 'lucide-react';

// =========================================================================
// COMPOUND COMPONENT PATTERN: AssignmentCard
// =========================================================================

interface AssignmentCardContextType {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (assignment: Assignment) => void;
}

const AssignmentCardContext = createContext<AssignmentCardContextType | null>(null);

function useAssignmentCardContext() {
  const context = useContext(AssignmentCardContext);
  if (!context) {
    throw new Error('Các sub-component của AssignmentCard phải được đặt bên trong <AssignmentCard>');
  }
  return context;
}

// -------------------------------------------------------------------------
// 1. Root Container Component
// -------------------------------------------------------------------------
export interface AssignmentCardProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (assignment: Assignment) => void;
  children: ReactNode;
}

export function AssignmentCardRoot({
  assignment,
  onToggle,
  onDelete,
  children,
}: AssignmentCardProps) {
  const deadline = getDeadlineInfo(assignment.dueDate, assignment.completed);
  const isOverdue = deadline.category === 'overdue';
  const isDueToday = deadline.category === 'due-today';

  return (
    <AssignmentCardContext.Provider value={{ assignment, onToggle, onDelete }}>
      <div
        className={`assignment-card ${
          assignment.completed
            ? 'is-completed'
            : isOverdue
            ? 'is-overdue'
            : isDueToday
            ? 'is-due-today'
            : 'is-active'
        }`}
      >
        {children}
      </div>
    </AssignmentCardContext.Provider>
  );
}

// -------------------------------------------------------------------------
// 2. Sub-component: Header (Môn học + Badge Độ ưu tiên)
// -------------------------------------------------------------------------
function AssignmentCardHeader() {
  const { assignment } = useAssignmentCardContext();

  const priorityLabels: Record<Priority, { label: string; className: string }> = {
    HIGH: { label: 'Ưu tiên Cao', className: 'priority-high' },
    MEDIUM: { label: 'Ưu tiên TB', className: 'priority-medium' },
    LOW: { label: 'Ưu tiên Thấp', className: 'priority-low' },
  };

  const priorityInfo = priorityLabels[assignment.priority] || priorityLabels.MEDIUM;

  return (
    <div className="card-header">
      <span className="subject-tag" title={assignment.subject}>
        {assignment.subject}
      </span>
      <span className={`priority-badge ${priorityInfo.className}`}>
        <span className="dot" />
        {priorityInfo.label}
      </span>
    </div>
  );
}

// -------------------------------------------------------------------------
// 3. Sub-component: Title (Tên bài tập)
// -------------------------------------------------------------------------
function AssignmentCardTitle() {
  const { assignment } = useAssignmentCardContext();

  return (
    <h3
      className={`card-title ${assignment.completed ? 'completed-text' : ''}`}
      title={assignment.title}
    >
      {assignment.title}
    </h3>
  );
}

// -------------------------------------------------------------------------
// 4. Sub-component: DueDateBadge (Hạn nộp & Trạng thái thời gian động)
// -------------------------------------------------------------------------
function AssignmentCardDueDateBadge() {
  const { assignment } = useAssignmentCardContext();
  const deadline = getDeadlineInfo(assignment.dueDate, assignment.completed);
  const formattedDate = formatDateDisplay(assignment.dueDate);

  return (
    <div className="card-time-info">
      <div className="due-date-row">
        <Calendar size={14} className="icon-calendar" />
        <span className="due-date-text">Hạn nộp: {formattedDate}</span>
      </div>

      <div className={`deadline-badge status-${deadline.category}`}>
        {deadline.category === 'completed' && <CheckCircle2 size={13} />}
        {deadline.category === 'overdue' && <AlertCircle size={13} />}
        {deadline.category === 'due-today' && <Clock size={13} />}
        {deadline.category === 'upcoming' && <Clock size={13} />}
        <span className="deadline-text">{deadline.text}</span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// 5. Sub-component: Actions (Checkbox hoàn thành + Nút Xóa)
// -------------------------------------------------------------------------
function AssignmentCardActions() {
  const { assignment, onToggle, onDelete } = useAssignmentCardContext();

  return (
    <div className="card-actions">
      <label className="toggle-complete-label" title={assignment.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}>
        <input
          type="checkbox"
          checked={assignment.completed}
          onChange={() => onToggle(assignment.id)}
          className="complete-checkbox"
        />
        <span className="checkbox-custom" />
        <span className="toggle-text">
          {assignment.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
        </span>
      </label>

      <button
        type="button"
        onClick={() => onDelete(assignment)}
        className="btn-delete"
        title="Xóa bài tập này"
        aria-label="Xóa bài tập"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// Ghép các sub-components vào Compound Component AssignmentCard
export const AssignmentCard = Object.assign(AssignmentCardRoot, {
  Header: AssignmentCardHeader,
  Title: AssignmentCardTitle,
  DueDateBadge: AssignmentCardDueDateBadge,
  Actions: AssignmentCardActions,
});
