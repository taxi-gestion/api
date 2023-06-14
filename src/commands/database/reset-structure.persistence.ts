import { TaskEither, tryCatch as taskEitherTryCatch } from 'fp-ts/TaskEither';
import type { PoolClient, QueryResult } from 'pg';
import type { PostgresDb } from '@fastify/postgres';
import { Errors, InfrastructureError } from '../../reporter/HttpReporter';

export const resetDatabaseStructure = (database: PostgresDb): TaskEither<Errors, QueryResult> =>
  taskEitherTryCatch(dropAndRecreateTables(database)(), onDropAndRecreateTablesError);

const dropAndRecreateTables = (database: PostgresDb) => () => async (): Promise<QueryResult> => {
  const client: PoolClient = await database.connect();
  try {
    return await dropAndRecreateTablesQueries(client);
  } finally {
    client.release();
  }
};

const onDropAndRecreateTablesError = (error: unknown): Errors =>
  [
    {
      isInfrastructureError: true,
      message: `reset structure database error - ${(error as Error).message}`,
      // eslint-disable-next-line id-denylist
      value: (error as Error).name,
      stack: (error as Error).stack ?? 'no stack available',
      code: (error as Error).message.includes('ECONNREFUSED') ? '503' : '500'
    } satisfies InfrastructureError
  ] satisfies Errors;

const dropAndRecreateTablesQueries = async (client: PoolClient): Promise<QueryResult> =>
  client.query(dropAndRecreateTablesQueryString);

const dropAndRecreateTablesQueryString: string = `DROP TABLE IF EXISTS fares;
     CREATE TABLE fares (
        client TEXT NOT NULL,
        creator TEXT NOT NULL,
        date TEXT NOT NULL,
        departure TEXT NOT NULL,
        destination TEXT NOT NULL,
        distance NUMERIC NOT NULL,
        planning TEXT NOT NULL,
        duration NUMERIC NOT NULL,
        kind TEXT NOT NULL,
        nature TEXT NOT NULL,
        phone TEXT NOT NULL,
        status TEXT NOT NULL,
        time TEXT NOT NULL
    );`;