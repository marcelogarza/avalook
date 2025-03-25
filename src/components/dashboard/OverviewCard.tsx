import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColorClass: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
  isLoading?: boolean;
  imageUrl?: string;
}

const OverviewCard = ({
  title,
  value,
  icon: Icon,
  iconColorClass,
  change,
  description,
  isLoading = false,
  imageUrl,
}: OverviewCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-5 w-5 rounded-full" />
        ) : (
          <Icon className={`h-5 w-5 ${iconColorClass}`} />
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && change.value && change.value !== "N/A" && !change.value.includes("NaN") && (
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    change.isPositive ? "text-green-500" : "text-red-500"
                  }
                >
                  {change.isPositive ? "+" : "-"}
                  {change.value}
                </span>{" "}
                {description || "from last period"}
              </p>
            )}
            {(change && change.value === "N/A" && (
              <p className="text-xs text-muted-foreground">
                <span className="text-base-content/70">
                  {change.value}
                </span>{" "}
                {description || "from last period"}
              </p>
            ))}
            {!change && description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
