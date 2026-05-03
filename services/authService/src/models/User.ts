import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, SafeUser, UserRole, AuthProvider } from '../types';

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must be at most 30 characters'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,           // never returned in queries by default
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-()]{7,15}$/, 'Invalid phone number'],
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'rider'] as UserRole[],
      default: 'buyer',
    },
    photo: {
      type: String,            // filename stored on disk or URL from Google
      default: null,
    },
    provider: {
      type: String,
      enum: ['local', 'google'] as AuthProvider[],
      default: 'local',
    },
    googleId: {
      type: String,
      sparse: true,            // allows null + unique index
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshTokens: {
      type: [String],
      default: [],
      select: false,           // never returned by default
    },
  },
  {
    timestamps: true,          // createdAt + updatedAt
    versionKey: false,
  }
);

// ─── Indexes ──────────────────────────────────────────────────
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 }, { sparse: true });

// ─── Pre-save: hash password ──────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: compare password ───────────────────────
UserSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// ─── Instance method: safe object (no sensitive fields) ───────
UserSchema.methods.toSafeObject = function (): SafeUser {
  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
    phone: this.phone,
    role: this.role,
    photo: this.photo,
    provider: this.provider,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model<IUser>('User', UserSchema);
