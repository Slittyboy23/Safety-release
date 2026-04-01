import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ThankYou() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const lang = params.get('lang') || 'en';
  const isEs = lang === 'es';

  return (
    <div className="form-page">
      <div className="thankyou-container">
        <img src="/apollo-logo.png" alt="Apollo Towing" className="thankyou-logo" />
        <div className="thankyou-icon">&#10003;</div>
        <h1>{isEs ? 'Exención Enviada' : 'Waiver Submitted'}</h1>
        <p>{isEs ? 'Gracias por completar la exención de responsabilidad. Su formulario ha sido registrado.' : 'Thank you for completing the liability waiver. Your form has been recorded.'}</p>
        <p className="thankyou-sub">{isEs ? 'Ahora puede participar en las actividades de casa de brinco.' : 'You may now participate in bounce house activities.'}</p>
        <button className="btn-submit" onClick={() => navigate('/')}>
          {isEs ? 'Enviar Otra Exención' : 'Submit Another Waiver'}
        </button>
      </div>
    </div>
  );
}
