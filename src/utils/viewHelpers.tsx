import { FaBus, FaCarSide, FaMotorcycle, FaPlane, FaShip, FaTruck } from "react-icons/fa";
import { VEHICLES } from "../types";

export const vehicleToIcon = (vehicle: VEHICLES) => {
  switch (vehicle) {
    case 'car':
      return <FaCarSide />
    case 'motorcycle':
      return <FaMotorcycle />;
    case 'bus':
      return <FaBus />;
    case 'plane':
      return <FaPlane />;
    case 'boat':
      return <FaShip />;
    case 'truck':
      return <FaTruck />;
    default:
      return <FaCarSide />;
  }
};
