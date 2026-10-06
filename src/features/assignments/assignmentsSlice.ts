import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Assignment,
  FilterStatus,
  NewAssignmentPayload,
  UpdateAssignmentPayload,
} from '../../types/assignment';
import { fetchAssignmentsApi } from '../../api/mockApi';
import { calculateDaysDifference } from '../../utils/dateUtils';
import type { RootState } from '../../app/store';

export interface AssignmentsState {
  items: Assignment[];
  filter: FilterStatus;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentsState = {
  items: [],
  filter: 'ALL',
  searchQuery: '',
  loading: false,
  error: null,
};

/**
 * Async Thunk: Lấy danh sách bài tập ban đầu từ mock API
 */
export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>('assignments/fetchAssignments', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchAssignmentsApi();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Đã xảy ra lỗi không xác định khi tải dữ liệu bài tập.');
  }
});

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    // Thêm bài tập mới (sử dụng Utility Type Omit từ NewAssignmentPayload)
    addAssignment: (state, action: PayloadAction<NewAssignmentPayload>) => {
      const newAssignment: Assignment = {
        ...action.payload,
        id: `asg-${Date.now()}`,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      // Đưa bài tập mới lên đầu danh sách
      state.items.unshift(newAssignment);
    },

    // Bật/tắt trạng thái hoàn thành (checkbox/toggle)
    toggleAssignment: (state, action: PayloadAction<string>) => {
      const item = state.items.find((a) => a.id === action.payload);
      if (item) {
        item.completed = !item.completed;
      }
    },

    // Xóa bài tập theo id
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((a) => a.id !== action.payload);
    },

    // Cập nhật bài tập (sử dụng Utility Type Partial & Omit từ UpdateAssignmentPayload)
    updateAssignment: (state, action: PayloadAction<UpdateAssignmentPayload>) => {
      const { id, ...updates } = action.payload;
      const index = state.items.findIndex((a) => a.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
      }
    },

    // Thay đổi trạng thái bộ lọc (Tất cả / Chưa hoàn thành / Quá hạn / Đã hoàn thành)
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },

    // Tìm kiếm bài tập theo tên hoặc môn học
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    // Xóa lỗi nếu có
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể tải danh sách bài tập.';
      });
  },
});

export const {
  addAssignment,
  toggleAssignment,
  deleteAssignment,
  updateAssignment,
  setFilter,
  setSearchQuery,
  clearError,
} = assignmentsSlice.actions;

// Selectors
export const selectAssignments = (state: RootState) => state.assignments.items;
export const selectFilter = (state: RootState) => state.assignments.filter;
export const selectSearchQuery = (state: RootState) => state.assignments.searchQuery;
export const selectLoading = (state: RootState) => state.assignments.loading;
export const selectError = (state: RootState) => state.assignments.error;

/**
 * Selector lọc danh sách bài tập theo trạng thái Filter và Search Query
 */
export const selectFilteredAssignments = (state: RootState): Assignment[] => {
  const { items, filter, searchQuery } = state.assignments;

  return items.filter((item) => {
    // 1. Lọc theo text tìm kiếm (môn học hoặc tên bài tập)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchSubject = item.subject.toLowerCase().includes(query);
      const matchTitle = item.title.toLowerCase().includes(query);
      if (!matchSubject && !matchTitle) return false;
    }

    // 2. Lọc theo trạng thái
    const daysDiff = calculateDaysDifference(item.dueDate);
    const isOverdue = daysDiff < 0 && !item.completed;

    switch (filter) {
      case 'PENDING':
        return !item.completed && !isOverdue;
      case 'OVERDUE':
        return isOverdue;
      case 'COMPLETED':
        return item.completed;
      case 'ALL':
      default:
        return true;
    }
  });
};

/**
 * Selector thống kê số lượng bài tập theo từng loại
 */
export const selectAssignmentStats = (state: RootState) => {
  const items = state.assignments.items;
  let completed = 0;
  let overdue = 0;
  let pending = 0;

  for (const item of items) {
    if (item.completed) {
      completed++;
    } else {
      const daysDiff = calculateDaysDifference(item.dueDate);
      if (daysDiff < 0) {
        overdue++;
      } else {
        pending++;
      }
    }
  }

  return {
    total: items.length,
    completed,
    overdue,
    pending,
  };
};

export default assignmentsSlice.reducer;

