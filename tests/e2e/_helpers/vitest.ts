import * as rd from '@lasuillard/raindrop-client';
import { test as base } from 'vitest';
import { axiosInstance } from './axios';
import { client, resetData, setupTools, type SetupTools } from './raindrop';

const Raindrop = rd.client.Raindrop;
type Raindrop = rd.client.Raindrop;

export const it = base.extend({
	// Raindrop.io fixtures
	axiosInstance,
	client,
	resetData,
	setupTools
});

declare module 'vitest' {
	export interface TestContext {
		client: Raindrop;
		resetData: undefined;
		setupTools: SetupTools;
	}
}
