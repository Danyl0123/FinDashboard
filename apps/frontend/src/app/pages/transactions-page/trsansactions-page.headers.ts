export const transactionstableHeaders = [
  { name: '#', key: 'id' },
  { name: 'Title', key: 'title' },
  { name: 'Type', key: 'type' },
  { name: 'Amount', key: 'amount' },
  { name: 'Created at', key: 'createdAt' },
];
export const chartOptions = {
  pieHole: 0.4,
  legend: {
    position: 'bottom',
    textStyle: {
      color: '#fff',
      fontSize: 14,
    },
  },
  pieSliceText: 'value',
  colors: [
    '#4285F4',
    '#EA4335',
    '#FBBC05',
    '#34A853',
    '#8c44a3',
    '#3c9dc2',
    '#d97b42',
  ],
  backgroundColor: 'transparent',
  tooltip: { showColorCode: true, text: 'percentage' },
  chartArea: {
    width: '80%',
    height: '80%',
  },
};
