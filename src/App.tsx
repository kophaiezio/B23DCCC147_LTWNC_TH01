import { useEffect } from 'react';
import { useAppDispatch } from './hooks/redux';
import { fetchAssignments } from './features/assignments/assignmentsSlice';
import { StatSummary } from './components/StatSummary';
import { AssignmentForm } from './features/assignments/AssignmentForm';
import { FilterBar } from './features/assignments/FilterBar';
import { AssignmentsList } from './features/assignments/AssignmentsList';
import { formatDateDisplay, getTodayDateString } from './utils/dateUtils';
import { GraduationCap, RefreshCw } from 'lucide-react';
import './index.css';

export default function App() {
  const dispatch = useAppDispatch();
  const todayFormatted = formatDateDisplay(getTodayDateString());

  // Khởi tạo dữ liệu: Gọi Mock API thông qua Redux createAsyncThunk khi ứng dụng khởi động
  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const handleReloadMockData = () => {
    dispatch(fetchAssignments());
  };

  return (
    <div className="app-layout">
      {/* Header chính của ứng dụng */}
      <header className="app-header">
        <div className="app-container header-inner">
          <div className="header-brand">
            <div className="logo-badge">
              <GraduationCap size={28} />
            </div>
            <div>
              <div className="brand-badge-pill">
                <span>Web Quản Lý Học Tập</span>
              </div>
              <h1 className="brand-title">Student Deadline Tracker</h1>
              <p className="brand-tagline">
                Theo dõi tiến độ, sắp xếp độ ưu tiên và không bao giờ trễ hạn nộp bài
              </p>
            </div>
          </div>

          <div className="header-actions">
            <div className="today-badge">
              <span className="today-label">Hôm nay:</span>
              <span className="today-date">{todayFormatted}</span>
            </div>
            <button
              type="button"
              onClick={handleReloadMockData}
              className="btn-reload-data"
              title="Tải lại dữ liệu mẫu từ Mock API"
            >
              <RefreshCw size={15} />
              <span>Làm mới dữ liệu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Thống kê nhanh các chỉ số */}
      <section className="app-container stats-section">
        <StatSummary />
      </section>

      {/* Thân ứng dụng gồm 2 cột: Cột Form nhập liệu & Cột Danh sách + Bộ lọc */}
      <main className="app-container main-content-layout">
        {/* Cột trái: Form thêm bài tập mới */}
        <aside className="content-sidebar">
          <AssignmentForm />
        </aside>

        {/* Cột phải: Khu vực Bộ lọc và Danh sách bài tập */}
        <section className="content-main">
          <FilterBar />
          <AssignmentsList />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-container footer-inner">
          <p>© 2026 Student Deadline Tracker — Ứng dụng thực hành Lập trình Web với ReactJS, Redux Toolkit & TypeScript</p>
          <div className="tech-stack-badges">
            <span className="tech-badge">React 19</span>
            <span className="tech-badge">Redux Toolkit</span>
            <span className="tech-badge">TypeScript Nâng Cao</span>
            <span className="tech-badge">Compound Component & HOC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

