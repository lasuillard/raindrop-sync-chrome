import { writable, type Updater, type Writable } from 'svelte/store';

// https://github.com/joshnuss/svelte-local-storage-store
interface Storage {
	get(keys: string | string[]): Promise<{ [key: string]: unknown }>;
	set(items: { [key: string]: unknown }): Promise<void>;
	clear(): Promise<void>;
}

interface Options {
	storage?: Storage;
}

/**
 * Custom store persisting data via Chrome storage API.
 * @param key Key used in persistence storage backend.
 * @param defaultValue Default value for store if value considered not set.
 * @param options Store options.
 * @returns Store instance.
 */
// FIXME: Store return type mismatch (async interface)
export async function persisted<T>(
	key: string,
	defaultValue: T,
	options?: Options
): Promise<Writable<T>> {
	const storage = options?.storage ?? chrome.storage.local;

	// Load previous value from storage
	const preValue = await storage.get(key)?.then((v) => v[key]);
	const initialValue = preValue ?? defaultValue;
	const { subscribe, set: _set, update: _update } = writable(initialValue);

	return {
		subscribe,
		set: async (value: T) => {
			await storage.set({ [key]: value });
			_set(value);
		},
		update: async (updater: Updater<T>) => {
			return _update((last: T) => {
				const value = updater(last);
				storage.set({ [key]: value })?.catch((reason) => console.log(reason));
				return value;
			});
		}
	};
}
