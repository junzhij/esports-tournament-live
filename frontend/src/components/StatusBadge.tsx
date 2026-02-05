import React from 'react';

interface StatusBadgeProps {
  status: 'running' | 'finished';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`status-badge ${status === 'running' ? 'status-running' : 'status-finished'}`}>
      {status === 'running' ? '进行中' : '已结束'}
    </span>
  );
};

export default StatusBadge;
