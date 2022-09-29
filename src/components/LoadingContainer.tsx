import { Status } from '@googlemaps/react-wrapper';
import { ReactElement } from 'react';

const LoadingContainer = (status: Status): ReactElement => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return <></>;
};

export default LoadingContainer;
