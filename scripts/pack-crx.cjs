/* eslint-disable */
const fs = require('fs');
const path = require('path');
const ChromeExtension = require('crx');
const { Buffer } = require('buffer');

const privateKey = Buffer.from(process.env.CRX_PRIVATE_KEY);

new ChromeExtension({ privateKey })
	.load(path.resolve(process.cwd(), 'dist'))
	.then((crx) => crx.pack())
	.then((buffer) => {
		fs.writeFileSync('raindrop-sync-for-chrome.crx', buffer);
	})
	.catch((err) => {
		console.error(err);
	});
