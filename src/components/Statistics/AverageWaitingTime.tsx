import React, { FC, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { labelValuePieChartData } from '@/config/statistics';
import { LabelValue } from '@/types/Statistics';
import { waitingTimeStats } from '@/db/statistics';

export const AverageWaitingTime: FC = () => {
  const [waitingTimeStatsData, setWaitingTimeStatsData] = useState<LabelValue[]>();

  useEffect(() => {
    const fetchWaitingTimeStats = async () => {
      const waitingTimeStatsRes = await waitingTimeStats();
      setWaitingTimeStatsData(waitingTimeStatsRes.data);
    };
    fetchWaitingTimeStats();
  }, []);

  if (!waitingTimeStatsData) return null;

  return (
    <div>
      <h3 className="my-4 text-center">Average Waiting Time in percent</h3>
      <Pie data={labelValuePieChartData(waitingTimeStatsData)} />
    </div>
  );
};
