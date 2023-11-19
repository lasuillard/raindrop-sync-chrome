import axios from 'axios';
import { vi } from 'vitest';

export const getClient = vi.fn(() => axios);
