import React from 'react';
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
import { NextPage } from 'next';
import { AgeOfHitchhikers } from '@/components/Statistics/AgeOfHitchhikers';
import { HallOfFame } from '@/components/Statistics/HallOfFame';
import { GenderStats } from '@/components/Statistics/GenderStats';
import { AverageWaitingTime } from '@/components/Statistics/AverageWaitingTime';

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

const Statistics: NextPage<{}> = () => {
  return (
    <section className="mx-auto bg-white dark:bg-gray-900 max-w-screen-md">
      <AgeOfHitchhikers />
      <HallOfFame />
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <GenderStats />
        <AverageWaitingTime />
      </div>
    </section>
  );
};

export default Statistics;
