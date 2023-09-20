import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { top10Chart } from '@/config';
import { getTop10 } from '@/db/statistics';
import { Top10 } from '@/types/Statistics';
import { useRouter } from 'next/router';

export const HallOfFame = () => {
  const router = useRouter();
  const chartRef = useRef();

  const [top10, setTop10] = useState<Top10[]>();

  useEffect(() => {
    const fetchTop10 = async () => {
      const top10Res = await getTop10();
      setTop10(top10Res.data);
    };
    fetchTop10();
  }, []);

  if (!top10) return null;

  const top10C = top10Chart(top10);

  // taken from https://react-chartjs-2.js.org/docs/working-with-events/
  const onClick = (event: any) => {
    // @ts-ignore
    const elementAtEvent = getElementAtEvent(chartRef.current, event);
    if (elementAtEvent.length > 0) {
      const index = elementAtEvent[0].index;
      router.push(`/hitchhikers/${top10[index].username}`);
    }
  };

  return (
    <>
      <h1 className="my-4 text-4xl font-bold text-center">Hall of fame</h1>
      <Bar
        options={top10C.options}
        ref={chartRef}
        onClick={onClick}
        data={top10C.data}
      />
    </>
  );
};
