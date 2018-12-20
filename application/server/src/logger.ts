import * as winston from 'winston';
import { makeLogger } from '../../lib/logger';

export const logger: winston.Logger = makeLogger('app');

global.logger = logger;
