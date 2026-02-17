import { Response, NextFunction } from 'express';
import Analytics from '../models/Analytics';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { generateAIInsights } from '../services/ai.service';

export const createAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, type, data } = req.body;
    const userId = req.user?.id;
    
    // Get user's organization
    const User = require('../models/User').default;
    const user = await User.findById(userId);
    
    if (!user || !user.organization) {
      throw createError('User organization not found', 404);
    }
    
    // Create analytics entry
    const analytics = await Analytics.create({
      organization: user.organization,
      user: userId,
      name,
      type,
      data,
      status: 'processing'
    });
    
    // Generate AI insights asynchronously
    generateAIInsights(analytics._id.toString()).catch(err => {
      console.error('Failed to generate insights:', err);
    });
    
    res.status(201).json({
      message: 'Analytics created successfully',
      analytics
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const User = require('../models/User').default;
    const user = await User.findById(userId);
    
    if (!user || !user.organization) {
      throw createError('User organization not found', 404);
    }
    
    const analytics = await Analytics.find({ organization: user.organization })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({ analytics });
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const User = require('../models/User').default;
    const user = await User.findById(userId);
    
    const analytics = await Analytics.findOne({
      _id: id,
      organization: user.organization
    });
    
    if (!analytics) {
      throw createError('Analytics not found', 404);
    }
    
    res.status(200).json({ analytics });
  } catch (error) {
    next(error);
  }
};

export const deleteAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const User = require('../models/User').default;
    const user = await User.findById(userId);
    
    const analytics = await Analytics.findOneAndDelete({
      _id: id,
      organization: user.organization
    });
    
    if (!analytics) {
      throw createError('Analytics not found', 404);
    }
    
    res.status(200).json({ message: 'Analytics deleted successfully' });
  } catch (error) {
    next(error);
  }
};
