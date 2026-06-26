import { useState, useEffect } from 'react';
import { taskApi, categoryApi, userApi } from '../api/index.js';

const priorities = ['low', 'medium', 'high', 'critical'];
const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: '', priority: '', search: '' });

  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium', status: 'pending',
    due_date: '', assigned_to: '', category_ids: [],
  });

  const loadTasks = () => {
    setLoading(true);
    const params = { ...filters };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    taskApi.getAll(params)
      .then((res) => { setTasks(res.data); setMeta(res.meta); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTasks(); }, [filters.page, filters.status, filters.priority, filters.search]);

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data)).catch(() => {});
    userApi.getAll({ limit: 100 }).then((res) => setUsers(res.data)).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', priority: 'medium', status: 'pending', due_date: '', assigned_to: '', category_ids: [] });
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title, description: task.description || '', priority: task.priority,
      status: task.status, due_date: task.due_date || '', assigned_to: task.assigned_to || '',
      category_ids: task.Categories?.map((c) => c.id) || [],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        due_date: form.due_date || null,
        assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
      };
      if (editing) {
        await taskApi.update(editing.id, payload);
      } else {
        await taskApi.create(payload);
      }
      setShowModal(false);
      loadTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    await taskApi.delete(id);
    loadTasks();
  };

  const handleStatusChange = async (id, status) => {
    await taskApi.updateStatus(id, status);
    loadTasks();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ New Task</button>
      </div>

      <div className="filters">
        <input placeholder="Search..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All Status</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}>
          <option value="">All Priority</option>
          {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td><span className={`badge badge-${task.status}`}>{task.status}</span></td>
                    <td><span className={`badge badge-${task.priority}`}>{task.priority}</span></td>
                    <td>{task.assignedUser?.name || '-'}</td>
                    <td>{task.due_date || '-'}</td>
                    <td className="actions">
                      <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)} className="status-select">
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button className="btn-sm" onClick={() => openEdit(task)}>Edit</button>
                      <button className="btn-sm btn-danger" onClick={() => handleDelete(task.id)}>Del</button>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && <tr><td colSpan={6} className="empty">No tasks found</td></tr>}
              </tbody>
            </table>
          </div>
          {meta && (
            <div className="pagination">
              <button disabled={meta.page <= 1} onClick={() => setFilters({ ...filters, page: meta.page - 1 })}>Prev</button>
              <span>Page {meta.page} of {meta.totalPages}</span>
              <button disabled={meta.page >= meta.totalPages} onClick={() => setFilters({ ...filters, page: meta.page + 1 })}>Next</button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="field"><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="field"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="field-row">
                <div className="field"><label>Priority</label><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{priorities.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
                <div className="field"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Due Date</label><input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
                <div className="field"><label>Assign To</label><select value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}><option value="">Unassigned</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
              </div>
              <div className="field"><label>Categories</label><div className="checkbox-group">{categories.map((c) => (<label key={c.id}><input type="checkbox" checked={form.category_ids.includes(c.id)} onChange={(e) => setForm({ ...form, category_ids: e.target.checked ? [...form.category_ids, c.id] : form.category_ids.filter((id) => id !== c.id) })} /> {c.name}</label>))}</div></div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
