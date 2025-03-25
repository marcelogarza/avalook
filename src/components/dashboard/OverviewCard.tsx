import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColorClass: string;
  description?: string;
  isLoading?: boolean;
  imageUrl?: string;
}

const OverviewCard = ({
  title,
  value,
  icon: Icon,
  iconColorClass,
  description,
  isLoading = false,
  imageUrl,
}: OverviewCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
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
            <div className="text-3xl font-bold">{value}</div>
            {value === "N/A" ? (
              <p className="text-sm text-muted-foreground">Unavailable</p>
            ) : description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
