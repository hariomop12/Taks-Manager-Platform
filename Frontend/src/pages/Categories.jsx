import { useState, useEffect } from 'react';
import { categoryApi } from '../api/index.js';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', color: '' });

  const load = () => {
    setLoading(true);
    categoryApi.getAll().then((res) => setCategories(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', color: '' });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, color: cat.color || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await categoryApi.update(editing.id, form);
      } else {
        await categoryApi.create(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await categoryApi.delete(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ New Category</button>
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Color</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td><span className="color-dot" style={{ background: cat.color || '#ccc' }} /> {cat.color || '-'}</td>
                  <td className="actions">
                    <button className="btn-sm" onClick={() => openEdit(cat)}>Edit</button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>Del</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan={3} className="empty">No categories</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="field"><label>Color (hex)</label><input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="#FF5733" /></div>
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
