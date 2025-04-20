import { defineConfig }       from 'vite';
import tsconfigPaths          from 'vite-tsconfig-paths';
import react                  from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss            from '@tailwindcss/vite';
import { load }               from 'js-toml';
import fs                     from 'node:fs';
import path                   from 'node:path';
import { z }                  from 'zod';

const configSchema = z.object({
	                              rounds: z.number().int().gt(1),
	                              words : z.array(z.string().length(5).transform(value => value.toLowerCase()))
                              });

const parsedConfig = load(fs.readFileSync('config.toml', 'utf-8'));
const config       = configSchema.parse(parsedConfig);

export default defineConfig({
	                            define : Object.entries(config || {}).reduce((acc, [key, value]) => {
		                            acc[`import.meta.env.VITE_${key.toUpperCase()}`] = value;
		                            return acc;
	                            }, {} as Record<string, number | Array<string>>),
	                            plugins: [tsconfigPaths(),
	                                      TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
	                                      react(),
	                                      tailwindcss()],
	                            resolve: {
		                            alias: {
			                            '@': path.resolve(__dirname, 'src')
		                            }
	                            }
                            });