const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function run() {
  try {
    console.log('Inserting Access Point...');
    await pool.query(
      'INSERT INTO items (name, price, stock, description) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
      ['Enterprise Access Point Wi-Fi 6', 8500000, 25, 'High-density Wi-Fi 6 access point with OFDMA and MU-MIMO support. Professional ceiling mount design.']
    );

    console.log('Renaming Router...');
    await pool.query(
      'UPDATE items SET name = $1 WHERE name = $2',
      ['Enterprise Router', 'Enterprise VPN Router v6']
    );

    console.log('Update successful.');
  } catch (err) {
    console.error('Update failed:', err.message);
  } finally {
    await pool.end();
  }
}

run();
