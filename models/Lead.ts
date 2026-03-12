import mongoose from 'mongoose';

interface ILead {
  _id?: string;
  property: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const leadSchema = new mongoose.Schema<ILead>(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Please provide a property id'],
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ property: 1 });

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', leadSchema);
