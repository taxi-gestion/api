import type { PostgresDb } from '@fastify/postgres';
import type { PoolClient, QueryResult } from 'pg';
import type { FareReady } from './add-fare-to-planning.provider';

export type FarePg = FareReady;
export const toFarePg = (fare: FareReady): FarePg => ({
  client: fare.client,
  creator: fare.creator,
  date: fare.date,
  departure: fare.departure,
  destination: fare.destination,
  distance: fare.distance,
  planning: fare.planning,
  duration: fare.duration,
  kind: fare.kind,
  nature: fare.nature,
  phone: fare.phone,
  status: fare.status,
  time: fare.time
});

export const addFareToPlanningPersist =
  (db: PostgresDb) =>
  async (farePg: FarePg): Promise<Error | QueryResult> => {
    const client: PoolClient = await db.connect();
    try {
      return await insertFareSQLQueryBuilder(client, farePg);
    } catch (error: unknown) {
      return new Error((error as Error).message);
    } finally {
      client.release();
    }
  };

const insertFareSQLQueryBuilder = async (client: PoolClient, farePg: FarePg): Promise<QueryResult> =>
  client.query(insertFareSQLQueryString, [
    farePg.client,
    farePg.creator,
    farePg.date,
    farePg.departure,
    farePg.destination,
    farePg.distance,
    farePg.planning,
    farePg.duration,
    farePg.kind,
    farePg.nature,
    farePg.phone,
    farePg.status,
    farePg.time
  ]);

const insertFareSQLQueryString: string = `
      INSERT INTO fares (
          client, 
          creator, 
          date, 
          departure,
          destination,
          distance, 
          planning, 
          duration, 
          kind,
          nature, 
          phone, 
          status, 
          time
      ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
    `;
