import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignaturePad from '../components/SignaturePad';

const emptyParticipant = { name: '', dob: '', activityDate: '' };

const t = {
  en: {
    title: 'WAIVER OF LIABILITY, RELEASE AND CONSENT',
    subtitle: 'FOR BOUNCE HOUSE ACTIVITIES',
    notice: 'This form must be completed and returned before any adult or child can participate in any bounce house activities.',
    participants: 'Participants',
    participantName: 'Name of Participant',
    dob: 'Date of Birth',
    activityDate: 'Date of Activity',
    namePlaceholder: 'Full name (please print)',
    addParticipant: '+ Add Another Participant',
    waiverTitle: 'WAIVER, RELEASE AND CONSENT',
    waiverP1: (input) => (
      <>In exchange for allowing us to participate in bounce house activities on the premises, I, for myself, my children, and any participants listed above, hereby waive, release and discharge <strong>Apollo Towing, LLC</strong> and {input} from any and all claims for damages for personal injury, death or property damage which may result to me, my children, or any participant listed above, as a result of or arising from any bounce house activities or participation in such activities on the premises.</>
    ),
    waiverP2: 'It is understood that these bounce house activities involve an element of risk and danger of accidents and injuries, and knowing those risks I hereby assume those risks on behalf of myself, my children, and any participant listed above. Adult supervision of participants by me is required at all times.',
    acknowledgment: 'I HAVE CAREFULLY READ THIS WAIVER OF LIABILITY, RELEASE AND CONSENT (WAIVER) FOR BOUNCE HOUSE ACTIVITIES AND FULLY UNDERSTAND ITS CONTENTS. I SIGN THIS WAIVER VOLUNTARILY.',
    signerTitle: 'Parent / Guardian / Responsible Adult',
    fullName: 'Full Name',
    address: 'Address',
    phone: 'Phone',
    dateSigned: 'Date Signed',
    signerPlaceholder: 'Parent / Guardian / Responsible Adult',
    addressPlaceholder: 'Street address',
    submit: 'Submit Waiver',
    submitting: 'Submitting...',
    propertyPlaceholder: 'apartment complex, management company, facility',
    errParticipant: 'Please enter at least one participant name.',
    errParent: 'Parent/Guardian name is required.',
    errSignature: 'Please sign the form before submitting.',
    errNetwork: 'Network error. Please try again.',
    errGeneric: 'Submission failed. Please try again.',
  },
  es: {
    title: 'EXENCIÓN DE RESPONSABILIDAD, LIBERACIÓN Y CONSENTIMIENTO',
    subtitle: 'PARA ACTIVIDADES DE CASA DE BRINCO',
    notice: 'Este formulario debe completarse y devolverse antes de que cualquier adulto o niño pueda participar en cualquier actividad de casa de brinco.',
    participants: 'Participantes',
    participantName: 'Nombre del Participante',
    dob: 'Fecha de Nacimiento',
    activityDate: 'Fecha de Actividad',
    namePlaceholder: 'Nombre completo (en letra de molde)',
    addParticipant: '+ Agregar Otro Participante',
    waiverTitle: 'EXENCIÓN, LIBERACIÓN Y CONSENTIMIENTO',
    waiverP1: (input) => (
      <>A cambio de permitirnos participar en actividades de casa de brinco en las instalaciones, yo, por mí mismo/a, mis hijos y cualquier participante mencionado anteriormente, por la presente renuncio, libero y descargo a <strong>Apollo Towing, LLC</strong> y {input} de todos y cada uno de los reclamos por daños por lesiones personales, muerte o daños a la propiedad que puedan resultar a mí, mis hijos o cualquier participante mencionado anteriormente, como resultado de o derivado de cualquier actividad de casa de brinco o participación en dichas actividades en las instalaciones.</>
    ),
    waiverP2: 'Se entiende que estas actividades de casa de brinco involucran un elemento de riesgo y peligro de accidentes y lesiones, y conociendo esos riesgos, por la presente asumo esos riesgos en nombre de mí mismo/a, mis hijos y cualquier participante mencionado anteriormente. Se requiere la supervisión de un adulto de los participantes en todo momento.',
    acknowledgment: 'HE LEÍDO CUIDADOSAMENTE ESTA EXENCIÓN DE RESPONSABILIDAD, LIBERACIÓN Y CONSENTIMIENTO (EXENCIÓN) PARA ACTIVIDADES DE CASA DE BRINCO Y COMPRENDO COMPLETAMENTE SU CONTENIDO. FIRMO ESTA EXENCIÓN VOLUNTARIAMENTE.',
    signerTitle: 'Padre / Tutor / Adulto Responsable',
    fullName: 'Nombre Completo',
    address: 'Dirección',
    phone: 'Teléfono',
    dateSigned: 'Fecha de Firma',
    signerPlaceholder: 'Padre / Tutor / Adulto Responsable',
    addressPlaceholder: 'Dirección',
    submit: 'Enviar Exención',
    submitting: 'Enviando...',
    propertyPlaceholder: 'complejo de apartamentos, compañía de administración, instalación',
    errParticipant: 'Por favor ingrese al menos un nombre de participante.',
    errParent: 'El nombre del padre/tutor es obligatorio.',
    errSignature: 'Por favor firme el formulario antes de enviarlo.',
    errNetwork: 'Error de red. Por favor intente de nuevo.',
    errGeneric: 'Error al enviar. Por favor intente de nuevo.',
  },
};

