import { pipe } from 'fp-ts/lib/function';
import { fromEither, TaskEither } from 'fp-ts/TaskEither';
import { Entity, Subcontracted } from '../../definitions';
import { Errors, externalTypeCheckFor, subcontractedFaresCodec } from '../../codecs';

export const subcontractedFaresValidation = (transfer: unknown): TaskEither<Errors, (Entity & Subcontracted)[]> =>
  pipe(transfer, externalTypeCheckFor<(Entity & Subcontracted)[]>(subcontractedFaresCodec), fromEither);
