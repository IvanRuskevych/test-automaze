import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge/typedefs-mergers/merge-typedefs';
import path from 'path';

const typesArray = loadFilesSync(path.join(__dirname), {
  extensions: ['.graphql'],
  recursive: true,
});

export const typeDefs = mergeTypeDefs(typesArray);
