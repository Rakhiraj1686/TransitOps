import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../ui/Primitives';
import { formatCurrency } from '../../utils/formatters';

const MonthlyExpensesChart = ({ data = [] }) => (
  <Card className="p-5">
    <h3 className="font-display text-base font-semibold">Monthly Expenses</h3>
    <p className="text-xs text-muted">Tolls, fines, insurance &amp; other operational spend</p>
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2FA1A0" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#2FA1A0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: '1px solid #E4E7EC', fontSize: 12 }} />
          <Area type="monotone" dataKey="total" stroke="#2FA1A0" strokeWidth={2} fill="url(#expenseGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default MonthlyExpensesChart;
