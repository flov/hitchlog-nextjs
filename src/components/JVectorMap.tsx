import React, { FC, useEffect, useState } from 'react';
import worldMill from '@react-jvectormap/world/worldMill.json';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { Geomap } from '../types';

// JVector for Map statistics (https://jvectormap.com/)
// dynamically import JVectorMap because it can only be rendered on the client
// https://github.com/kadoshms/react-jvectormap/issues/118
const VectorMap = dynamic(
  // @ts-ignore
  () => import('@react-jvectormap/core').then((m) => m.VectorMap),
  { ssr: false }
);

const JVectorMap: FC<{ geomap: Geomap }> = ({ geomap }) => {
  const { theme } = useTheme();

  if (!geomap || !Object.keys(geomap.distances).length) return null;

  return (
    <>
      <h2 className="mb-2 text-xl font-bold">Geomap of hitchhiking trips</h2>
      <div style={{ height: '20rem' }} className="w-full ">
        <VectorMap
          map={worldMill}
          regionStyle={{
            initial: {
              fill: theme === 'dark' ? '#FFF' : '#CCC',
              fillOpacity: 1,
              stroke: 'none',
              strokeOpacity: 1,
            },
            hover: {
              fill: theme === 'dark' ? '#3b82f6' : '#3b82f6',
              fillOpacity: 0.8,
              cursor: 'pointer',
            },
            selected: {
              fill: '#3b82f6', // color for the clicked country
            },
            selectedHover: {},
          }}
          backgroundColor={
            theme === 'dark' ? 'rgb(31 41 55)' : 'rgb(255 255 255)'
          }
          containerStyle={{
            width: '100%',
            height: '100%',
          }}
          onRegionTipShow={(event, label, code) => {
            if (geomap.distances[code]) {
              // @ts-ignore
              label.html(
                // @ts-ignore
                `<b>${label.html()}</b><br/>
                <b>Number of Trips: </b>${geomap.trip_count[code]}<br/>
                <b>Hitchhiked km: </b>${geomap.distances[code]}`
              );
            }
          }}
          series={{
            regions: [
              {
                values: geomap.distances,
                attribute: 'fill',
                // @ts-ignore
                scale: ['#C8EEFF', '#0071A4'],
                normalizeFunction: 'polynomial',
              },
            ],
          }}
          containerClassName="rounded"
        />
      </div>
    </>
  );
};

export default JVectorMap;
