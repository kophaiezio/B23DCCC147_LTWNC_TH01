import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setFilter,
  setSearchQuery,
  selectFilter,
  selectSearchQuery,
  selectAssignmentStats,
} from './assignmentsSlice';
import { FilterStatus, FilterOption } from '../../types/assignment';
import { Search, Filter as FilterIcon, X } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector(selectFilter);
  const searchQuery = useAppSelector(selectSearchQuery);
  const stats = useAppSelector(selectAssignmentStats);

  // Danh sách các tùy chọn lọc kèm Generic Type FilterOption<FilterStatus>
  const filterOptions: FilterOption<FilterStatus>[] = [
    { value: 'ALL', label: 'Tất cả', count: stats.total },
    { value: 'PENDING', label: 'Chưa hoàn thành', count: stats.pending },
    { value: 'OVERDUE', label: 'Quá hạn', count: stats.overdue },
    { value: 'COMPLETED', label: 'Đã hoàn thành', count: stats.completed },
  ];

  return (
    <div className="filter-bar-container">
      {/* Search Input */}
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Tìm theo môn học hoặc tên bài tập..."
          className="search-input"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => dispatch(setSearchQuery(''))}
            className="search-clear-btn"
            title="Xóa tìm kiếm"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-wrapper">
        <div className="filter-label-group">
          <FilterIcon size={16} className="filter-header-icon" />
          <span className="filter-title">Bộ lọc:</span>
        </div>

        <div className="filter-tabs">
          {filterOptions.map((opt) => {
            const isActive = currentFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => dispatch(setFilter(opt.value))}
                className={`filter-tab-btn ${isActive ? 'active' : ''} tab-${opt.value.toLowerCase()}`}
              >
                <span>{opt.label}</span>
                {typeof opt.count === 'number' && (
                  <span className={`tab-count ${isActive ? 'count-active' : ''}`}>
                    {opt.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

