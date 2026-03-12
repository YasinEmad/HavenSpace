import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // require admin session for retrieving leads
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const leads = await Lead.find().populate('property');
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const { property: propertyId, name, phone, email, notes } = body;
    if (!propertyId || !name || !phone || !email) {
      return NextResponse.json({ error: 'Missing required field(s)' }, { status: 400 });
    }

    // ensure property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const lead = new Lead({ property: propertyId, name, phone, email, notes });
    await lead.save();

    // optionally populate before returning
    await lead.populate('property');

    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: error.message || 'Failed to create lead' }, { status: 500 });
  }
}
