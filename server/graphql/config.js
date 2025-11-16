import { buildSchema } from 'graphql';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRootValue } from './resolvers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load schema
const schemaDoc = readFileSync(
  path.join(__dirname, 'schema.graphql'),
  { encoding: 'utf-8' }
);

const schema = buildSchema(schemaDoc);

// Create GraphQL config (created once, not per request)
export const graphqlConfig = {
  schema,
  rootValue: createRootValue(),
  graphiql: true,
};