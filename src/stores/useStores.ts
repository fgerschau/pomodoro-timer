// istanbul ignore file

import React from 'react';
import { MobXProviderContext } from 'mobx-react';
import TimerStore from './TimerStore';
import ConfigStore from './ConfigStore';

interface IStores {
  timer: TimerStore;
  config: ConfigStore;
}

export const useStores = (): IStores =>
  React.useContext(MobXProviderContext);

export const useTimerStore = (): TimerStore =>
  React.useContext(MobXProviderContext).timer;

export const useConfigStore = (): ConfigStore =>
  React.useContext(MobXProviderContext).config;
