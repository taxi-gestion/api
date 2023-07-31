import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { pipe } from 'fp-ts/function';
import { fold as taskEitherFold } from 'fp-ts/TaskEither';
import { onErroredTask, onSuccessfulTaskWith } from '../../server.utils';
import { PostgresDb } from '@fastify/postgres';
import { resetDatabaseStructure } from './database-reset.persistence';
import { QueryResult } from 'pg';

// eslint-disable-next-line @typescript-eslint/require-await
export const resetDatabaseCommand = async (server: FastifyInstance, _dependencies: { database: PostgresDb }): Promise<void> => {
  server.route({
    method: 'GET',
    url: '/database/reset',
    handler: async (_: FastifyRequest, reply: FastifyReply): Promise<void> => {
      await pipe(
        resetDatabaseStructure(server.pg),
        taskEitherFold(onErroredTask(reply), onSuccessfulTaskWith(reply)<QueryResult>)
      )();
    }
  });
};
