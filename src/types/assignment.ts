// ==========================================
// TYPES & INTERFACES FOR ASSIGNMENT TRACKER
// ==========================================

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type FilterStatus = 'ALL' | 'PENDING' | 'OVERDUE' | 'COMPLETED';

export type DeadlineCategory = 'overdue' | 'due-today' | 'upcoming' | 'completed';

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string; // Định dạng YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

// ------------------------------------------
// TypeScript Utility Types:
// ------------------------------------------

// Omit: Tạo bài tập mới chưa có id, createdAt và completed (sẽ do hệ thống mặc định false và sinh id)
export type NewAssignmentPayload = Omit<Assignment, 'id' | 'createdAt' | 'completed'>;

// Partial + Omit: Dùng khi cập nhật bài tập (có thể cập nhật một vài trường nhưng bắt buộc có id)
export type UpdateAssignmentPayload = Partial<Omit<Assignment, 'id'>> & { id: string };

// Pick: Tóm tắt thông tin cơ bản của bài tập
export type AssignmentSummary = Pick<Assignment, 'id' | 'title' | 'completed'>;

// Record: Bản đồ nhãn và màu sắc theo độ ưu tiên
export type PriorityConfig = Record<
  Priority,
  {
    label: string;
    badgeClass: string;
    dotColor: string;
  }
>;

// ------------------------------------------
// TypeScript Generics:
// ------------------------------------------

// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: number;
}

// Generic Filter Item Option
export interface FilterOption<T> {
  value: T;
  label: string;
  count?: number;
}

// Kết quả phân tích hạn chót của bài tập
export interface DeadlineInfo {
  text: string;
  category: DeadlineCategory;
  daysDiff: number;
}
