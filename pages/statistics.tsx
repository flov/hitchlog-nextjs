import React, { MouseEventHandler, useEffect, useRef } from 'react';
import {
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
import { Bar, getElementAtEvent, Line } from 'react-chartjs-2';
import { GetServerSideProps, NextPage } from 'next';
import { getAgeForTrips, getTop10 } from '../src/db/statistics';
import { AgeForTrip, Top10 } from '../src/types/Statistics';
import { ageForTripsConfig, top10Config } from '../src/config/statistics';
import { useRouter } from 'next/router';

ChartJS.register(
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

  return {
    props: { ageForTrips: ageRes.data, top10: top10Res.data },
  };
};

const Statistics: NextPage<{ ageForTrips: AgeForTrip[]; top10: Top10[] }> = ({
  ageForTrips,
  top10,
}) => {
  const ageC = ageForTripsConfig(ageForTrips);
  const top10C = top10Config(top10);
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
    </section>
  );
};

export default Statistics;
