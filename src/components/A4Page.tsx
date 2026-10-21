import React from 'react';

interface A4PageProps {
  pageNumber?: number;
  totalPages?: number;
  showPageNumber?: boolean;
  className?: string;
  paddingClassName?: string;
  children: React.ReactNode;
}

export const A4Page: React.FC<A4PageProps> = ({
  pageNumber,
  totalPages,
  showPageNumber = true,
  className = '',
  paddingClassName = 'pt-[25mm] pb-[25mm] px-[28mm]',
  children,
}) => {
  return (
    <div
      className={`a4-page-view font-sans-doc text-[#111827] flex flex-col justify-between relative ${paddingClassName} ${className}`}
      data-page-number={pageNumber}
    >
      {/* Page Content */}
      <div className="flex-1 flex flex-col w-full">{children}</div>

      {/* Page Number Footer (subtle in preview, hidden on cover) */}
      {showPageNumber && pageNumber !== undefined && (
        <div className="pt-2 text-right text-[11px] text-gray-500 font-sans tracking-wide select-none print:text-black">
          {pageNumber}
        </div>
      )}
    </div>
  );
};
