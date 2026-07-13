import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID) env var is required.');
}

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: 'gqquqyxsezwxdvt9j5x7gw3m',
  },
});
