import React, { useState } from "react";
import { motion } from "framer-motion";

interface DayData {
  date: string;
  success: number;
  error: number;
}

interface HeatmapProps {
  data: DayData[];
}

const getColor = (success: number, error: number) => {
  const total = success + error;

  if (total === 0) return "bg-gray-800"; // No activity
  if (total === 1) return "bg-green-50"; // Very very light green
  if (total === 2) return "bg-green-100";
  if (total === 3) return "bg-green-200";
  if (total === 4) return "bg-green-300";
  if (total === 5) return "bg-green-400";
  if (total === 6) return "bg-green-500";
  if (total === 7) return "bg-green-600";
  if (total === 8) return "bg-green-700";
  if (total === 9) return "bg-green-800";
  if (total === 10) return "bg-green-900"; // Dark green at 10

  if (total <= 15) return "bg-lime-600"; // Lime transition
  if (total <= 20) return "bg-lime-500";
  if (total <= 30) return "bg-lime-400";
  if (total <= 40) return "bg-yellow-400"; // Transition to yellow
  if (total <= 50) return "bg-yellow-500";
  if (total <= 75) return "bg-orange-500"; // Orange: High activity
  if (total <= 100) return "bg-orange-600";
  if (total <= 150) return "bg-red-500"; // Red: Heavy usage
  if (total <= 200) return "bg-red-600";
  if (total <= 300) return "bg-red-700";
  if (total > 300) return "bg-red-900"; // Critical level

  return "bg-gray-800"; // Default fallback
};

const generateCalendar = (data: DayData[]) => {
  const fullYear: {
    [month: number]: {
      [week: number]: { [day: number]: { success: number; error: number } };
    };
  } = {};

  for (let month = 0; month < 12; month++) {
    fullYear[month] = {};
    const daysInMonth = new Date(2025, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2025, month, day);
      const week = Math.floor((day - 1 + date.getDay()) / 7); // ✅ correct alignment
      if (!fullYear[month][week]) fullYear[month][week] = {};
      fullYear[month][week][day] = { success: 0, error: 0 };
    }
  }

  // Merge user data into the structure
  data.forEach(({ date, success, error }) => {
    const [year, month, day] = date.split("-").map(Number);
    if (year === 2025) {
      const dateObj = new Date(2025, month - 1, day);
      const week = Math.floor((day - 1 + dateObj.getDay()) / 7); // ✅ same fix here
      fullYear[month - 1][week][day] = { success, error };
    }
  });

  return fullYear;
};

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const calendar = generateCalendar(data);
  const [tooltip, setTooltip] = useState<{
    date: string;
    success: number;
    error: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="relative overflow-x-auto md:p-2 bg-gray-900 rounded-3xl w-full mt-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4">
        {Object.entries(calendar).map(([month, weeks], monthIndex) => (
          <div key={monthIndex} className="flex flex-col items-center">
            {/* Month Label */}
            <p className="text-xs text-gray-400 mb-1">
              {new Date(2025, parseInt(month), 1).toLocaleString("default", {
                month: "short",
              })}
            </p>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 relative">
              {Object.entries(weeks).map(([week, days]) =>
                Object.entries(days).map(([day, { success, error }]) => {
                  return (
                    <motion.div
                      key={`${month}-${week}-${day}`}
                      className={`h-4 w-4 md:w-2.5 md:h-2.5 ${getColor(success, error)} rounded-sm cursor-pointer relative`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const tooltipWidth = 80; // Estimated width
                        const tooltipHeight = 50; // Estimated height
                        const isNearBottom =
                          rect.bottom + tooltipHeight + 10 > window.innerHeight;
                        const isNearRight =
                          rect.left + tooltipWidth > window.innerWidth;

                        setTooltip({
                          date: `2025-${String(parseInt(month) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                          success,
                          error,
                          x: isNearRight
                            ? rect.left - tooltipWidth - 5
                            : rect.left + 10, // Adjust to avoid right edge
                          y: isNearBottom
                            ? rect.top - tooltipHeight - 5
                            : rect.top + 10, // Adjust to avoid bottom edge
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      whileHover={{ scale: 1.2 }}
                    />
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Tooltip */}
      {tooltip && (
        <div
          className="fixed bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-50 pointer-events-none transition-opacity duration-200"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(0, -100%)", // Moves above and slightly to the right
            zIndex: 50, // Ensures it's always on top
          }}
        >
          <p>{tooltip.date}</p>
          <p>✅ Success: {tooltip.success}</p>
          <p>❌ Errors: {tooltip.error}</p>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
