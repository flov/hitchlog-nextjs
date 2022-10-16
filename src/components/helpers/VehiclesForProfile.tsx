import React, { FC } from 'react';
import { VEHICLE } from '../../types';
import { vehicleToIcon } from '../../utils/viewHelpers';

const VehiclesForProfile: FC<{ vehicles: Record<VEHICLE, number> }> = ({
  vehicles,
}) => {
  return (
    <>
      {Object.keys(vehicles).map((vehicle) => {
        const count = vehicles[vehicle as VEHICLE];
        return (
          <div className="flex items-center gap-1" key={vehicle}>
            {vehicleToIcon(vehicle as VEHICLE)}
            <div className="relative flex items-center justify-center w-5 h-5 text-xs text-white bg-gray-700 rounded-full font-sm ring-2 ring-gray-300 hover:bg-gray-600 dark:ring-gray-500">
              {count}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default VehiclesForProfile;
