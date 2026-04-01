import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, ...(search && { search }) });
      const res = await fetch(`/api/submissions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin');
        return;
      }
      const data = await res.json();
      setSubmissions(data.submissions);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      // network error
    } finally {
      setLoading(false);
    }
  }, [page, search, token, navigate]);

  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
    fetchSubmissions();
  }, [token, navigate, fetchSubmissions]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSubmissions();
  };

  const viewSubmission = async (id) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.participants && typeof data.participants === 'string') {
        try { data.participants = JSON.parse(data.participants); } catch { /* keep as string */ }
      }
      setSelected(data);
    } catch { /* */ }
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d.replace(' ', 'T')).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Waiver Submissions</h1>
        <div className="admin-header-right">
          <span className="submission-count">{total} total</span>
          <button className="btn-logout" onClick={logout}>Log Out</button>
        </div>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name, phone, or property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-search">Search</button>
      </form>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="empty">No submissions found.</div>
      ) : (
        <>
          <div className="submissions-table-wrapper">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Parent / Guardian</th>
                  <th>Phone</th>
                  <th>Property</th>
                  <th>Date Signed</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td className="name-cell">{s.parent_name}</td>
                    <td>{s.phone || '-'}</td>
                    <td>{s.property_name || '-'}</td>
                    <td>{s.date_signed}</td>
                    <td>{formatDate(s.created_at)}</td>
                    <td><button className="btn-view" onClick={() => viewSubmission(s.id)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span>Page {page} of {pages}</span>
              <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
            <h2>Waiver #{selected.id}</h2>

            <div className="detail-section">
              <h4>Participants</h4>
              {Array.isArray(selected.participants) ? (
                <table className="detail-table">
                  <thead><tr><th>Name</th><th>DOB</th><th>Activity Date</th></tr></thead>
                  <tbody>
                    {selected.participants.map((p, i) => (
                      <tr key={i}>
                        <td>{p.name}</td>
                        <td>{p.dob || '-'}</td>
                        <td>{p.activityDate || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>{selected.participants}</p>
              )}
            </div>

            <div className="detail-grid">
              <div><strong>Parent/Guardian:</strong> {selected.parent_name}</div>
              <div><strong>Property:</strong> {selected.property_name || '-'}</div>
              <div><strong>Address:</strong> {selected.address || '-'}</div>
              <div><strong>Phone:</strong> {selected.phone || '-'}</div>
              <div><strong>Date Signed:</strong> {selected.date_signed}</div>
              <div><strong>Submitted:</strong> {formatDate(selected.created_at)}</div>
            </div>

            <div className="detail-section">
              <h4>Signature</h4>
              <div className="signature-display">
                <img src={selected.signature} alt="Signature" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
