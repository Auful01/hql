import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";



type Props = {
  data: any[];
};

const groupableFields = ["type", "date", "period"];

const DynamicTransactionChart: React.FC<Props> = ({ data }) => {
  const [groupBy, setGroupBy] = useState<string>("type");

  useEffect(() => {
    console.log("Data received for chart:", data);
    
  })
  const chartData = useMemo(() => {
    const grouped = data.reduce<Record<string, number>>((acc, curr) => {
      const key = curr[groupBy] || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([label, count]) => ({
      label,
      count,
    }));
  }, [data, groupBy]);

  return (
    <div className="w-full h-[400px] bg-white rounded p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transactions by {groupBy}</h2>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          className="px-3 py-2 border rounded text-sm text-gray-700"
        >
          {groupableFields.map((field) => (
            <option key={field} value={field}>
              Group by: {field}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicTransactionChart;