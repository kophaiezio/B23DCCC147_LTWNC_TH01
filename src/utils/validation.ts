import { NewAssignmentPayload } from '../types/assignment';
import { isPriority } from './typeGuards';

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type AssignmentFormFields = NewAssignmentPayload;

/**
 * Validate dữ liệu form thêm bài tập mới:
 * - Không để trống môn học (tối thiểu 2 ký tự)
 * - Không để trống tên bài tập (tối thiểu 3 ký tự)
 * - Hạn nộp phải đúng định dạng ngày hợp lệ (YYYY-MM-DD)
 * - Độ ưu tiên phải hợp lệ ('HIGH' | 'MEDIUM' | 'LOW')
 */
export function validateAssignmentForm(values: AssignmentFormFields): FormErrors<AssignmentFormFields> {
  const errors: FormErrors<AssignmentFormFields> = {};

  if (!values.subject || values.subject.trim() === '') {
    errors.subject = 'Vui lòng nhập tên môn học.';
  } else if (values.subject.trim().length < 2) {
    errors.subject = 'Tên môn học phải có ít nhất 2 ký tự.';
  }

  if (!values.title || values.title.trim() === '') {
    errors.title = 'Vui lòng nhập tên bài tập.';
  } else if (values.title.trim().length < 3) {
    errors.title = 'Tên bài tập phải có ít nhất 3 ký tự.';
  }

  if (!values.dueDate || values.dueDate.trim() === '') {
    errors.dueDate = 'Vui lòng chọn hạn nộp.';
  } else {
    const isValidDate = !isNaN(Date.parse(values.dueDate));
    if (!isValidDate) {
      errors.dueDate = 'Định dạng ngày nộp không hợp lệ.';
    }
  }

  if (!values.priority || !isPriority(values.priority)) {
    errors.priority = 'Vui lòng chọn mức độ ưu tiên hợp lệ (Cao, Trung bình, Thấp).';
  }

  return errors;
}

export function hasErrors<T>(errors: FormErrors<T>): boolean {
  return Object.values(errors).some((err) => !!err);
}
