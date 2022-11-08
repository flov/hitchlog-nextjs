import React, { FC, Fragment } from 'react';
import { Trip } from '../../types';
import { countryFlag } from '../../utils/viewHelpers';

const CountryFlags: FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <>
      {trip.country_distances.map((cd) => (
        <Fragment key={`countryFlag${cd.country}`}>
          {countryFlag(
            cd.country_code,
            `${cd.country}: ${Math.round(cd.distance / 1000)} km`
          )}
        </Fragment>
      ))}
    </>
  );
};

export default CountryFlags;
