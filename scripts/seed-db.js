const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connection string - update this with your MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Drop existing collections
    try {
      await db.collection('users').drop();
      await db.collection('properties').drop();
      console.log('Dropped existing collections');
    } catch (e) {
      // Collections might not exist yet
    }

    // Create users collection with demo admin
    const usersCollection = db.collection('users');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await usersCollection.insertOne({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Created demo user: admin@example.com / password123');

    // Create properties collection with sample properties
    const propertiesCollection = db.collection('properties');

    const sampleProperties = [
      {
        title: 'Luxury Modern Villa',
        description: 'Beautiful contemporary villa with stunning ocean views. Features high-end finishes, smart home technology, and a private infinity pool.',
        price: 2500000,
        address: '123 Ocean View Lane',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        bedrooms: 5,
        bathrooms: 4,
        squareFeet: 5500,
        propertyType: 'house',
        status: 'available',
        imageUrls: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Downtown Penthouse',
        description: 'Exclusive penthouse in the heart of downtown. Floor-to-ceiling windows, premium finishes, and access to building amenities.',
        price: 1850000,
        address: '456 Downtown Plaza',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        bedrooms: 3,
        bathrooms: 3,
        squareFeet: 3200,
        propertyType: 'apartment',
        status: 'available',
        imageUrls: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Cozy Family Home',
        description: 'Perfect starter home for growing families. Recently renovated with modern kitchen, spacious backyard, and excellent neighborhood.',
        price: 650000,
        address: '789 Maple Street',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        bedrooms: 4,
        bathrooms: 2,
        squareFeet: 2800,
        propertyType: 'house',
        status: 'available',
        imageUrls: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Waterfront Condo',
        description: 'Spectacular waterfront condo with direct water access. Premium amenities, concierge service, and stunning sunset views.',
        price: 1200000,
        address: '321 Harbor View',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1800,
        propertyType: 'condo',
        status: 'pending',
        imageUrls: [
          'https://images.unsplash.com/photo-1512917774080-9b274b3f5798?w=800',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Historic Townhouse',
        description: 'Charming historic townhouse with original architectural details. Three stories with private courtyard and garage.',
        price: 975000,
        address: '555 Historic Row',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2400,
        propertyType: 'townhouse',
        status: 'available',
        imageUrls: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Commercial Property',
        description: 'Prime commercial space ideal for retail or office use. High foot traffic location, move-in ready.',
        price: 1500000,
        address: '888 Commercial Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 4000,
        propertyType: 'commercial',
        status: 'sold',
        imageUrls: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const properties = await propertiesCollection.insertMany(sampleProperties);

    console.log(`Created ${properties.insertedIds.length} sample properties`);

    // Create indexes
    await propertiesCollection.createIndex({ city: 1, price: 1 });
    await propertiesCollection.createIndex({ status: 1 });
    await usersCollection.createIndex({ email: 1 });

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
