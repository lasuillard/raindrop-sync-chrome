import { writable, type Readable, type Updater } from 'svelte/store';

// https://github.com/joshnuss/svelte-local-storage-store
export interface Storage {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get(keys: string | string[]): Promise<{ [key: string]: any }>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	set(items: { [key: string]: any }): Promise<void>;
	clear(): Promise<void>;
}

// Dummy in-memory storage for testing w/o real storage backend
export class DummyStorage implements Storage {
	protected map: Map<string, unknown> = new Map();

	get(keys: string | string[]): Promise<{ [key: string]: unknown }> {
		const result: [string, unknown][] = [];
		const keyArray = Array.isArray(keys) ? keys : [keys];
		for (const [key, value] of this.map.entries()) {
			if (keyArray.includes(key)) {
				result.push([key, value]);
			}
		}
		return Promise.resolve(Object.fromEntries(result));
	}
	set(items: { [key: string]: unknown }): Promise<void> {
		for (const [key, value] of Object.entries(items)) {
			this.map.set(key, value);
		}
		return Promise.resolve();
	}
	clear() {
		this.map.clear();
		return Promise.resolve();
	}
}

export interface Options {
	storage?: Storage;
}

export interface AsyncWritable<T> extends Readable<T> {
	set(this: void, value: T): Promise<void>;
	update(this: void, updater: Updater<T>): Promise<void>;
}

const defaultStorage = import.meta.env.MODE === 'test' ? new DummyStorage() : chrome.storage.local;

/**
 * Custom store persisting data via Chrome storage API.
 * @param key Key used in persistence storage backend.
 * @param defaultValue Default value for store if value considered not set.
 * @param options Store options.
 * @returns Store instance.
 */
export function persisted<T>(key: string, defaultValue: T, options?: Options): AsyncWritable<T> {
	const storage = options?.storage ?? defaultStorage;

	// Load previous value from storage
	const { subscribe, set: _set, update: _update } = writable(defaultValue);
	storage.get(key).then((v) => _set(v[key] ?? defaultValue));

	return {
		subscribe,
		set: async (value: T) => {
			await storage.set({ [key]: value });
			_set(value);
		},
		update: async (updater: Updater<T>) => {
			return _update((last: T) => {
				const value = updater(last);
				storage
					.set({ [key]: value })
					?.catch((reason) => console.error('Error while saving value to backend: ' + reason));
				return value;
			});
		}
	};
}
