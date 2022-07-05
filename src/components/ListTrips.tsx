import { useEffect, useState } from 'react';
import { collectionData } from 'rxfire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { tripsRef } from '../db/trips';

export const ListTrips = () => {
  const [trips, setTrips] = useState<DocumentData[]>();
  const trips$ = collectionData(tripsRef, { idField: 'id' })

  useEffect(() => {
    trips$.subscribe((trips) => {
      // re-render on each change
      setTrips(trips);
    });
  }, []);

  console.log(trips);

  return (
    <>
      <h1 className='my-3 text-2xl'>Trips</h1>
      <ul className='mb-6'>
        {trips?.map((t) => (
          <li key={t.id}>
            from: {t?.origin.city} to: {t?.destination.city}
          </li>
        ))}
      </ul>
    </>
  );
};
