import React, { FC, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ageForTripsChart } from '../../config';
import { getAgeForTrips } from '../../db/statistics';
import { AgeForTrip } from '../../types/Statistics';

export const AgeOfHitchhikers: FC = () => {
  const [ageOfHitchhikers, setAgeOfHitchhikers] = useState<AgeForTrip[]>();

  useEffect(() => {
    const fetchAgeOfHitchhikers = async () => {
      const ageRes = await getAgeForTrips();
      setAgeOfHitchhikers(ageRes.data);
    };
    fetchAgeOfHitchhikers();
  }, []);

  if (!ageOfHitchhikers) return null;

  const ageChart = ageForTripsChart(ageOfHitchhikers);

  return (
    <>
      <h1 className="my-4 text-4xl font-bold text-center">
        Age of hitchhikers
      </h1>
      <Line options={ageChart.options} data={ageChart.data} />
    </>
  );
};
