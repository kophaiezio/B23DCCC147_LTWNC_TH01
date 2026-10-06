import React from 'react';
import { useAppSelector } from '../hooks/redux';
import { selectAssignmentStats } from '../features/assignments/assignmentsSlice';
import { CheckCircle, Clock, AlertTriangle, BookOpen } from 'lucide-react';

export const StatSummary: React.FC = () => {
  const stats = useAppSelector(selectAssignmentStats);
  const percentCompleted = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon-wrapper bg-blue-subtle">
          <BookOpen className="stat-icon text-blue" size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Tổng bài tập</span>
          <span className="stat-value">{stats.total}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper bg-amber-subtle">
          <Clock className="stat-icon text-amber" size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Chưa hoàn thành</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper bg-rose-subtle">
          <AlertTriangle className="stat-icon text-rose" size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Đã quá hạn</span>
          <span className="stat-value text-rose">{stats.overdue}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper bg-emerald-subtle">
          <CheckCircle className="stat-icon text-emerald" size={20} />
        </div>
        <div className="stat-content">
          <div className="stat-title-row">
            <span className="stat-label">Đã xong</span>
            <span className="stat-badge-percent">{percentCompleted}%</span>
          </div>
          <span className="stat-value">{stats.completed}</span>
        </div>
      </div>
    </div>
  );
};

