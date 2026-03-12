const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not defined');
  process.exit(1);
}

// Define schemas inline to avoid import issues
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    name: { type: String, default: '' },
  },
  { timestamps: true }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    squareFeet: { type: Number, required: true },
    propertyType: {
      type: String,
      required: true,
      enum: ['house', 'apartment', 'condo', 'townhouse', 'commercial', 'land'],
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'pending'],
      default: 'available',
    },
    imageUrls: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Property = mongoose.model('Property', propertySchema);

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
    imageUrls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
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
    imageUrls: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
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
    imageUrls: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
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
    status: 'available',
    imageUrls: ['https://images.unsplash.com/photo-1512917774080-9b274b3f5798?w=800'],
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
    imageUrls: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
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
    status: 'available',
    imageUrls: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
  },
  {
    title: 'Spacious Ranch Home',
    description: 'Beautiful ranch-style home on 2 acres with horse stables and scenic landscape. Perfect for families who love the outdoors.',
    price: 850000,
    address: '999 Ranch Road',
    city: 'Austin',
    state: 'TX',
    zipCode: '78704',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3600,
    propertyType: 'house',
    status: 'available',
    imageUrls: ['https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800'],
  },
  {
    title: 'Modern Studio Loft',
    description: 'Trendy studio loft in the arts district. Open concept, exposed brick, and floor-to-ceiling windows.',
    price: 550000,
    address: '222 Art Street',
    city: 'Denver',
    state: 'CO',
    zipCode: '80202',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 900,
    propertyType: 'apartment',
    status: 'available',
    imageUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('✓ Cleared existing collections');

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    });
    console.log('✓ Created admin user: admin@example.com / password123');

    // Create properties
    console.log('Creating sample properties...');
    const properties = await Property.insertMany(sampleProperties);
    console.log(`✓ Created ${properties.length} sample properties`);

    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
