import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

function Notification({ message, type = 'info', onClose, show = false }) {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-success" style={{ width: '1.25rem', height: '1.25rem' }} />;
      case 'error':
        return <XCircle className="text-danger" style={{ width: '1.25rem', height: '1.25rem' }} />;
      default:
        return <Info className="text-info" style={{ width: '1.25rem', height: '1.25rem' }} />;
    }
  };

  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      default:
        return 'alert-info';
    }
  };

  return (
    <div className={`position-fixed top-0 end-0 p-3`} style={{ zIndex: 1050, maxWidth: '400px' }}>
      <div className={`alert ${getAlertClass()} alert-dismissible fade show d-flex align-items-start`} role="alert">
        <div className="me-2">
          {getIcon()}
        </div>
        <div className="flex-grow-1">
          <p className="mb-0 fw-medium">{message}</p>
        </div>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
}

export default Notification; 