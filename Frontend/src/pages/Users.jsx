import { useState, useEffect } from 'react';
import { userApi } from '../api/index.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const load = () => {
    setLoading(true);
    userApi.getAll({ page, limit: 10, sortBy: 'created_at', sortOrder: 'DESC' })
      .then((res) => { setUsers(res.data); setMeta(res.meta); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleToggleStatus = async (user) => {
    await userApi.update(user.id, { is_active: user.is_active ? 0 : 1 });
    load();
  };

  return (
    <div>
      <h1 className="page-title">Users</h1>
      {loading ? <div className="loading">Loading...</div> : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                    <td><span className={`badge ${u.is_active ? 'badge-active' : 'badge-inactive'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td className="actions">
                      <button className="btn-sm" onClick={() => handleToggleStatus(u)}>
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta && (
            <div className="pagination">
              <button disabled={meta.page <= 1} onClick={() => setPage(meta.page - 1)}>Prev</button>
              <span>Page {meta.page} of {meta.totalPages}</span>
              <button disabled={meta.page >= meta.totalPages} onClick={() => setPage(meta.page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
