import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface PriceDisplayProps {
  price: number;
  discountPrice?: number | null;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  discountPrice,
  currency = '₹',
  size = 'md',
  className,
}) => {
  const hasDiscount =
    discountPrice !== null && discountPrice !== undefined && discountPrice < price;

  const currentPrice = hasDiscount ? discountPrice : price;
  const originalPrice = hasDiscount ? price : null;

  const percentOff = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const fontSizes = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-bold',
  };

  const originalSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={twMerge(clsx('inline-flex items-baseline gap-2 flex-wrap', className))}>
      {/* Current dominant price */}
      <span className={clsx(fontSizes[size], 'text-slate-900 tracking-tight')}>
        {currency}
        {currentPrice.toLocaleString()}
      </span>

      {/* Secondary original strikethrough price */}
      {originalPrice && (
        <span className={clsx(originalSizes[size], 'text-slate-400 line-through font-normal')}>
          {currency}
          {originalPrice.toLocaleString()}
        </span>
      )}

      {/* Percentage badge */}
      {hasDiscount && percentOff > 0 && (
        <span className="inline-flex items-center text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
          {percentOff}% OFF
        </span>
      )}
    </div>
  );
};
