import React, { FC } from 'react';

import { Tooltip } from 'flowbite-react';
import ReactCountryFlag from 'react-country-flag';

export const CountryFlag: FC<{
  countryCode: string | undefined;
  tip: string;
}> = ({ countryCode, tip }) => {
  if (!countryCode) return null;
  return (
    <Tooltip
      //@ts-ignore
      content={`${tip ? tip : countries[countryCode.toUpperCase()]?.name}`}
    >
      {countryCode.length === 2 && (
        <ReactCountryFlag
          style={{ fontSize: '1.5rem' }}
          countryCode={countryCode}
        />
      )}
    </Tooltip>
  );
};
