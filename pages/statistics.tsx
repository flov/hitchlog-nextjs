import React, { MouseEventHandler, useEffect, useRef } from 'react';
import {
  ArcElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Pie, Bar, getElementAtEvent, Line } from 'react-chartjs-2';
import { GetServerSideProps, NextPage } from 'next';
import {
  getAgeForTrips,
  getTop10,
  genderStats,
  waitingTimeStats,
} from '../src/db/statistics';
import { AgeForTrip, LabelValue, Top10 } from '../src/types/Statistics';
import {
  ageForTripsChart,
  labelValuePieChartData,
  top10Chart,
} from '../src/config/statistics';
import { useRouter } from 'next/router';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

export const getServerSideProps: GetServerSideProps = async () => {
  const ageRes = await getAgeForTrips();
  const top10Res = await getTop10();
  const genderStatsRes = await genderStats();
  const waitingTimeStatsRes = await waitingTimeStats();

  return {
    props: {
      ageForTrips: ageRes.data,
      top10: top10Res.data,
      genderStats: genderStatsRes.data,
      waitingTimeStats: waitingTimeStatsRes.data,
    },
  };
};

const Statistics: NextPage<{
  genderStats: LabelValue[];
  waitingTimeStats: LabelValue[];
  ageForTrips: AgeForTrip[];
  top10: Top10[];
}> = ({ ageForTrips, top10, genderStats, waitingTimeStats }) => {
  const ageC = ageForTripsChart(ageForTrips);
  const top10C = top10Chart(top10);
  const router = useRouter();

  const chartRef = useRef();
  // taken from https://react-chartjs-2.js.org/docs/working-with-events/
  const onClick = (event: any) => {
    // @ts-ignore
    const elementAtEvent = getElementAtEvent(chartRef.current, event);
    if (elementAtEvent.length > 0) {
      const index = elementAtEvent[0].index;
      router.push(`/hitchhikers/${top10[index].username}`);
      console.log(top10[index]);
    }
  };

  return (
    <section className="mx-auto bg-white dark:bg-gray-900 max-w-screen-md">
      <h1 className="my-4 text-4xl font-bold text-center">
        Age of hitchhikers
      </h1>
      <Line options={ageC.options} data={ageC.data} />
      <h1 className="my-4 text-4xl font-bold text-center">Hall of fame</h1>
      <Bar
        options={top10C.options}
        ref={chartRef}
        onClick={onClick}
        data={top10C.data}
      />
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <div>
          <h3 className="my-4 text-center">Hitchhikers by gender</h3>
          <Pie data={labelValuePieChartData(genderStats)} />
        </div>
        <div>
          <h3 className="my-4 text-center">Average Waiting Time in percent</h3>
          <Pie data={labelValuePieChartData(waitingTimeStats)} />
        </div>
      </div>
    </section>
  );
};

export default Statistics;
