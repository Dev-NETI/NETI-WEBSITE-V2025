require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');
  console.log('Environment check:');
  console.log('- POSTGRES_URL_NON_POOLING exists:', !!process.env.POSTGRES_URL_NON_POOLING);
  console.log('- ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  
  const client = createClient();
  
  try {
    // Create users table
    console.log('📋 Creating users table...');
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user_manager',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE,
        created_by INTEGER REFERENCES users(id)
      )
    `;
    console.log('✅ Users table created successfully');

    // Check if admin user exists
    console.log('👤 Checking for existing admin user...');
    const existingAdmin = await client.sql`
      SELECT id FROM users WHERE email = ${process.env.ADMIN_EMAIL || 'admin@neti.com.ph'} LIMIT 1
    `;

    if (existingAdmin.rows.length === 0) {
      // Create default admin user
      console.log('👑 Creating default admin user...');
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await client.sql`
        INSERT INTO users (
          email,
          name,
          password,
          role,
          created_at,
          updated_at
        ) VALUES (
          ${process.env.ADMIN_EMAIL || 'admin@neti.com.ph'},
          ${process.env.ADMIN_NAME || 'NETI Super Administrator'},
          ${hashedPassword},
          'super_admin',
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ Default admin user created successfully');
    } else {
      console.log('ℹ️ Admin user already exists, skipping creation');
    }

    // Create other necessary tables for future use
    console.log('📋 Creating additional tables...');
    
    // News/Events table
    await client.sql`
      CREATE TABLE IF NOT EXISTS news_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('news', 'event')),
        status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        featured_image VARCHAR(500),
        publish_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id) NOT NULL
      )
    `;
    console.log('✅ News/Events table created successfully');

    // Contact submissions table
    await client.sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Contact submissions table created successfully');

    // Test the connection with a simple query
    console.log('🧪 Testing database connection...');
    const testResult = await client.sql`SELECT COUNT(*) as user_count FROM users`;
    console.log(`✅ Database test successful! Found ${testResult.rows[0].user_count} users`);

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Initialization script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Initialization script failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };