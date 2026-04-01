import { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function SignaturePad({ onSign, onClear }) {
  const sigRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const resize = () => {
      if (sigRef.current && containerRef.current) {
        const canvas = sigRef.current.getCanvas();
        const container = containerRef.current;
        const data = sigRef.current.toData();
        canvas.width = container.offsetWidth;
        canvas.height = 200;
        if (data.length > 0) {
          sigRef.current.fromData(data);
        }
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      onSign(sigRef.current.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    if (sigRef.current) {
      sigRef.current.clear();
      onClear();
    }
  };

  return (
    <div className="signature-wrapper">
      <label className="form-label">Signature <span className="required">*</span></label>
      <div className="signature-container" ref={containerRef}>
        <SignatureCanvas
          ref={sigRef}
          penColor="#1a1a2e"
          canvasProps={{ className: 'signature-canvas' }}
          onEnd={handleEnd}
        />
      </div>
      <div className="signature-actions">
        <button type="button" className="btn-clear" onClick={handleClear}>Clear Signature</button>
        <span className="signature-hint">Sign using your finger or mouse</span>
      </div>
    </div>
  );
}
