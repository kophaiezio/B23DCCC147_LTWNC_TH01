import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  selectFilteredAssignments,
  selectLoading,
  selectError,
  toggleAssignment,
  deleteAssignment,
  fetchAssignments,
} from './assignmentsSlice';
import { Assignment } from '../../types/assignment';
import { AssignmentItem } from './AssignmentItem';
import { withAsyncState } from '../../components/withAsyncState';
import { ConfirmModal } from '../../components/ConfirmModal';

interface PureAssignmentsListProps {
  assignments: Assignment[];
  onToggle: (id: string) => void;
  onRequestDelete: (assignment: Assignment) => void;
}

/**
 * Component hiển thị danh sách dạng lưới thô (Pure Grid)
 */
const PureAssignmentsList: React.FC<PureAssignmentsListProps> = ({
  assignments,
  onToggle,
  onRequestDelete,
}) => {
  return (
    <div className="assignments-grid">
      {assignments.map((assignment) => (
        <AssignmentItem
          key={assignment.id}
          assignment={assignment}
          onToggle={onToggle}
          onDelete={onRequestDelete}
        />
      ))}
    </div>
  );
};

// ÁP DỤNG HIGHER-ORDER COMPONENT (HOC)
// Bọc PureAssignmentsList bằng HOC withAsyncState để tự động xử lý Loading, Error và Empty
const AssignmentsListWithAsync = withAsyncState(PureAssignmentsList);

/**
 * Container component kết nối với Redux Toolkit Store
 */
export const AssignmentsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const assignments = useAppSelector(selectFilteredAssignments);
  const isLoading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  // Trạng thái modal xác nhận xóa
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);

  const handleToggle = (id: string) => {
    dispatch(toggleAssignment(id));
  };

  const handleRequestDelete = (assignment: Assignment) => {
    setDeleteTarget(assignment);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      dispatch(deleteAssignment(deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleRetry = () => {
    dispatch(fetchAssignments());
  };

  return (
    <div className="assignments-list-section">
      <div className="list-section-header">
        <h2 className="section-title">Danh sách bài tập ({assignments.length})</h2>
      </div>

      {/* Sử dụng Component đã được bọc bởi HOC withAsyncState */}
      <AssignmentsListWithAsync
        isLoading={isLoading}
        error={error}
        isEmpty={assignments.length === 0}
        emptyMessage="Không có bài tập nào trong danh mục hoặc từ khóa tìm kiếm này."
        onRetry={handleRetry}
        assignments={assignments}
        onToggle={handleToggle}
        onRequestDelete={handleRequestDelete}
      />

      {/* Modal xác nhận trước khi xóa (Confirm Dialog) */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Xác nhận xóa bài tập"
        message="Bạn có chắc chắn muốn xóa bài tập sau khỏi danh sách theo dõi?"
        itemName={deleteTarget ? `${deleteTarget.subject}: ${deleteTarget.title}` : undefined}
        confirmText="Xác nhận xóa"
        cancelText="Giữ lại"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

