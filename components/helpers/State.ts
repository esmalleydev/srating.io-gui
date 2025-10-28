
// todo remove redux :D

import Objector from '@/components/utils/Objector';

type url_param_type_x_keysType = {
  string: string[];
  array: string[];
  boolean: string[];
}

type key_x_local_storage_keyType = {
  [key:string]: string;
}

type constructorParams = {
  type: string;
}

/**
 * State class to help with all the redux functions. Handles a bunch of url stuff as well.
 *
 * TODO eventually replace redux
 */
class State<T extends object> {
  constructor(args: constructorParams) {
    this.type = args.type;
  }

  private checkType: boolean = true;

  private type: string;

  private url_param_type_x_keys: url_param_type_x_keysType;

  private key_x_local_storage_key: key_x_local_storage_keyType;

  private initialState: T;

  private defaultState: T;

  private get_type(): string {
    return this.type;
  }

  public get_checkType() {
    return this.checkType;
  }

  public set_checkType(value: boolean) {
    this.checkType = value;
  }

  public set_url_param_type_x_keys(url_param_type_x_keys: url_param_type_x_keysType) {
    this.url_param_type_x_keys = url_param_type_x_keys;
  }

  public get_url_param_type_x_keys():url_param_type_x_keysType {
    return this.url_param_type_x_keys;
  }

  public set_key_x_local_storage_key(key_x_local_storage_key: key_x_local_storage_keyType) {
    this.key_x_local_storage_key = key_x_local_storage_key;
  }

  public get_key_x_local_storage_key():key_x_local_storage_keyType {
    return this.key_x_local_storage_key || {};
  }

  public getInitialState(): T {
    return this.initialState;
  }

  /**
   * Set the initialState, this will also set the defaultState if not set already
   */
  public setInitialState(initialState: T) {
    this.initialState = initialState;

    if (!this.getDefaultState()) {
      this.setDefaultState(Object.freeze(Objector.deepClone(initialState)));
    }
  }

  public getDefaultState(): T {
    return this.defaultState;
  }

  public setDefaultState(defaultState: T) {
    this.defaultState = defaultState;
  }


  public updateStateFromUrlParams(state: T): void {
    if (typeof window === 'undefined') {
      return;
    }

    // for when this gets run on initial compile / execution
    if (
      this.get_checkType() &&
      this.get_type() &&
      !window.location.pathname.includes(this.get_type())
    ) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);

    const url_param_type_x_keys = this.get_url_param_type_x_keys();

    for (const type in url_param_type_x_keys) {
      for (let i = 0; i < url_param_type_x_keys[type].length; i++) {
        const key = url_param_type_x_keys[type][i];
        if (type === 'string') {
          const value = urlParams.get(key);
          if (value !== null) {
            state[key] = value;
          }
        }
        if (type === 'boolean') {
          const value = urlParams.get(key);
          if (value !== null) {
            state[key] = (+value === 1);
          }
        }
        if (type === 'array') {
          const value = urlParams.getAll(key);
          if (value !== null) {
            state[key] = [...new Set([...this.getInitialState()[key], ...value])];
          }
        }

        this.setLocalStorage(key, state[key]);
      }
    }
  }

  public updateURL<K extends keyof T>(key: K, value: T[K] | null) {
    // console.log('update URL:', this.type, key, value)
    let key_is_url_param = false;
    const url_param_type_x_keys = this.get_url_param_type_x_keys();

    // eslint-disable-next-line no-restricted-syntax, no-labels
    outer: for (const t in url_param_type_x_keys) {
      for (let i = 0; i < url_param_type_x_keys[t].length; i++) {
        const k = url_param_type_x_keys[t][i];

        if (key === k) {
          key_is_url_param = true;
          // eslint-disable-next-line no-labels
          break outer;
        }
      }
    }

    if (key_is_url_param) {
      // Order here is kinda important, set url before the state
      const current = new URLSearchParams(window.location.search);
      if (value !== null) {
        current.delete(key as string);

        if (typeof value === 'object' && Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            current.append(key as string, value[i].toString());
          }
        } else {
          current.set(key as string, String(value));
        }
      } else {
        current.delete(key as string);
      }

      window.history.replaceState(null, '', `?${current.toString()}`);

      // use pushState if we want to add to back button history
      // window.history.pushState(null, '', `?${current.toString()}`);
    }
  }

  public setLocalStorage(key, value) {
    const key_x_local_storage_key = this.get_key_x_local_storage_key();
    if (typeof window !== 'undefined' && key in key_x_local_storage_key) {
      let localStoreValue: string;
      if (typeof value === 'object' && value !== null) {
        localStoreValue = JSON.stringify(value);
      } else if (value === null) {
        localStorage.removeItem(key_x_local_storage_key[key]);
        return;
      } else {
        localStoreValue = String(value);
      }

      localStorage.setItem(key_x_local_storage_key[key], localStoreValue);
    }
  }

  /**
   * Reset the state back to the default state and update the URL
   */
  public reset(state: T, updateURL = true) {
    const defaultState = this.getDefaultState();
    for (const key in defaultState) {
      // we do not have to reset this one, it is controlled by the contents changing
      if (key !== 'loadingView') {
        const typedKey = key;
        if (updateURL) {
          this.updateURL(typedKey, defaultState[typedKey]);
        }
        state[key] = defaultState[typedKey];
        this.setLocalStorage(key, state[key]);
      }
    }
    if (updateURL) {
      this.updateStateFromUrlParams(state);
    }
  }

  /**
   * Reset a specific data key and then the URL
   */
  public resetDataKey<K extends keyof T>(state: T, key: K) {
    const defaultState = this.getDefaultState();
    this.updateURL(key, defaultState[key]);
    state[key] = defaultState[key];
    this.setLocalStorage(key, state[key]);
  }

  /**
   * Set a specific data key value and update the URL
   */
  public setDataKey<K extends keyof T>(state: T, key: K, value: T[K]) {
    this.updateURL(key, value);
    state[key] = value;
    this.setLocalStorage(key, state[key]);
  }

  /**
   * Use this one to magically update arrays instead of a full set.
   *
   * ex: [1, 2, 3]
   *
   * setDataKey(key, [1]) will update it to just [1]
   *
   * updateDataKey will remove 1 while keeping the other elements [2, 3]
   */
  public updateDataKey<K extends keyof T>(state: T, key: K, value: T[K] | null) {
    // if the default value is null, but it can be an array, this will not work
    if (Array.isArray(state[key])) {
      let strate = state[key] as string[];
      const v = value as string | string[];
      if (typeof v === 'object' && v !== null) {
        strate = Objector.deepClone(v);
      } else if (value !== null) {
        const index = strate.indexOf(v);
        if (index !== -1) {
          strate = [
            ...strate.slice(0, index),
            ...strate.slice(index + 1),
          ];
        } else {
          strate = [...strate, v];
        }
      } else {
        strate = [];
      }

      this.updateURL(key, value);

      state[key] = strate as T[K];
    } else {
      // Can only pass null to one of the array ones
      if (value === null) {
        throw new Error('Can not pass null');
      }
      state[key] = value;
    }

    this.setLocalStorage(key, state[key]);
  }
}

export default State;

