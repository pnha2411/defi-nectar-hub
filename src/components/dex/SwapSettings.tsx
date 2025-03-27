
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export interface SwapSettingsProps {
  slippage: number[];
  onSlippageChange: (value: number[]) => void;
  deadline: string;
  onDeadlineChange: (value: string) => void;
  className?: string;
}

export const SwapSettings: React.FC<SwapSettingsProps> = ({
  slippage,
  onSlippageChange,
  deadline,
  onDeadlineChange,
  className
}) => {
  return (
    <div className={`rounded-lg border p-4 space-y-4 ${className}`}>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="slippage">Slippage Tolerance</Label>
          <span className="text-sm font-medium">{slippage[0].toFixed(1)}%</span>
        </div>
        <Slider
          id="slippage"
          min={0.1}
          max={5}
          step={0.1}
          value={slippage}
          onValueChange={onSlippageChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deadline">Transaction Deadline</Label>
        <div className="flex space-x-2">
          <Input
            id="deadline"
            value={deadline}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                onDeadlineChange(e.target.value);
              }
            }}
            className="w-20"
          />
          <span className="text-sm flex items-center">minutes</span>
        </div>
      </div>
    </div>
  );
};
