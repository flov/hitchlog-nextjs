import { Query } from 'firebase/firestore';
import { Pagination, Table } from 'flowbite-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { collectionData } from 'rxfire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { paginatedTripsRef, Trip } from '../db/trips';
import { secondsToTime } from '../utils/secondsToTime';

export const ListTrips: FC<{trips: Trip[]}> = ({trips}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const trips$ = collectionData(paginatedTripsRef, { idField: 'id' });

  const onPageChange = (page: number) => {
    if (!trips) return;
    if (page > currentPage) {
      console.log('next page', currentPage);
      setCurrentPage(page);
      // setPaginatedQuery(nextTripsRef(trips[trips.length - 1]));
    } else {
      setCurrentPage(page);
      console.log('previous page', currentPage);
    }
  };

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
            <Table.Row
              key={trip.id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {trip.origin?.city}
              </Table.Cell>
              <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {trip.destination?.city}
              </Table.Cell>
              <Table.Cell>{trip.googleDuration && secondsToTime(trip.googleDuration)}</Table.Cell>
              <Table.Cell>{trip.origin?.country}</Table.Cell>
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

      <div className="my-4 text-center">
        <Pagination
          currentPage={1}
          layout="navigation"
          totalPages={100}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};
