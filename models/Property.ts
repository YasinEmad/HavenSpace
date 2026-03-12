import mongoose from 'mongoose';

interface IProperty {
  _id?: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  status: 'available' | 'sold' | 'pending';
  imageUrls: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const propertySchema = new mongoose.Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price must be a positive number'],
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    city: {
      type: String,
      required: [true, 'Please provide a city'],
    },
    state: {
      type: String,
      required: [true, 'Please provide a state'],
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide a zip code'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please provide number of bedrooms'],
      min: [0, 'Bedrooms must be a positive number'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please provide number of bathrooms'],
      min: [0, 'Bathrooms must be a positive number'],
    },
    squareFeet: {
      type: Number,
      required: [true, 'Please provide square feet'],
      min: [0, 'Square feet must be a positive number'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please provide a property type'],
      enum: ['house', 'apartment', 'condo', 'townhouse', 'commercial', 'land'],
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'pending'],
      default: 'available',
    },
    imageUrls: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ city: 1, price: 1 });
propertySchema.index({ status: 1 });

export default mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema);
