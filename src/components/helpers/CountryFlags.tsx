import React, { FC, Fragment } from 'react';

import { Trip } from '../../types';

import { CountryFlag } from './CountryFlag';

const CountryFlags: FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <>
      {trip.country_distances.map((cd) => (
        <Fragment key={`countryFlag${cd.country}`}>
          <CountryFlag
            countryCode={cd.country_code}
            tip={`${cd.country}: ${Math.round(cd.distance / 1000)} km`}
          />
        </Fragment>
      ))}
    </>
  );
};

export default CountryFlags;
