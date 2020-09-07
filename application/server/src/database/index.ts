import { Model } from 'objection';

import BaseModel from './BaseModel';
import TenantModel from './TenantModel';
import TimestampsMixin from './TimestampsMixin';

export {
    BaseModel,
    TenantModel,
    TimestampsMixin,
};

import registerKnexDebugUtils from './register-knex-debug-utils';

const config = require('../../knex-config');

// const _knex = require('knex');
const knex = require('knex')(config);

// Give the knex object to objection.
Model.knex(knex);

registerKnexDebugUtils(knex);
