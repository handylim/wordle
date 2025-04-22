import { defineConfig }       from 'vite';
import tsconfigPaths          from 'vite-tsconfig-paths';
import react                  from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss            from '@tailwindcss/vite';
import { load }               from 'js-toml';
import fs                     from 'node:fs';
import path                   from 'node:path';
import { z }                  from 'zod';

const loadConfig = () => {
	const configSchema = z.object({
		                              API_URL: z.string().url()
	                              });

	const parsedConfig = load(fs.readFileSync('config.toml', 'utf-8'));
	const config       = configSchema.parse(parsedConfig);

	const defineValues: Record<string, string> = {}

	const flattenObject = (obj: any, prefix: string = 'import.meta.env.VITE_') => {
		Object.entries(obj).forEach(([key, value]) => {
			const envKey = key.toUpperCase()

			if (Array.isArray(value))
				defineValues[`import.meta.env.VITE_${envKey}`] = JSON.stringify(value)
			else if (typeof value === 'object' && value !== null) {
				// Handle nested objects
				Object.entries(value)
				      .forEach(([nestedKey, nestedValue]) => {
					      const nestedEnvKey = `${envKey}_${nestedKey.toUpperCase()}`

					      // Handle nested arrays and regular nested values
					      defineValues[`import.meta.env.VITE_${nestedEnvKey}`] = JSON.stringify(nestedValue)
				      })
			}
			else
				defineValues[`import.meta.env.VITE_${envKey}`] = JSON.stringify(value)
		})
	}

	flattenObject(config)

	return defineValues
}

export default defineConfig({
	                            define : loadConfig(),
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