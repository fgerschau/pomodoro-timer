import React, { FC } from 'react';
import Routes from './Routes';
import ServiceWorkerWrapper from '../components/ServiceWorkerWrapper';

const Screens: FC = () => {
  return (
    <>
      <ServiceWorkerWrapper />
      <Routes />
    </>
  );
}

export default Screens;
