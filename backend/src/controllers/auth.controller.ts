import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Organization from '../models/Organization';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, organizationName, industry, organizationSize } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError('User already exists', 400);
    }
    
    // Create organization
    const organization = await Organization.create({
      name: organizationName,
      industry,
      size: organizationSize,
      owner: null, // Will be updated after user creation
      members: []
    });
    
    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'admin',
      organization: organization._id
    });
    
    // Update organization with owner
    organization.owner = user._id;
    organization.members.push(user._id);
    await organization.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organization: {
          id: organization._id,
          name: organization.name
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email }).populate('organization');
    if (!user) {
      throw createError('Invalid credentials', 401);
    }
    
    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organization: user.organization
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id)
      .select('-password')
      .populate('organization');
    
    if (!user) {
      throw createError('User not found', 404);
    }
    
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
