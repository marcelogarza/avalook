import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Activity } from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  isLoading: boolean;
  tooltip?: string;
}

const OverviewCard = ({
  title = "Metric",
  value = "$0.00",
  change,
  icon = <Activity className="h-4 w-4" />,
  isLoading,
  tooltip,
}: OverviewCardProps) => {
  return (
    <Card className="bg-base-100 border border-base-300 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-3">
        <CardTitle className="text-xs font-medium text-base-content group relative">
          {title}
          {tooltip && (
            <span className="hidden group-hover:block absolute top-full left-0 z-10 bg-base-300 text-base-content p-2 rounded text-xs mt-1 max-w-[200px]">
              {tooltip}
            </span>
          )}
        </CardTitle>
        <div className="h-6 w-6 flex items-center justify-center rounded-full bg-base-200 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="py-2 px-3">
        {isLoading ? (
          <div className="h-6 w-1/2 animate-pulse bg-base-300 rounded"></div>
        ) : (
          <div className="text-xl font-bold text-base-content">{value}</div>
        )}
        {change && (
          <p
            className={`mt-1 text-xs ${
              change.isPositive ? "text-success" : "text-error"
            }`}
          >
            {change.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
