import { Pagination, Table } from 'flowbite-react';
import { FC } from 'react';
import { Trip } from '../types';
import TripRow from './TripRow';

export const ListTrips: FC<{ trips: Trip[] }> = ({ trips }) => {
  return (
    <>
      <Table>
        <Table.Head>
          <Table.HeadCell>From</Table.HeadCell>
          <Table.HeadCell>To</Table.HeadCell>
          <Table.HeadCell>Duration</Table.HeadCell>
          <Table.HeadCell>Country</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {trips?.map((trip) => (
            <TripRow key={trip.id} trip={trip} />
          ))}
        </Table.Body>
      </Table>

      <div className="my-4 text-center">
        <Pagination
          currentPage={1}
          layout="navigation"
          totalPages={100}
          onPageChange={(page) => console.log(page)}
        />
      </div>
    </>
  );
};
