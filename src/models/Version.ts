import mongoose, { Schema, Model } from 'mongoose';

export interface IVersion {
  blogId: mongoose.Types.ObjectId;
  content: string; // HTML
  createdAt: Date;
}

const VersionSchema = new Schema<IVersion>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: 'BlogPost', required: true },
    content: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Version: Model<IVersion> =
  (mongoose.models.Version as Model<IVersion>) ||
  mongoose.model<IVersion>('Version', VersionSchema);
