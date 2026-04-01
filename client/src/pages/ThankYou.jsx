import { useNavigate } from 'react-router-dom';

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="form-page">
      <div className="thankyou-container">
        <div className="thankyou-icon">&#10003;</div>
        <h1>Waiver Submitted</h1>
        <p>Thank you for completing the liability waiver. Your form has been recorded.</p>
        <p className="thankyou-sub">You may now participate in bounce house activities.</p>
        <button className="btn-submit" onClick={() => navigate('/')}>
          Submit Another Waiver
        </button>
      </div>
    </div>
  );
}
