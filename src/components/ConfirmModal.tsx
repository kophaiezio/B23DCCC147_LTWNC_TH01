import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  confirmText = 'Xác nhận xóa',
  cancelText = 'Hủy bỏ',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onCancel}
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-warning-icon">
            <AlertTriangle size={24} />
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
          {itemName && (
            <div className="modal-item-highlight">
              <span>"{itemName}"</span>
            </div>
          )}
          <p className="modal-warning-sub">Hành động này không thể hoàn tác sau khi đã xóa.</p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-modal-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button type="button" className="btn-modal-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

