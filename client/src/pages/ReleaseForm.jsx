import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignaturePad from '../components/SignaturePad';

const emptyParticipant = { name: '', dob: '', activityDate: '' };

export default function ReleaseForm() {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([{ ...emptyParticipant }]);
  const [propertyName, setPropertyName] = useState('');
  const [parentName, setParentName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [signature, setSignature] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  const updateParticipant = (index, field, value) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const addParticipant = () => {
    if (participants.length < 10) {
      setParticipants([...participants, { ...emptyParticipant }]);
    }
  };

  const removeParticipant = (index) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validParticipants = participants.filter(p => p.name.trim());
    if (validParticipants.length === 0) {
      setError('Please enter at least one participant name.');
      return;
    }
    if (!parentName.trim()) {
      setError('Parent/Guardian name is required.');
      return;
    }
    if (!signature) {
      setError('Please sign the form before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participants: JSON.stringify(validParticipants),
          property_name: propertyName,
          parent_name: parentName,
          address,
          phone,
          signature,
          date_signed: today,
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/thank-you');
      } else {
        setError(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>WAIVER OF LIABILITY, RELEASE AND CONSENT</h1>
          <h2>FOR BOUNCE HOUSE ACTIVITIES</h2>
          <p className="form-notice">This form must be completed and returned before any adult or child can participate in any bounce house activities.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Participants */}
          <div className="form-section">
            <h3>Participants</h3>
            {participants.map((p, i) => (
              <div key={i} className="participant-row">
                <div className="participant-fields">
                  <div className="field">
                    <label className="form-label">Name of Participant <span className="required">*</span></label>
                    <input
                      type="text"
                      placeholder="Full name (please print)"
                      value={p.name}
                      onChange={(e) => updateParticipant(i, 'name', e.target.value)}
                    />
                  </div>
                  <div className="field field-sm">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      value={p.dob}
                      onChange={(e) => updateParticipant(i, 'dob', e.target.value)}
                    />
                  </div>
                  <div className="field field-sm">
                    <label className="form-label">Date of Activity</label>
                    <input
                      type="date"
                      value={p.activityDate}
                      onChange={(e) => updateParticipant(i, 'activityDate', e.target.value)}
                    />
                  </div>
                </div>
                {participants.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => removeParticipant(i)} title="Remove participant">
                    &times;
                  </button>
                )}
              </div>
            ))}
            {participants.length < 10 && (
              <button type="button" className="btn-add" onClick={addParticipant}>
                + Add Another Participant
              </button>
            )}
          </div>

          {/* Waiver Text */}
          <div className="form-section waiver-section">
            <h3>WAIVER, RELEASE AND CONSENT</h3>
            <div className="waiver-text">
              <p>
                In exchange for allowing us to participate in bounce house activities on the premises, I, for myself, my children, and any participants listed above, hereby waive, release and discharge <strong>Apollo Towing, LLC</strong> and{' '}
                <input
                  type="text"
                  className="inline-input"
                  placeholder="apartment complex, management company, facility"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                />{' '}
                from any and all claims for damages for personal injury, death or property damage which may result to me, my children, or any participant listed above, as a result of or arising from any bounce house activities or participation in such activities on the premises.
              </p>
              <p>
                It is understood that these bounce house activities involve an element of risk and danger of accidents and injuries, and knowing those risks I hereby assume those risks on behalf of myself, my children, and any participant listed above. Adult supervision of participants by me is required at all times.
              </p>
            </div>
            <div className="waiver-acknowledgment">
              <p>
                <strong>I HAVE CAREFULLY READ THIS WAIVER OF LIABILITY, RELEASE AND CONSENT (WAIVER) FOR BOUNCE HOUSE ACTIVITIES AND FULLY UNDERSTAND ITS CONTENTS. I SIGN THIS WAIVER VOLUNTARILY.</strong>
              </p>
            </div>
          </div>

          {/* Signer Info */}
          <div className="form-section">
            <h3>Parent / Guardian / Responsible Adult</h3>
            <div className="signer-fields">
              <div className="field">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Parent / Guardian / Responsible Adult"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="field field-sm">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  placeholder="(555) 555-5555"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="field field-sm">
                <label className="form-label">Date Signed</label>
                <input type="text" value={today} readOnly className="readonly" />
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="form-section">
            <SignaturePad
              onSign={setSignature}
              onClear={() => setSignature('')}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Waiver'}
          </button>
        </form>
      </div>
    </div>
  );
}
