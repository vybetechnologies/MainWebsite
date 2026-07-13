import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID) env var is required to run the studio.');
}

export default defineConfig({
  name: 'vybe-newsroom',
  title: 'VYBE Newsroom',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
