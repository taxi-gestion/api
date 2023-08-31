import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { pipe } from 'fp-ts/function';
import { fold as taskEitherFold } from 'fp-ts/TaskEither';
import { onErroredTask, onSuccessfulTaskWith } from '../../server.utils';
import { Entity, Passenger } from '../../definitions';
import { listPassengersDatabaseQuery } from './list-passengers.persistence';

/* eslint-disable @typescript-eslint/require-await */
export const listPassengersQuery = async (server: FastifyInstance): Promise<void> => {
  server.route({
    method: 'GET',
    url: '/list-passengers',
    handler: async (_req: FastifyRequest, reply: FastifyReply): Promise<void> => {
      await pipe(
        listPassengersDatabaseQuery(server.pg)(),
        taskEitherFold(onErroredTask(reply), onSuccessfulTaskWith(reply)<(Entity & Passenger)[]>)
      )();
    }
  });
};
/* eslint-enable @typescript-eslint/require-await */
