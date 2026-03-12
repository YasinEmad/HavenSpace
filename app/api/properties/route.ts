import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const status = searchParams.get('status') || 'available';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const propertyType = searchParams.get('propertyType');
    const limit = parseInt(searchParams.get('_limit') || '0', 10);

    let filter: any = { status };

    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    let query = Property.find(filter).sort({ createdAt: -1 });

    if (limit > 0) {
      query = query.limit(limit);
    }

    const properties = await query;

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'title',
      'description',
      'price',
      'address',
      'city',
      'state',
      'zipCode',
      'bedrooms',
      'bathrooms',
      'squareFeet',
      'propertyType',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const property = new Property(body);
    await property.save();

    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: error.message || 'Failed to create property' }, { status: 500 });
  }
}
