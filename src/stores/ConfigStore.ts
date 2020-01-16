import {observable, action} from "mobx";

class ConfigStore {
  @observable public locked: boolean = false;
  @action public toggleLock = (): void => {
    this.locked = !this.locked;
  }
}

export default ConfigStore;
