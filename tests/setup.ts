import { cleanup } from '@testing-library/svelte';
import * as chrome from 'sinon-chrome';
import { afterEach, beforeEach, vi } from 'vitest';

// Chrome API N/A in unit tests
vi.stubGlobal('chrome', chrome);

beforeEach(() => {
	vi.mock('axios');
	vi.mock('~/lib/raindrop/client');
});

afterEach(() => {
	chrome.flush();
	vi.resetAllMocks();
	cleanup();
});
