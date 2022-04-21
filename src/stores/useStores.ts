// istanbul ignore file

import React from 'react';
import { MobXProviderContext } from 'mobx-react';
import TimerStore from './TimerStore';

interface IStores {
  timer: TimerStore;
}

export const useStores = (): IStores =>
  React.useContext(MobXProviderContext) as IStores;

export const useTimerStore = (): TimerStore =>
  React.useContext(MobXProviderContext).timer;
