import { DeadlineCategory, DeadlineInfo } from '../types/assignment';

/**
 * Chuẩn hóa một Date về 00:00:00.000 để so sánh số ngày chính xác không bị lệch giờ.
 */
export function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Trả về chuỗi ngày hôm nay định dạng YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Tính số ngày chênh lệch giữa hạn nộp và ngày hiện tại.
 * - Số âm: đã quá hạn
 * - 0: hạn nộp hôm nay
 * - Số dương: còn X ngày nữa
 */
export function calculateDaysDifference(dueDateStr: string, baseDate: Date = new Date()): number {
  const [year, month, day] = dueDateStr.split('-').map(Number);
  if (!year || !month || !day) return 0;

  const dueDate = normalizeDate(new Date(year, month - 1, day));
  const current = normalizeDate(baseDate);

  const diffTime = dueDate.getTime() - current.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Định dạng chuỗi ngày YYYY-MM-DD sang DD/MM/YYYY để hiển thị thân thiện với người dùng Việt Nam.
 */
export function formatDateDisplay(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/**
 * Phân tích và trả về thông tin trạng thái hạn chót:
 * "Quá hạn Y ngày", "Còn X ngày", hoặc "Hôm nay là hạn nộp"
 */
export function getDeadlineInfo(dueDateStr: string, completed: boolean): DeadlineInfo {
  if (completed) {
    return {
      text: 'Đã hoàn thành',
      category: 'completed',
      daysDiff: calculateDaysDifference(dueDateStr),
    };
  }

  const daysDiff = calculateDaysDifference(dueDateStr);

  if (daysDiff < 0) {
    const overdueDays = Math.abs(daysDiff);
    return {
      text: `Quá hạn ${overdueDays} ngày`,
      category: 'overdue',
      daysDiff,
    };
  }

  if (daysDiff === 0) {
    return {
      text: 'Hôm nay là hạn nộp!',
      category: 'due-today',
      daysDiff: 0,
    };
  }

  if (daysDiff === 1) {
    return {
      text: 'Còn 1 ngày (Ngày mai)',
      category: 'upcoming',
      daysDiff: 1,
    };
  }

  return {
    text: `Còn ${daysDiff} ngày`,
    category: 'upcoming',
    daysDiff,
  };
}

/**
 * Trả về class CSS hoặc màu sắc tương ứng với trạng thái hạn chót
 */
export function getDeadlineBadgeStyle(category: DeadlineCategory): {
  bg: string;
  text: string;
  border: string;
} {
  switch (category) {
    case 'completed':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    case 'overdue':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
      };
    case 'due-today':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-300',
      };
    case 'upcoming':
    default:
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
      };
  }
}

