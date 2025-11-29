import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode; // Emoji veya SVG
    trend?: string; // Örn: "+12%"
    trendDirection?: 'up' | 'down' | 'neutral'; // Rengi belirlemek için
}

const StatCard = ({ title, value, icon, trend, trendDirection = 'neutral' }: StatCardProps) => {

    // Trend rengini belirle
    const trendColor = {
        up: 'text-green-600 bg-green-50',
        down: 'text-red-600 bg-red-50',
        neutral: 'text-stone-500 bg-stone-100'
    }[trendDirection];

    return (
        <div className="bg-white p-6 rounded-lg border border-amber-200/60 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-stone-500 text-sm font-medium mb-1 font-sans">{title}</p>
                <h3 className="text-3xl font-bold text-amber-950 font-serif">{value}</h3>

                {trend && (
                    <span className={`text-xs font-bold mt-2 inline-block px-2 py-0.5 rounded ${trendColor}`}>
                        {trend}
                    </span>
                )}
            </div>

            <div className="p-3 bg-stone-50 rounded-lg text-2xl border border-stone-100 text-stone-600">
                {icon}
            </div>
        </div>
    );
};

export default StatCard;