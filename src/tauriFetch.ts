import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

// Override global fetch
window.fetch = tauriFetch;