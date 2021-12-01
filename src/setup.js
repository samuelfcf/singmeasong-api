import dotenv from 'dotenv';

let envFile = '.env.test';

if (process.env.NODE_ENV === 'prod') {
  envFile = '.env';
}

if (process.env.NODE_ENV === 'dev') {
  envFile = '.env.dev';
}

const setup = dotenv.config({
  path: envFile
});

export default setup;
