import { Tooltip } from 'flowbite-react';
import React, { FC } from 'react';
import ReactCountryFlag from 'react-country-flag';

import { countries } from '../../utils/country_codes';

const CountryFlagsForProfile: FC<{
  hitchhiked_countries: Record<string, number>;
}> = ({ hitchhiked_countries }) => {
  if (!hitchhiked_countries) return null;
  return (
    <>
      {Object.keys(hitchhiked_countries).map((countryCode, index) => {
        if (!countryCode) return null;
        if (countryCode.length !== 2) return null;
        return (
          <Tooltip
            key={`${index}CountryFlag`}
            content={`${
              /*@ts-ignore*/
              countries[countryCode.toUpperCase()]?.name
            }: ${Math.round(hitchhiked_countries[countryCode] / 1000)} kms`}
          >
            <ReactCountryFlag
              style={{ fontSize: '1.5rem' }}
              countryCode={countryCode}
            />
          </Tooltip>
        );
      })}
    </>
  );
};

export default CountryFlagsForProfile;
