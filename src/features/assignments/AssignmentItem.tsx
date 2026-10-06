import React from 'react';
import { Assignment } from '../../types/assignment';
import { AssignmentCard } from '../../components/AssignmentCard';

interface AssignmentItemProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (assignment: Assignment) => void;
}

/**
 * Component hiển thị một bài tập riêng lẻ
 * Ứng dụng mô hình Compound Component (AssignmentCard) giúp tách nhỏ logic,
 * linh hoạt tùy biến và tái sử dụng các khối giao diện.
 */
export const AssignmentItem: React.FC<AssignmentItemProps> = ({
  assignment,
  onToggle,
  onDelete,
}) => {
  return (
    <AssignmentCard
      assignment={assignment}
      onToggle={onToggle}
      onDelete={onDelete}
    >
      <AssignmentCard.Header />
      <AssignmentCard.Title />
      <AssignmentCard.DueDateBadge />
      <AssignmentCard.Actions />
    </AssignmentCard>
  );
};

