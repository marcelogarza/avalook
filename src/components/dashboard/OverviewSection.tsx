import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ArrowDown,
  ArrowUp,
  Activity,
  Database,
  Users,
  Clock,
} from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
}

const OverviewCard = ({
  title = "Metric",
  value = "$0.00",
  change,
  icon = <Activity className="h-4 w-4" />,
}: OverviewCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={`mt-1 flex items-center text-xs ${change.isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {change.isPositive ? (
              <ArrowUp className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4" />
            )}
            {change.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface OverviewSectionProps {
  avaxPrice?: string;
  avaxChange?: {
    value: string;
    isPositive: boolean;
  };
  marketCap?: string;
  marketCapChange?: {
    value: string;
    isPositive: boolean;
  };
  tps?: string;
  activeValidators?: string;
}

const OverviewSection = ({
  avaxPrice = "$22.45",
  avaxChange = { value: "2.5% (24h)", isPositive: true },
  marketCap = "$8.2B",
  marketCapChange = { value: "1.8% (24h)", isPositive: true },
  tps = "4,521",
  activeValidators = "1,234",
}: OverviewSectionProps) => {
  return (
    <section className="w-full bg-slate-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Avalanche Network Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          title="AVAX Price"
          value={avaxPrice}
          change={avaxChange}
          icon={<Activity className="h-4 w-4" />}
        />
        <OverviewCard
          title="Market Cap"
          value={marketCap}
          change={marketCapChange}
          icon={<Database className="h-4 w-4" />}
        />
        <OverviewCard
          title="Transactions Per Second"
          value={tps}
          icon={<Clock className="h-4 w-4" />}
        />
        <OverviewCard
          title="Active Validators"
          value={activeValidators}
          icon={<Users className="h-4 w-4" />}
        />
      </div>
    </section>
  );
};

export default OverviewSection;
