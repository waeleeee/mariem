const { Pool } = require('pg');

console.log('PostgreSQL Connection Test');
console.log('=========================');

// PostgreSQL connection configuration
// Using the same config from server.js
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'radio_sales',
  password: 'password', // Change this if you modified the password
  port: 5432,
});

async function testConnection() {
  console.log('Attempting to connect to PostgreSQL...');
  
  try {
    // Try to connect and run a simple query
    const result = await pool.query('SELECT version()');
    
    console.log('\n✅ SUCCESS: PostgreSQL is installed and working!');
    console.log(`\nPostgreSQL Version: ${result.rows[0].version}`);
    console.log('\nDatabase Connection Details:');
    console.log(`- Host: localhost:5432`);
    console.log(`- Database: radio_sales`);
    console.log(`- User: postgres`);
    
    // Test if our specific database tables exist
    try {
      const tablesResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      console.log('\nDatabase Tables Found:');
      if (tablesResult.rows.length === 0) {
        console.log('- No tables found. Server needs to initialize the database.');
      } else {
        tablesResult.rows.forEach(row => {
          console.log(`- ${row.table_name}`);
        });
      }
    } catch (err) {
      console.log('\nCould not check for tables:', err.message);
    }
    
  } catch (err) {
    console.log('\n❌ ERROR: Could not connect to PostgreSQL');
    console.log('\nError details:', err.message);
    console.log('\nPossible issues:');
    console.log('1. PostgreSQL is not installed or not running');
    console.log('2. Password is incorrect (check server.js for the correct password)');
    console.log('3. Database "radio_sales" does not exist');
    console.log('4. PostgreSQL is not running on the default port (5432)');
    console.log('\nTroubleshooting Steps:');
    console.log('- Verify PostgreSQL is installed: run "pg_config --version" in terminal');
    console.log('- Check if PostgreSQL service is running');
    console.log('- Verify database "radio_sales" exists');
    console.log('- Check if credentials in server.js match your PostgreSQL setup');
  } finally {
    // Close the pool
    pool.end();
  }
}

// Run the test
testConnection(); 