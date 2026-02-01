import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";

type Props = {
  data: any[];
};

const DynamicTransactionChart: React.FC<Props> = ({ data }) => {
  const [xAxisField, setXAxisField] = useState<string>("type");
  const [yAxisField, setYAxisField] = useState<string>("count");

  const [chartType, setChartType] = useState<string>("bar");
  // Get all field names from data
  const fieldNames = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Determine groupable (X axis) and measurable (Y axis) fields
  const { groupableFields, measurableFields } = useMemo(() => {
    const groupables: string[] = [];
    const measurables: string[] = [];

    if (!data || data.length === 0) return { groupableFields: [], measurableFields: [] };

    const sample = data[0];
    for (const key of Object.keys(sample)) {
      const value = sample[key];
      if (typeof value === "number" || typeof parseInt(value) === "number" || typeof parseFloat(value) === "number") {
        measurables.push(key);
      }
      groupables.push(key);
    }

    return { groupableFields: groupables, measurableFields: measurables };
  }, [data]);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const isYAxisNumeric = yAxisField !== "count";

    const grouped = data.reduce<Record<string, number>>((acc, curr) => {
      const xKey = curr[xAxisField] ?? "Unknown";

      let value = 1;
      if (isYAxisNumeric) {
        const raw = curr[yAxisField];
        value = typeof raw === "number" ? raw : parseFloat(raw);
        if (isNaN(value)) value = 0;
      }

      acc[xKey] = (acc[xKey] || 0) + value;
      return acc;
    }, {});

    return Object.entries(grouped).map(([label, value]) => ({
      label,
      value,
    }));
  }, [data, xAxisField, yAxisField]);

  return (
    <div className="w-full h-[400px] rounded p-4">
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <h2 className="text-lg font-semibold">
          Transactions by {xAxisField} vs {yAxisField}
        </h2>
        
        <select
          className="px-3 py-2 border rounded text-sm text-gray-700"
          value={chartType}
          onChange={(e) =>
          {
            console.log("Chart type changed to:", e.target.value);
            setChartType(e.target.value);
          }
            }
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
        {/* X-Axis Dropdown */}
        <select
          value={xAxisField}
          onChange={(e) => setXAxisField(e.target.value)}
          className="px-3 py-2 border rounded text-sm text-gray-700"
        >
          {groupableFields.map((field) => (
            <option key={field} value={field}>
              Group by: {field}
            </option>
          ))}
        </select>

        {/* Y-Axis Dropdown */}
        <select
          value={yAxisField}
          onChange={(e) => setYAxisField(e.target.value)}
          className="px-3 py-2 border rounded text-sm text-gray-700"
        >
          <option value="count">Count</option>
          {measurableFields.map((field) => (
            <option key={field} value={field}>
              Sum of: {field}
            </option>
          ))}
        </select>

        {/* Table Type */}
       
      </div>


        
      {
        chartType === "bar" && 
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="label"
            angle={-45}                     // Rotasi label
            textAnchor="end"               // Supaya rata kanan
            interval={0}                   // Paksa tampil semua label
            height={60}                    // Tinggikan area X-axis agar tidak terpotong
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
      }
      {
        chartType === "line" && 
        
        <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis 
            dataKey="label"
            angle={-45}                     // Rotasi label
            textAnchor="end"               // Supaya rata kanan
            interval={0}                   // Paksa tampil semua label
            height={60}                    // Tinggikan area X-axis agar tidak terpotong
          />
          <YAxis/>
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
          {/* <Line type="monotone" dataKey="pv" stroke="#82ca9d" /> */}
        </LineChart>
      </ResponsiveContainer>
      }
      {
        chartType === "pie" && 
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      }
      

      
    </div>
  );
};

export default DynamicTransactionChart;