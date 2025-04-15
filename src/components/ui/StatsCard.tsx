interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
  }
  
  export function StatsCard({ title, value, subtitle }: StatsCardProps) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-amber-700">{value}</p>
        {subtitle && (
          <p className="text-gray-600 mt-2">{subtitle}</p>
        )}
      </div>
    );
  }