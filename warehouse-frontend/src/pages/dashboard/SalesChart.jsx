import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 198 },
  { month: 'Mar', sales: 2000, orders: 180 },
  { month: 'Apr', sales: 2780, orders: 208 },
  { month: 'May', sales: 1890, orders: 145 },
  { month: 'Jun', sales: 2390, orders: 178 },
  { month: 'Jul', sales: 3490, orders: 256 },
];

const SalesChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#1976d2"
          strokeWidth={2}
          name="Sales (VND x1000)"
        />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#dc004e"
          strokeWidth={2}
          name="Orders"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;