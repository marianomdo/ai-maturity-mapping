const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL Connected');
    
    // Create tables if they don't exist
    await createTables(client);
    
    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Create database tables
const createTables = async (client) => {
  try {
    // Create companies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create ai_cards table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_cards (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        category_name VARCHAR(100) NOT NULL,
        level_name VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        current_score_justification TEXT,
        next_steps_recommendations TEXT,
        relevant_link VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

module.exports = { pool, connectDB }; 