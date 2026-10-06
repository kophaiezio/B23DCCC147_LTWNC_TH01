import { Assignment, ApiResponse } from '../types/assignment';
import { isAssignmentList } from '../utils/typeGuards';

/**
 * Hàm trợ giúp sinh chuỗi ngày chênh lệch với ngày hôm nay (YYYY-MM-DD)
 */
function getDateWithOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Danh sách bài tập mẫu ban đầu
 * Phản ánh đầy đủ các trạng thái: Quá hạn, Đến hạn hôm nay, Sắp đến hạn, Đã hoàn thành
 */
const initialMockAssignments: Assignment[] = [
  {
    id: 'asg-001',
    subject: 'Lập trình Web (ReactJS)',
    title: 'Xây dựng Student Deadline Tracker với Redux Toolkit & TypeScript',
    dueDate: getDateWithOffset(0), // Đến hạn hôm nay
    priority: 'HIGH',
    completed: false,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'asg-002',
    subject: 'Cơ sở dữ liệu nâng cao',
    title: 'Thiết kế lược đồ ERD & tối ưu câu truy vấn SQL Indexing',
    dueDate: getDateWithOffset(-2), // Đã quá hạn 2 ngày
    priority: 'HIGH',
    completed: false,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'asg-003',
    subject: 'Hệ điều hành',
    title: 'Mô phỏng thuật toán lập lịch CPU (Round Robin & SJF)',
    dueDate: getDateWithOffset(3), // Còn 3 ngày
    priority: 'MEDIUM',
    completed: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'asg-004',
    subject: 'Trí tuệ nhân tạo',
    title: 'Cài đặt thuật toán tìm kiếm A* và Minimax cho cờ Caro',
    dueDate: getDateWithOffset(7), // Còn 7 ngày
    priority: 'LOW',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'asg-005',
    subject: 'Kiến trúc máy tính',
    title: 'Viết báo cáo mạch cộng nhị phân ALU 8-bit bằng Logisim',
    dueDate: getDateWithOffset(-1), // Quá hạn nhưng đã nộp
    priority: 'MEDIUM',
    completed: true,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
];

/**
 * Generic API Simulation:
 * Hàm giả lập cuộc gọi HTTP bất đồng bộ với độ trễ mạng (network delay) và Type Guard kiểm tra dữ liệu trả về.
 *
 * @template T Kiểu dữ liệu trả về mong đợi
 * @param data Dữ liệu giả lập
 * @param delayMs Thời gian chờ giả lập (mặc định 700ms)
 * @param validator Type guard function tùy chọn để kiểm định tính hợp lệ của dữ liệu trước khi trả về
 */
export async function simulateApiCall<T>(
  data: unknown,
  delayMs: number = 700,
  validator?: (value: unknown) => value is T
): Promise<ApiResponse<T>> {
  return new Promise<ApiResponse<T>>((resolve, reject) => {
    setTimeout(() => {
      // Nếu có validator Type Guard, tiến hành kiểm tra runtime type
      if (validator && !validator(data)) {
        reject(new Error('Dữ liệu API trả về không khớp với cấu trúc dự kiến (Type Guard Error)!'));
        return;
      }

      // Trả về ApiResponse generic chuẩn
      resolve({
        success: true,
        data: data as T,
        message: 'Lấy dữ liệu thành công từ Mock Server',
        timestamp: Date.now(),
      });
    }, delayMs);
  });
}

/**
 * Hàm gọi API giả lập lấy danh sách bài tập ban đầu
 * Sử dụng Type Guard `isAssignmentList` để đảm bảo dữ liệu đúng type `Assignment[]`.
 */
export async function fetchAssignmentsApi(): Promise<Assignment[]> {
  const response = await simulateApiCall<Assignment[]>(
    initialMockAssignments,
    750,
    isAssignmentList
  );

  return response.data;
}

