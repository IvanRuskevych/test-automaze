import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge/typedefs-mergers/merge-typedefs';
import { fileURLToPath } from 'node:url';
import * as path from 'path';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const typesArray = loadFilesSync(path.join(currentDir), {
  extensions: ['.graphql'],
  recursive: true,
});

export const typeDefs = mergeTypeDefs(typesArray);
