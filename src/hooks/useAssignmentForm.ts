import { useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { FormErrors, hasErrors } from '../utils/validation';

export interface UseAssignmentFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validate: (values: T) => FormErrors<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

/**
 * Custom Hook Nâng Cao: Quản lý Form với Generic, validation theo thời gian thực và quản lý trạng thái form
 *
 * @template T Kiểu dữ liệu của các trường trong Form (kế thừa từ Record<string, unknown>)
 */
export function useAssignmentForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
}: UseAssignmentFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Xử lý thay đổi giá trị của ô input / select / textarea
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setValues((prev) => {
        const nextValues = {
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        };

        // Nếu trường này đã từng touched, kiểm tra lỗi tức thì khi gõ
        if (touched[name as keyof T]) {
          const validationErrors = validate(nextValues);
          setErrors(validationErrors);
        }

        return nextValues;
      });
    },
    [touched, validate]
  );

  // Xử lý khi người dùng blur khỏi ô input
  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Kích hoạt validate khi blur
      const validationErrors = validate(values);
      setErrors(validationErrors);
    },
    [validate, values]
  );

  // Đặt giá trị tùy ý cho một trường cụ thể (dành cho custom components hoặc dropdown tùy biến)
  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => {
        const nextValues = { ...prev, [field]: value };
        if (touched[field]) {
          setErrors(validate(nextValues));
        }
        return nextValues;
      });
    },
    [touched, validate]
  );

  // Reset form về trạng thái ban đầu
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Xử lý submit form
  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Đánh dấu tất cả các trường là touched khi submit
      const allTouched: Partial<Record<keyof T, boolean>> = {};
      Object.keys(values).forEach((key) => {
        allTouched[key as keyof T] = true;
      });
      setTouched(allTouched);

      // Validate toàn bộ form
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // Nếu có bất kỳ lỗi nào, dừng lại không submit
      if (hasErrors(validationErrors)) {
        return false;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
        resetForm();
        return true;
      } catch (err) {
        console.error('Lỗi khi submit form:', err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit, resetForm]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    resetForm,
  };
}

