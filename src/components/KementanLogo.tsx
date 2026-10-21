import React, { useState } from 'react';

interface KementanLogoProps {
  className?: string;
  size?: number;
}

export const KementanLogo: React.FC<KementanLogoProps> = ({ className = '', size = 150 }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {!hasError ? (
        <img
          src="/logo_kementan.svg"
          alt="Logo Kementerian Pertanian Republik Indonesia"
          className="w-full h-full object-contain drop-shadow-sm filter contrast-105"
          onError={() => setHasError(true)}
        />
      ) : (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Logo_Kementerian_Pertanian_Republik_Indonesia.svg"
          alt="Logo Kementerian Pertanian RI"
          className="w-full h-full object-contain drop-shadow-sm"
        />
      )}
    </div>
  );
};
