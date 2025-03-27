
import React from 'react';

export interface PriceInfoProps {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  feePercentage?: number;
  isPoolCreation?: boolean;
  className?: string;
}

export const PriceInfo: React.FC<PriceInfoProps> = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  feePercentage = 0.3,
  isPoolCreation = false,
  className
}) => {
  const exchangeRate = parseFloat(fromAmount) > 0 
    ? (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)
    : '0';
  
  const inverseRate = parseFloat(toAmount) > 0
    ? (parseFloat(fromAmount) / parseFloat(toAmount)).toFixed(6)
    : '0';

  const estimatedFees = isPoolCreation && parseFloat(fromAmount) > 0 && parseFloat(toAmount) > 0
    ? `As the first liquidity provider, you are setting the initial price of this pool. Your initial ${feePercentage}% fee earnings will accrue once trading begins.`
    : `Estimated fees: ~$${((parseFloat(fromAmount) * parseFloat(exchangeRate) * (feePercentage / 100)) / 365).toFixed(2)} per day at current volume`;

  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      <div className="text-center mb-1">
        1 {fromToken} ≈ {exchangeRate} {toToken}
      </div>
      <div className="text-center mb-2">
        1 {toToken} ≈ {inverseRate} {fromToken}
      </div>
      {(parseFloat(fromAmount) > 0 && parseFloat(toAmount) > 0) && (
        <div className="text-xs mt-1 text-center">
          {estimatedFees}
        </div>
      )}
    </div>
  );
};
