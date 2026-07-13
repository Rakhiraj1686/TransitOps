import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../ui/Primitives';

const MonthlyTripsChart = ({ data = [] }) => (
  <Card className="p-5">
    <h3 className="font-display text-base font-semibold">Monthly Trips</h3>
    <p className="text-xs text-muted">Dispatched &amp; completed trips per month</p>
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E4E7EC', fontSize: 12 }} cursor={{ fill: 'rgba(255,106,61,0.06)' }} />
          <Bar dataKey="count" fill="#FF6A3D" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default MonthlyTripsChart;
