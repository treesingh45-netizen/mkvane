import React, { useState } from 'react';
import { Truck } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
  containerClassName?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackLabel,
  className = '',
  containerClassName = '',
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F5F6F7] border border-[#D9DDE1] text-[#555B61] p-6 text-center ${containerClassName || className}`}
        role="img"
        aria-label={alt}
      >
        <Truck className="w-8 h-8 text-[#858B91] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-[#555B61]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
