import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../ui/Primitives';

const COLORS = {
  Available: '#10B981',
  'On Trip': '#FF6A3D',
  'In Shop': '#F59E0B',
  Retired: '#9CA3AF',
};

const VehicleStatusChart = ({ data = [] }) => (
  <Card className="p-5">
    <h3 className="font-display text-base font-semibold">Vehicle Status</h3>
    <p className="text-xs text-muted">Live distribution across the fleet</p>
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="status" innerRadius={55} outerRadius={85} paddingAngle={3}>
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.status] || '#94A3B8'} stroke="none" />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E4E7EC', fontSize: 12 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default VehicleStatusChart;
