// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ROUNDS: number;
	readonly VITE_WORDS: Array<string>;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}