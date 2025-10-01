import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/typeDefs/**/*.graphql',
  generates: {
    'src/graphql/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers', 'typescript-document-nodes'],
      config: {
        useIndexSignature: true,
        defaultMapper: 'any',
        mappers: {
          Task: '@prisma/client#Task as PrismaTask',
          Category: '@prisma/client#Category as PrismaCategory',
        },
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
      },
    },
  },
};

export default config;
