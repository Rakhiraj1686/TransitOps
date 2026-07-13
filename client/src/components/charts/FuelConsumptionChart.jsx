import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card } from '../ui/Primitives';

const FuelConsumptionChart = ({ data = [] }) => (
  <Card className="p-5">
    <h3 className="font-display text-base font-semibold">Fuel Consumption</h3>
    <p className="text-xs text-muted">Liters consumed and cost per month</p>
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E4E7EC', fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="liters" name="Liters" stroke="#FF6A3D" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="cost" name="Cost (₹)" stroke="#12181F" strokeWidth={2} dot={false} strokeDasharray="4 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default FuelConsumptionChart;
