const Agenda = require('agenda');
const mongoose = require('mongoose');

let agenda; // will be initialized after DB is ready

const startAgenda = async () => {
  // Ensure mongoose connection is established
  if (mongoose.connection.readyState !== 1) {
    // wait for connection if not ready
    await new Promise((resolve, reject) => {
      mongoose.connection.once('open', resolve);
      mongoose.connection.on('error', reject);
    });
  }

  agenda = new Agenda({
    mongo: mongoose.connection.db,
    collection: 'jobs'
  });

  // Load job definitions after agenda is instantiated
  require('../workers/postWorker')(agenda);

  await agenda.start();
  console.log('Agenda job scheduler started');
};

const getAgenda = () => agenda;

const graceful = async () => {
  if (agenda) await agenda.stop();
  process.exit(0);
};

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

module.exports = { getAgenda, startAgenda };
