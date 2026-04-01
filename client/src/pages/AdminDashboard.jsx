import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const WAIVER_TEXT = {
  en: {
    title: 'WAIVER OF LIABILITY, RELEASE AND CONSENT',
    subtitle: 'FOR BOUNCE HOUSE ACTIVITIES',
    notice: 'This form must be completed and returned before any adult or child can participate in any bounce house activities.',
    waiverTitle: 'WAIVER, RELEASE AND CONSENT',
    waiverP1Start: 'In exchange for allowing us to participate in bounce house activities on the premises, I, for myself, my children, and any participants listed above, hereby waive, release and discharge ',
    company: 'Apollo Towing, LLC',
    waiverP1Mid: ' and ',
    waiverP1End: ' from any and all claims for damages for personal injury, death or property damage which may result to me, my children, or any participant listed above, as a result of or arising from any bounce house activities or participation in such activities on the premises.',
    waiverP2: 'It is understood that these bounce house activities involve an element of risk and danger of accidents and injuries, and knowing those risks I hereby assume those risks on behalf of myself, my children, and any participant listed above. Adult supervision of participants by me is required at all times.',
    acknowledgment: 'I HAVE CAREFULLY READ THIS WAIVER OF LIABILITY, RELEASE AND CONSENT (WAIVER) FOR BOUNCE HOUSE ACTIVITIES AND FULLY UNDERSTAND ITS CONTENTS. I SIGN THIS WAIVER VOLUNTARILY.',
    participantName: 'Name of Participant',
    dob: 'Date of Birth',
    activityDate: 'Date of Activity',
    signerTitle: 'Parent / Guardian / Responsible Adult',
    address: 'Address',
    phone: 'Phone',
    dateSigned: 'Date Signed',
    signature: 'Signature',
  },
  es: {
    title: 'EXENCIÓN DE RESPONSABILIDAD, LIBERACIÓN Y CONSENTIMIENTO',
    subtitle: 'PARA ACTIVIDADES DE CASA DE BRINCO',
    notice: 'Este formulario debe completarse y devolverse antes de que cualquier adulto o niño pueda participar en cualquier actividad de casa de brinco.',
    waiverTitle: 'EXENCIÓN, LIBERACIÓN Y CONSENTIMIENTO',
    waiverP1Start: 'A cambio de permitirnos participar en actividades de casa de brinco en las instalaciones, yo, por mí mismo/a, mis hijos y cualquier participante mencionado anteriormente, por la presente renuncio, libero y descargo a ',
    company: 'Apollo Towing, LLC',
    waiverP1Mid: ' y ',
    waiverP1End: ' de todos y cada uno de los reclamos por daños por lesiones personales, muerte o daños a la propiedad que puedan resultar a mí, mis hijos o cualquier participante mencionado anteriormente, como resultado de o derivado de cualquier actividad de casa de brinco o participación en dichas actividades en las instalaciones.',
    waiverP2: 'Se entiende que estas actividades de casa de brinco involucran un elemento de riesgo y peligro de accidentes y lesiones, y conociendo esos riesgos, por la presente asumo esos riesgos en nombre de mí mismo/a, mis hijos y cualquier participante mencionado anteriormente. Se requiere la supervisión de un adulto de los participantes en todo momento.',
    acknowledgment: 'HE LEÍDO CUIDADOSAMENTE ESTA EXENCIÓN DE RESPONSABILIDAD, LIBERACIÓN Y CONSENTIMIENTO (EXENCIÓN) PARA ACTIVIDADES DE CASA DE BRINCO Y COMPRENDO COMPLETAMENTE SU CONTENIDO. FIRMO ESTA EXENCIÓN VOLUNTARIAMENTE.',
    participantName: 'Nombre del Participante',
    dob: 'Fecha de Nacimiento',
    activityDate: 'Fecha de Actividad',
    signerTitle: 'Padre / Tutor / Adulto Responsable',
    address: 'Dirección',
    phone: 'Teléfono',
    dateSigned: 'Fecha de Firma',
    signature: 'Firma',
  },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

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
    return new Date(d.replace(' ', 'T') + 'Z').toLocaleString('en-US', {
      month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago'
    });
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
      <head>
        <title>Waiver #${selected.id} - ${selected.parent_name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', Arial, sans-serif; color: #2c3e50; line-height: 1.6; padding: 40px; }
          .waiver-doc { max-width: 750px; margin: 0 auto; }
          .doc-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1a1a2e; padding-bottom: 20px; }
          .doc-logo { max-width: 240px; height: auto; margin-bottom: 16px; }
          .doc-header h1 { font-size: 18px; letter-spacing: 1px; margin-bottom: 4px; color: #1a1a2e; }
          .doc-header h2 { font-size: 14px; color: #666; margin-bottom: 8px; }
          .doc-header .notice { font-size: 12px; color: #888; font-style: italic; }
          .doc-section { margin-bottom: 24px; }
          .doc-section h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1a1a2e; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e2b714; }
          .participants-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          .participants-table th, .participants-table td { padding: 8px 12px; border: 1px solid #ddd; font-size: 13px; text-align: left; }
          .participants-table th { background: #f5f6fa; font-weight: 600; }
          .waiver-legal { font-size: 13px; line-height: 1.8; color: #333; }
          .waiver-legal p { margin-bottom: 12px; }
          .waiver-legal .ack { background: #fffbe6; padding: 12px; margin-top: 12px; font-size: 12px; line-height: 1.6; }
          .signer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; }
          .signer-grid .item { padding: 8px; background: #f8f9fc; border-radius: 4px; }
          .signer-grid .item strong { display: block; font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 2px; }
          .sig-block { margin-top: 20px; }
          .sig-block h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1a1a2e; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e2b714; }
          .sig-img { border: 1px solid #ddd; border-radius: 4px; padding: 8px; text-align: center; }
          .sig-img img { max-width: 400px; height: auto; }
          .doc-footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #ddd; text-align: center; font-size: 11px; color: #aaa; }
          @media print { body { padding: 20px; } .waiver-doc { max-width: 100%; } }
        </style>
      </head>
      <body>${content.innerHTML}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const renderWaiverDoc = (s) => {
    const lang = s.language || 'en';
    const w = WAIVER_TEXT[lang] || WAIVER_TEXT.en;
    const participants = Array.isArray(s.participants) ? s.participants : [];

    return (
      <div className="waiver-doc" ref={printRef}>
        <div className="doc-header">
          <img src="/apollo-logo.png" alt="Apollo Towing" className="doc-logo" />
          <h1>{w.title}</h1>
          <h2>{w.subtitle}</h2>
          <p className="notice">{w.notice}</p>
        </div>

        <div className="doc-section">
          <h3>{lang === 'es' ? 'Participantes' : 'Participants'}</h3>
          <table className="participants-table">
            <thead>
              <tr>
                <th>{w.participantName}</th>
                <th>{w.dob}</th>
                <th>{w.activityDate}</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>{p.dob || '-'}</td>
                  <td>{p.activityDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="doc-section">
          <h3>{w.waiverTitle}</h3>
          <div className="waiver-legal">
            <p>
              {w.waiverP1Start}
              <strong>{w.company}</strong>
              {w.waiverP1Mid}
              <strong><u>{s.property_name || '___________________'}</u></strong>
              {w.waiverP1End}
            </p>
            <p>{w.waiverP2}</p>
            <div className="ack">
              <strong>{w.acknowledgment}</strong>
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h3>{w.signerTitle}</h3>
          <div className="signer-grid">
            <div className="item"><strong>{lang === 'es' ? 'Nombre Completo' : 'Full Name'}</strong>{s.parent_name}</div>
            <div className="item"><strong>{w.address}</strong>{s.address || '-'}</div>
            <div className="item"><strong>{w.phone}</strong>{s.phone || '-'}</div>
            <div className="item"><strong>{w.dateSigned}</strong>{s.date_signed}</div>
          </div>
        </div>

        <div className="sig-block">
          <h3>{w.signature}</h3>
          <div className="sig-img">
            <img src={s.signature} alt="Signature" />
          </div>
        </div>

        <div className="doc-footer">
          Waiver #{s.id} &middot; Submitted {formatDate(s.created_at)} &middot; Language: {lang === 'es' ? 'Español' : 'English'}
        </div>
      </div>
    );
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
                  <th>Lang</th>
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
                    <td>{(s.language || 'en').toUpperCase()}</td>
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

      {/* Full Waiver Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal modal-waiver" onClick={(e) => e.stopPropagation()}>
            <div className="modal-actions">
              <button className="btn-pdf" onClick={handlePrint}>Download PDF</button>
              <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
            </div>
            {renderWaiverDoc(selected)}
          </div>
        </div>
      )}
    </div>
  );
}
