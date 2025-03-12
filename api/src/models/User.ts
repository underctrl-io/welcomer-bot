import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
  id: string;
  accessToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    accessToken: {
      type: String,
      default: null,
    },
    accessTokenExpiresAt: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<UserDocument>('User', userSchema);
