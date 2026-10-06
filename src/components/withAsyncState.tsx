import React, { ComponentType } from 'react';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';

// Props mở rộng mà HOC yêu cầu truyền vào
export interface WithAsyncStateProps {
  isLoading: boolean;
  error: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
}

/**
 * HIGHER-ORDER COMPONENT (HOC) PATTERN: withAsyncState
 *
 * Nhận vào một component và trả về component mới được trang bị khả năng xử lý
 * các trạng thái bất đồng bộ: Đang tải (Loading Skeleton), Báo lỗi (Error State + Retry),
 * và Dữ liệu rỗng (Empty State).
 *
 * @template P Kiểu props của Component gốc
 */
export function withAsyncState<P extends object>(
  WrappedComponent: ComponentType<P>
): React.FC<P & WithAsyncStateProps> {
  const ComponentWithAsyncState: React.FC<P & WithAsyncStateProps> = (props) => {
    const {
      isLoading,
      error,
      isEmpty = false,
      emptyMessage = 'Không tìm thấy bài tập nào phù hợp.',
      onRetry,
      ...wrappedProps
    } = props;

    // 1. Trạng thái Đang tải (Loading Skeleton)
    if (isLoading) {
      return (
        <div className="async-loading-container" role="status" aria-live="polite">
          <div className="skeleton-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-pill short" />
                  <div className="skeleton-pill mini" />
                </div>
                <div className="skeleton-line long" />
                <div className="skeleton-line medium" />
                <div className="skeleton-footer">
                  <div className="skeleton-box" />
                  <div className="skeleton-circle" />
                </div>
              </div>
            ))}
          </div>
          <div className="loading-spinner-row">
            <RefreshCw className="spinner-icon" size={18} />
            <span>Đang tải danh sách bài tập từ hệ thống...</span>
          </div>
        </div>
      );
    }

    // 2. Trạng thái Báo lỗi (Error State)
    if (error) {
      return (
        <div className="async-error-container" role="alert">
          <div className="error-icon-box">
            <AlertCircle size={32} />
          </div>
          <h4 className="error-title">Đã xảy ra lỗi khi tải dữ liệu</h4>
          <p className="error-desc">{error}</p>
          {onRetry && (
            <button type="button" onClick={onRetry} className="btn-retry">
              <RefreshCw size={16} />
              Thử tải lại
            </button>
          )}
        </div>
      );
    }

    // 3. Trạng thái Dữ liệu rỗng (Empty State)
    if (isEmpty) {
      return (
        <div className="async-empty-container">
          <div className="empty-icon-box">
            <Inbox size={40} />
          </div>
          <h4 className="empty-title">Chưa có bài tập nào</h4>
          <p className="empty-desc">{emptyMessage}</p>
        </div>
      );
    }

    // 4. Trạng thái bình thường: Render Component gốc với toàn bộ props
    return <WrappedComponent {...(wrappedProps as P)} />;
  };

  ComponentWithAsyncState.displayName = `withAsyncState(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return ComponentWithAsyncState;
}

