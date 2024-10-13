import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  auth: {
    method: 'jwt';
    skip: boolean;
    redirectPath: string;
    setupPath?: string;
  };
  mapboxApiKey: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Bramble',
  appVersion: packageJson.version,
  serverUrl: import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000',
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',
  /**
   * Auth
   * @method supabase
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
    setupPath: paths.setup.root,
  },
  /**
   * Mapbox
   */
  mapboxApiKey: import.meta.env.VITE_MAPBOX_API_KEY ?? '',
};
