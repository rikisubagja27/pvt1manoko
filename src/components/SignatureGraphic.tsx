import React from 'react';

interface SignatureGraphicProps {
  className?: string;
  customSignatureUrl?: string;
  width?: number;
  height?: number;
}

export const SignatureGraphic: React.FC<SignatureGraphicProps> = ({
  className = '',
  customSignatureUrl,
  width = 170,
  height = 80,
}) => {
  if (customSignatureUrl) {
    return (
      <img
        src={customSignatureUrl}
        alt="Tanda Tangan"
        className={`object-contain ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 240 100"
        width={width}
        height={height}
        className="w-full h-full text-slate-900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Realistic handwritten fluid signature matching sample page 9 */}
        <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          {/* Main Initial 'R' and flourish */}
          <path d="M 24,72 C 26,45 32,25 36,18 C 38,15 42,16 46,24 C 52,36 48,50 36,54 C 48,52 64,50 68,58 C 72,66 70,74 74,78" />
          
          {/* Middle cursive letters 'iki Sub' */}
          <path d="M 40,38 C 50,30 65,34 76,42 C 86,50 92,40 102,44 C 112,48 116,56 128,46 C 136,38 144,36 150,48" strokeWidth="2.1" />
          
          {/* Tall strokes and loops */}
          <path d="M 88,24 L 92,62 M 110,22 L 112,65 M 134,16 L 138,66" strokeWidth="2.2" />
          <path d="M 90,44 C 98,38 106,39 108,52 M 112,46 C 120,40 128,42 130,55" strokeWidth="1.9" />

          {/* Suffix 'agja' loops and tail */}
          <path d="M 148,46 C 158,40 168,44 172,54 C 176,64 186,42 192,50 C 196,56 198,68 190,76 C 182,84 172,74 184,62" strokeWidth="2.2" />
          
          {/* Dynamic tail stroke reaching down */}
          <path d="M 194,54 C 204,46 216,52 222,64 L 216,84 C 212,94 200,90 206,78" strokeWidth="2.0" />
          
          {/* Bottom underline flourish */}
          <path d="M 28,74 C 75,70 140,68 202,74 C 218,75 228,77 232,75" strokeWidth="2.2" />
          <path d="M 45,78 C 88,75 145,74 195,78" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
};
