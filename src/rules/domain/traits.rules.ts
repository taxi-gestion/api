/* eslint-disable @typescript-eslint/typedef */
import { type as ioType } from 'io-ts';
import { isDateTimeISO8601String, isFrenchPhoneNumber, isPositive } from '../common';
import { placeRulesCodec } from '../common/place.rule';

export const driveRulesCodec = ioType({
  datetime: isDateTimeISO8601String,
  departure: placeRulesCodec,
  destination: placeRulesCodec
});

export const durationDistanceRulesCodec = ioType({
  duration: isPositive,
  distance: isPositive
});

export const passengerRulesCodec = ioType({
  phone: isFrenchPhoneNumber
});