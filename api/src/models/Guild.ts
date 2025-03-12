import mongoose from 'mongoose';

export interface GuildDocument extends mongoose.Document {
  id: string;
  welcomeChannelId: string | null;
  welcomeMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const guildSchema = new mongoose.Schema<GuildDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    welcomeChannelId: {
      type: String,
      default: null,
    },
    welcomeMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<GuildDocument>('Guild', guildSchema);
