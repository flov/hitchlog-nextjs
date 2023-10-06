import React, { FC, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

import { labelValuePieChartData } from '@/config';
import { genderStats } from '@/db/statistics';
import { LabelValue } from '@/types/Statistics';

export const GenderStats: FC = () => {
  const [genderStatsData, setGenderStatsData] = useState<LabelValue[]>();

  useEffect(() => {
    const fetchGenderStats = async () => {
      const genderStatsRes = await genderStats();
      setGenderStatsData(genderStatsRes.data);
    };
    fetchGenderStats();
  }, []);

  if (!genderStatsData) return null;

  return (
    <div>
      <h3 className="my-4 text-center">Hitchhikers by gender</h3>
      <Pie data={labelValuePieChartData(genderStatsData)} />
    </div>
  );
};
