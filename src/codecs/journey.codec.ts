import { Type, type as ioType, string as ioString, number as ioNumber } from 'io-ts';
import { Journey, JourneyEstimate } from '../definitions';
import { placeCodec, placeRulesCodec } from './place.codec';
import { isDateTimeISO8601String } from './dateTimeISO8601.rule';
import { isPositive } from './positive.rule';

export const journeyCodec: Type<Journey> = ioType({
  origin: placeCodec,
  destination: placeCodec,
  departureTime: ioString
});

// eslint-disable-next-line @typescript-eslint/typedef
export const journeyRulesCodec = ioType({
  origin: placeRulesCodec,
  destination: placeRulesCodec,
  departureTime: isDateTimeISO8601String
});

export const journeyEstimateCodec: Type<JourneyEstimate> = ioType({
  distanceInMeters: ioNumber,
  durationInSeconds: ioNumber
});

// eslint-disable-next-line @typescript-eslint/typedef
export const journeyEstimateRulesCodec = ioType({
  distanceInMeters: isPositive,
  durationInSeconds: isPositive
});
