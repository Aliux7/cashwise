import { MultiDataSet } from "../components/LineChart";

export type DataType = {
  label: string;
  date: string;
  value: number;
};

export const data: DataType[] = [
  { label: "Sat", date: "Saturday", value: 4500000 },
  { label: "Sun", date: "Sunday", value: 5000000 },
  { label: "Mon", date: "Monday", value: 3000000 },
  { label: "Tue", date: "Tuesday", value: 4000000 },
  { label: "Wed", date: "Wednesday", value: 3500000 },
  { label: "Thu", date: "Thursday", value: 3200000 },
  { label: "Fri", date: "Friday", value: 3350000 },
];

export const lineChartData = [
  {
    label: "Revenue",
    color: "#3b82f6",
    data: [
      { label: "Sat", date: "Saturday", value: 1500000 },
      { label: "Sun", date: "Sunday", value: 5000000 },
      { label: "Mon", date: "Monday", value: 3000000 },
      { label: "Tue", date: "Tuesday", value: 4000000 },
      { label: "Wed", date: "Wednesday", value: 3500000 },
      { label: "Thu", date: "Thursday", value: 3200000 },
      { label: "Fri", date: "Friday", value: 3350000 },
    ],
  },
  {
    label: "Expenses",
    color: "#22c55e",
    data: [
      { label: "Sat", date: "Saturday", value: 2000000 },
      { label: "Sun", date: "Sunday", value: 2800000 },
      { label: "Mon", date: "Monday", value: 3200000 },
      { label: "Tue", date: "Tuesday", value: 2300000 },
      { label: "Wed", date: "Wednesday", value: 3250000 },
      { label: "Thu", date: "Thursday", value: 1500000 },
      { label: "Fri", date: "Friday", value: 1700000 },
    ],
  },
  {
    label: "Expenses",
    color: "#ef4444",
    data: [
      { label: "Sat", date: "Saturday", value: 1000000 },
      { label: "Sun", date: "Sunday", value: 1800000 },
      { label: "Mon", date: "Monday", value: 1200000 },
      { label: "Tue", date: "Tuesday", value: 1300000 },
      { label: "Wed", date: "Wednesday", value: 1250000 },
      { label: "Thu", date: "Thursday", value: 1500000 },
      { label: "Fri", date: "Friday", value: 1700000 },
    ],
  },
];

export default {
  data,
  lineChartData,
};
