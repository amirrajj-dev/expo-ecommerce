import { type ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: "primary" | "success" | "info" | "accent";
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const colorClasses = {
    primary: {
      bg: "from-primary/10 to-primary/5",
      border: "border-primary/20",
      iconBg: "bg-primary/20",
    },
    success: {
      bg: "from-success/10 to-success/5",
      border: "border-success/20",
      iconBg: "bg-success/20",
    },
    info: {
      bg: "from-info/10 to-info/5",
      border: "border-info/20",
      iconBg: "bg-info/20",
    },
    accent: {
      bg: "from-accent/10 to-accent/5",
      border: "border-accent/20",
      iconBg: "bg-accent/20",
    },
  };

  const currentColor = colorClasses[color];

  return (
    <div
      className={`bg-linear-to-br ${currentColor.bg} ${currentColor.border} border rounded-xl p-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-base-content/70">{title}</p>
          <p className="text-2xl font-bold text-base-content mt-1">{value}</p>
        </div>
        <div className={`p-3 ${currentColor.iconBg} rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;