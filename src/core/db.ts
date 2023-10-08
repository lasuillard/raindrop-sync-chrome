import PouchDB from 'pouchdb';
import findPlugin from 'pouchdb-find';

PouchDB.plugin(findPlugin);

// Global DB configuration
const config: PouchDB.Configuration.DatabaseConfiguration = {
	adapter: 'idb', // IndexedDB
	auto_compaction: true
};

// TODO: Should use extension ID (`chrome.runtime.id`) instead?
const db = new PouchDB('raindrop', config);
db.createIndex({
	index: {
		fields: ['$table']
	}
});
db.info().then((info) => console.debug(`Initialized database; info: ${info}`));

export default db;
