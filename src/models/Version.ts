// @models/Version.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVersion extends Document {
  blogId: mongoose.Types.ObjectId;
  content: string; // HTML string
  createdAt: Date;
}

const VersionSchema: Schema = new Schema<IVersion>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: 'BlogPost', required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Version: Model<IVersion> = (mongoose.models.Version as Model<IVersion>) || mongoose.model<IVersion>('Version', VersionSchema);