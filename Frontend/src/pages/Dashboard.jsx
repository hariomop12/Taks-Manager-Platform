import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/index.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!stats) return <div className="loading">Failed to load stats</div>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, color: '#6366f1' },
    { label: 'Total Tasks', value: stats.totalTasks, color: '#22c55e' },
    { label: 'Completed', value: stats.tasksByStatus.completed, color: '#16a34a' },
    { label: 'Pending', value: stats.tasksByStatus.pending, color: '#f59e0b' },
    { label: 'In Progress', value: stats.tasksByStatus.in_progress, color: '#3b82f6' },
    { label: 'High Priority', value: stats.tasksByPriority.high, color: '#ef4444' },
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card" style={{ borderTopColor: card.color }}>
            <span className="stat-value">{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </div>
        ))}
      </div>
      {stats.tasksByPriority.critical > 0 && (
        <div className="alert alert-warning" style={{ marginTop: 16 }}>
          ⚠ {stats.tasksByPriority.critical} critical tasks need attention!
        </div>
      )}
    </div>
  );
}
