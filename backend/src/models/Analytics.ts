import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  organization: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  name: string;
  type: 'sales' | 'marketing' | 'financial' | 'operational' | 'custom';
  data: {
    metrics: Array<{
      key: string;
      value: number;
      unit?: string;
      trend?: 'up' | 'down' | 'stable';
    }>;
    timeRange: {
      start: Date;
      end: Date;
    };
    rawData?: any;
  };
  insights: Array<{
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral';
    confidence: number;
    generatedAt: Date;
  }>;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema: Schema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['sales', 'marketing', 'financial', 'operational', 'custom'],
    required: true
  },
  data: {
    metrics: [{
      key: String,
      value: Number,
      unit: String,
      trend: {
        type: String,
        enum: ['up', 'down', 'stable']
      }
    }],
    timeRange: {
      start: Date,
      end: Date
    },
    rawData: Schema.Types.Mixed
  },
  insights: [{
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['positive', 'negative', 'neutral']
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    generatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  }
}, {
  timestamps: true
});

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
