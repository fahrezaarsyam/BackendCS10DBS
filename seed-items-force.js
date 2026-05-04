const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const items = [
  { name: 'Enterprise Rack Server R740', price: 125000000, stock: 5, description: 'Dual Intel Xeon Scalable processors, 256GB RAM, 10TB SSD storage.' },
  { name: 'Core Backbone Switch Layer 3', price: 45000000, stock: 12, description: '48-port Gigabit Ethernet with 4x 10GbE SFP+ uplinks.' },
  { name: 'Enterprise VPN Router v6', price: 15000000, stock: 20, description: 'High-speed encrypted throughput with advanced firewall.' }
];

async function seed() {
  try {
    for (const item of items) {
      console.log(`Inserting ${item.name}...`);
      await pool.query(
        'INSERT INTO items (name, price, stock, description) VALUES ($1, $2, $3, $4)',
        [item.name, item.price, item.stock, item.description]
      );
    }
    console.log('Seed done.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
