import { AgeForTrip, Top10 } from '../types/Statistics';

export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
};

const NAMED_COLORS = [
  CHART_COLORS.red,
  CHART_COLORS.orange,
  CHART_COLORS.yellow,
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.grey,
];

export const ageForTripsConfig = (ageForTrips: AgeForTrip[]) => {
  const options = {
    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Age',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Number of Trips',
          beginAtZero: true,
        },
      },
    },
  };

  const labels = ageForTrips.map((x) => x.age);
  const data = {
    labels,
    datasets: [
      {
        label: 'Average age of hitchhikers',
        fill: false,
        tension: 0.4,
        data: ageForTrips.map((x) => x.trips_count),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  return { options, data };
};

export const top10Config = (top10: Top10[]) => {
  const labels = top10.map((x) => x.username);
  // lgba of a blue color
  // const backgroundColor = rbga(0, 0, 255, 0.5);
  //
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Hitchhiked kms',
        data: top10.map((x) => x.total_distance),
        backgroundColor: top10.map((x) =>
          x.gender === 'female' ? 'rgba(255, 99, 132)' : 'rgb(54, 162, 235)'
        ),
        borderColor: top10.map((x) =>
          x.gender === 'female'
            ? 'rgba(255, 99, 132, 0.2)'
            : 'rgb(54, 162, 235, 0.2)'
        ),
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: false,
        text: 'Hall of fame',
      },
    },
  };

  return { options, data };
};
