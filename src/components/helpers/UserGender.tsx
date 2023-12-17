import { Tooltip } from 'flowbite-react';
import React, { FC } from 'react';
import { FaMars, FaMarsStrokeV, FaVenus } from 'react-icons/fa';

export const UserGender: FC<{ gender: string | null; size?: number }> = ({
  gender,
  size = 16,
}) => {
  if (!gender) return null;
  return (
    <Tooltip content={gender}>
      {gender == 'male' ? (
        <FaMars className="inline" size={size} />
      ) : gender == 'female' ? (
        <FaVenus className="inline" />
      ) : gender == 'non-binary' ? (
        <FaMarsStrokeV className="inline" />
      ) : (
        <></>
      )}
    </Tooltip>
  );
};
