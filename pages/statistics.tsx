import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { NextPage } from 'next';
import React from 'react';

import { AgeOfHitchhikers } from '@/components/Statistics/AgeOfHitchhikers';
import { AverageWaitingTime } from '@/components/Statistics/AverageWaitingTime';
import { GenderStats } from '@/components/Statistics/GenderStats';
import { HallOfFame } from '@/components/Statistics/HallOfFame';

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