export default function ReleaseForm() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [participants, setParticipants] = useState([{ ...emptyParticipant }]);
  const [propertyName, setPropertyName] = useState('');
  const [parentName, setParentName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [signature, setSignature] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const txt = t[lang];
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
    if (validParticipants.length === 0) { setError(txt.errParticipant); return; }
    if (!parentName.trim()) { setError(txt.errParent); return; }
    if (!signature) { setError(txt.errSignature); return; }

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
          language: lang,
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/thank-you');
      } else {
        setError(data.error || txt.errGeneric);
      }
    } catch {
      setError(txt.errNetwork);
    } finally {
      setSubmitting(false);
    }
  };

  const propertyInput = (
    <input
      type="text"
      className="inline-input"
      placeholder={txt.propertyPlaceholder}
      value={propertyName}
      onChange={(e) => setPropertyName(e.target.value)}
    />
  );

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <img src="/apollo-logo.png" alt="Apollo Towing" className="form-logo" />
          <div className="lang-toggle">
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
            <button type="button" className={lang === 'es' ? 'active' : ''} onClick={() => setLang('es')}>Español</button>
          </div>
          <h1>{txt.title}</h1>
          <h2>{txt.subtitle}</h2>
          <p className="form-notice">{txt.notice}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Participants */}
          <div className="form-section">
            <h3>{txt.participants}</h3>
            {participants.map((p, i) => (
              <div key={i} className="participant-row">
                <div className="participant-fields">
                  <div className="field">
                    <label className="form-label">{txt.participantName} <span className="required">*</span></label>
                    <input
                      type="text"
                      placeholder={txt.namePlaceholder}
                      value={p.name}
                      onChange={(e) => updateParticipant(i, 'name', e.target.value)}
                    />
                  </div>
                  <div className="field field-sm">
                    <label className="form-label">{txt.dob}</label>
                    <input
                      type="date"
                      value={p.dob}
                      onChange={(e) => updateParticipant(i, 'dob', e.target.value)}
                    />
                  </div>
                  <div className="field field-sm">
                    <label className="form-label">{txt.activityDate}</label>
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
                {txt.addParticipant}
              </button>
            )}
          </div>

          {/* Waiver Text */}
          <div className="form-section waiver-section">
            <h3>{txt.waiverTitle}</h3>
            <div className="waiver-text">
              <p>{txt.waiverP1(propertyInput)}</p>
              <p>{txt.waiverP2}</p>
            </div>
            <div className="waiver-acknowledgment">
              <p><strong>{txt.acknowledgment}</strong></p>
            </div>
          </div>

          {/* Signer Info */}
          <div className="form-section">
            <h3>{txt.signerTitle}</h3>
            <div className="signer-fields">
              <div className="field">
                <label className="form-label">{txt.fullName} <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder={txt.signerPlaceholder}
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="form-label">{txt.address}</label>
                <input
                  type="text"
                  placeholder={txt.addressPlaceholder}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="field field-sm">
                <label className="form-label">{txt.phone}</label>
                <input
                  type="tel"
                  placeholder="(555) 555-5555"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="field field-sm">
                <label className="form-label">{txt.dateSigned}</label>
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
            {submitting ? txt.submitting : txt.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
