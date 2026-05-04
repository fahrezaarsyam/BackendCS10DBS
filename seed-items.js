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
  { name: 'Enterprise Rack Server R740', price: 125000000, stock: 5, description: 'Dual Intel Xeon Scalable processors, 256GB RAM, 10TB SSD storage. Ideal for mission-critical databases.' },
  { name: 'Core Backbone Switch Layer 3', price: 45000000, stock: 12, description: '48-port Gigabit Ethernet with 4x 10GbE SFP+ uplinks. High-performance networking for your datacenter.' },
  { name: 'Enterprise VPN Router v6', price: 15000000, stock: 20, description: 'High-speed encrypted throughput with advanced firewall rules and redundant WAN support.' },
  { name: 'Ultrawide Curved Monitor 49"', price: 18000000, stock: 15, description: 'Panoramic workspace for network monitoring and development.' },
  { name: 'Mechanical Database Keyboard', price: 2500000, stock: 50, description: 'Optimized tactile response for long coding sessions.' }
];

async function seed() {
  try {
    console.log('Seeding new items...');
    for (const item of items) {
      await pool.query(
        'INSERT INTO items (name, price, stock, description) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [item.name, item.price, item.stock, item.description]
      );
    }
    console.log('Seed completed successfully.');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await pool.end();
  }
}

seed();
