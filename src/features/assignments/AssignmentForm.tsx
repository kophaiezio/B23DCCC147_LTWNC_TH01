import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { addAssignment } from './assignmentsSlice';
import { useAssignmentForm } from '../../hooks/useAssignmentForm';
import { validateAssignmentForm, AssignmentFormFields } from '../../utils/validation';
import { getTodayDateString } from '../../utils/dateUtils';
import { PlusCircle, Check, AlertCircle, BookPlus } from 'lucide-react';
import { Priority } from '../../types/assignment';

const initialFormValues: AssignmentFormFields = {
  subject: '',
  title: '',
  dueDate: getTodayDateString(),
  priority: 'MEDIUM',
};

export const AssignmentForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Áp dụng Custom Hook nâng cao useAssignmentForm
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = useAssignmentForm<AssignmentFormFields>({
    initialValues: initialFormValues,
    validate: validateAssignmentForm,
    onSubmit: async (formValues) => {
      // Dispatch action thêm bài tập vào Redux Toolkit Store
      dispatch(addAssignment(formValues));

      // Hiển thị thông báo thành công tạm thời
      setSuccessToast(`Đã thêm bài tập "${formValues.title}" thành công!`);
      setTimeout(() => {
        setSuccessToast(null);
      }, 3500);
    },
  });

  return (
    <section className="form-card-container">
      <div className="form-header">
        <div className="form-header-icon">
          <BookPlus size={22} />
        </div>
        <div>
          <h2 className="form-title">Thêm bài tập mới</h2>
          <p className="form-subtitle">Điền đầy đủ thông tin deadline để hệ thống tự động nhắc nhở</p>
        </div>
      </div>

      {successToast && (
        <div className="form-toast-success" role="alert">
          <Check size={18} />
          <span>{successToast}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="assignment-form">
        <div className="form-grid">
          {/* Trường: Môn học */}
          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Môn học <span className="text-required">*</span>
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="VD: Lập trình Web, Cơ sở dữ liệu..."
              className={`form-input ${touched.subject && errors.subject ? 'input-error' : ''}`}
            />
            {touched.subject && errors.subject && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{errors.subject}</span>
              </div>
            )}
          </div>

          {/* Trường: Tên bài tập */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Tên bài tập <span className="text-required">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="VD: Làm đồ án cuối kỳ, Bài tập tuần 5..."
              className={`form-input ${touched.title && errors.title ? 'input-error' : ''}`}
            />
            {touched.title && errors.title && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Trường: Hạn nộp */}
          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">
              Hạn nộp <span className="text-required">*</span>
            </label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={values.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.dueDate && errors.dueDate ? 'input-error' : ''}`}
            />
            {touched.dueDate && errors.dueDate && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{errors.dueDate}</span>
              </div>
            )}
          </div>

          {/* Trường: Độ ưu tiên */}
          <div className="form-group">
            <label className="form-label">
              Độ ưu tiên <span className="text-required">*</span>
            </label>
            <div className="priority-selector">
              {(
                [
                  { value: 'HIGH', label: 'Cao', class: 'priority-high-radio' },
                  { value: 'MEDIUM', label: 'Trung bình', class: 'priority-medium-radio' },
                  { value: 'LOW', label: 'Thấp', class: 'priority-low-radio' },
                ] as { value: Priority; label: string; class: string }[]
              ).map((p) => (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setFieldValue('priority', p.value)}
                  className={`priority-btn ${p.class} ${values.priority === p.value ? 'selected' : ''}`}
                >
                  <span className="priority-radio-circle" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
            {touched.priority && errors.priority && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{errors.priority}</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-submit"
          >
            <PlusCircle size={18} />
            <span>{isSubmitting ? 'Đang thêm...' : 'Thêm bài tập'}</span>
          </button>
        </div>
      </form>
    </section>
  );
};

