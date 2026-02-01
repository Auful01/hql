'use client';

import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend
);

type ChartPart =
  | { type: 'chart'; chartType: 'bar' | 'line' | 'pie' | 'table'; data: {
      labels?: (string | number)[];
      values?: number[];
      headers?: string[];
      rows?: (string | number)[][];
    } }
  | any;

type Message = {
  content?: {
    role?: string;
    content?: ChartPart[];
  };
  message_id?: string | number;
};

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const baseOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' as const },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const v = ctx.parsed?.y ?? ctx.parsed;
          return typeof v === 'number' ? rupiah(v) : v;
        },
      },
    },
  },
  scales: {
    y: {
      ticks: { callback: (v: number) => rupiah(Number(v)) },
      grid: { display: true },
    },
    x: { grid: { display: false } },
  },
};

function datasetFrom(labels: (string | number)[] = [], values: number[] = []) {
  return {
    labels,
    datasets: [{
      label: 'Value',
      data: values,
      backgroundColor: 'rgba(59,130,246,0.5)', // blue-500
      borderColor: 'rgba(59,130,246,1)',
      borderWidth: 1,
      pointRadius: 3,
    }],
  };
}

/**
 * HANYA render objek di message.content.content[2]
 */
export default function ChartFromMessageIndex({ message }: { message: Message }) {
  const part = message?.content?.content?.[2] as ChartPart | undefined;

  if (!part || part.type !== 'chart') {
    return <div className="text-sm text-gray-400">No chart at index 2.</div>;
  }

  const { chartType, data } = part;
  const height = 340;

  if (chartType === 'table') {
    const headers = Array.isArray(data?.headers) ? data!.headers! : [];
    const rows = Array.isArray(data?.rows) ? data!.rows! : [];
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-800">
              {headers.map((h, i) => (
                <th key={i} className="text-left px-3 py-2 border-b border-gray-700">{String(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="odd:bg-gray-900 even:bg-gray-800">
                {r.map((c, ci) => (
                  <td key={ci} className="px-3 py-2 border-t border-gray-800">
                    {typeof c === 'number' ? rupiah(c) : String(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const labels = Array.isArray(data?.labels) ? data!.labels! : [];
  const values = Array.isArray(data?.values) ? data!.values! : [];
  const ds = datasetFrom(labels, values);

  if (chartType === 'bar')  return <div style={{ height }}><Bar  data={ds} options={baseOptions} /></div>;
  if (chartType === 'line') return <div style={{ height }}><Line data={ds} options={baseOptions} /></div>;
  if (chartType === 'pie')  return (
    <div style={{ height }}>
      <Pie
        data={{
          labels,
          datasets: [{
            data: values,
            backgroundColor: ['#60a5fa','#34d399','#fbbf24','#f87171','#a78bfa','#f472b6','#4ade80'],
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' as const },
            tooltip: { callbacks: { label: (ctx: any) => typeof ctx.parsed === 'number' ? rupiah(ctx.parsed) : ctx.parsed } },
          },
        }}
      />
    </div>
  );

  return <div className="text-sm text-gray-400">Unsupported chart type.</div>;
}