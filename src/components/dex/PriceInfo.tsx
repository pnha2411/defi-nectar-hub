
import React from 'react';

export interface PriceInfoProps {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  className?: string;
}

export const PriceInfo: React.FC<PriceInfoProps> = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  className
}) => {
  const exchangeRate = parseFloat(fromAmount) > 0 
    ? (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)
    : '0';

  return (
    <div className={`text-sm text-muted-foreground text-center ${className}`}>
      1 {fromToken} ≈ {exchangeRate} {toToken}
    </div>
  );
};
