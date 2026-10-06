import { Assignment, Priority, ApiResponse } from '../types/assignment';

/**
 * Generic Type Guard: Kiểm tra xem một giá trị bất kỳ có phải là Object (Record<string, unknown>) không
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type Guard: Kiểm tra xem giá trị có thuộc kiểu Priority ('HIGH' | 'MEDIUM' | 'LOW') hay không
 */
export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && ['HIGH', 'MEDIUM', 'LOW'].includes(value);
}

/**
 * Type Guard: Kiểm tra một đối tượng bất kỳ có đúng cấu trúc của Assignment hay không
 * Giúp bảo đảm an toàn dữ liệu từ Mock API hoặc LocalStorage trước khi đưa vào Redux store.
 */
export function isAssignment(obj: unknown): obj is Assignment {
  if (!isRecord(obj)) return false;

  return (
    typeof obj.id === 'string' &&
    typeof obj.subject === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.dueDate === 'string' &&
    isPriority(obj.priority) &&
    typeof obj.completed === 'boolean' &&
    typeof obj.createdAt === 'string'
  );
}

/**
 * Type Guard: Kiểm tra xem dữ liệu có phải là danh sách Assignment[] hợp lệ hay không
 */
export function isAssignmentList(data: unknown): data is Assignment[] {
  if (!Array.isArray(data)) return false;
  return data.every(isAssignment);
}

/**
 * Generic Type Guard: Kiểm tra một đối tượng phản hồi có phải là ApiResponse<T> hay không
 */
export function isApiResponse<T>(
  response: unknown,
  dataValidator: (item: unknown) => item is T
): response is ApiResponse<T> {
  if (!isRecord(response)) return false;

  return (
    typeof response.success === 'boolean' &&
    typeof response.timestamp === 'number' &&
    dataValidator(response.data)
  );
}

