import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  settings: {
    timezone: string;
    currency: string;
    dataRetentionDays: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'enterprise'],
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  settings: {
    timezone: {
      type: String,
      default: 'UTC'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    dataRetentionDays: {
      type: Number,
      default: 90
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);
