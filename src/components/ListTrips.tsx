import { Table } from 'flowbite-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collectionData } from 'rxfire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { tripsRef } from '../db/trips';
import { secondsToTime } from '../utils/secondsToTime';

export const ListTrips = () => {
  const [trips, setTrips] = useState<DocumentData[]>();
  const trips$ = collectionData(tripsRef, { idField: 'id' });

  useEffect(() => {
    trips$.subscribe((trips) => {
      setTrips(trips);
    });
  }, []);

  console.log(trips);

  return (
    <>
      <h1 className="my-3 text-2xl">Trips</h1>

      <Table>
        <Table.Head>
          <Table.HeadCell>From</Table.HeadCell>
          <Table.HeadCell>To</Table.HeadCell>
          <Table.HeadCell>Gmaps Duration</Table.HeadCell>
          <Table.HeadCell>Country</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {trips?.map((trip) => (
            <Table.Row key={trip.key} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {trip.origin.city}
              </Table.Cell>
              <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {trip.destination.city}
              </Table.Cell>
              <Table.Cell>
                {secondsToTime(trip.googleDuration)}
              </Table.Cell>
              <Table.Cell>{trip.origin.country}</Table.Cell>
              <Table.Cell>
                <Link
                  href={`/trips/${trip.id}`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Show
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
