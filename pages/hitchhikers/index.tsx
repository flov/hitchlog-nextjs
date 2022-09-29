import { Button, Table } from 'flowbite-react';
import Link from 'next/link';
import React, { FC } from 'react';

const Index: FC = () => {
  return (
    <div className="mx-auto my-8 text-center max-w-screen-sm lg:mb-16">
      <h1>Hitchhikers</h1>
      <Table>
        <Table.Head>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Statistics</Table.HeadCell>
          <Table.HeadCell>View Profile</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {[].map((user: any, index) => (
            <Table.Row key={`user${index}`}>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>
                <Link href={`/hitchhikers/${user.id}`}>View Profile</Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Index;
