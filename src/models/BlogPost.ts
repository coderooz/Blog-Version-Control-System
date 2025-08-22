// @models/BlogPost
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  currentContent: string; // stored as HTML string
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    currentContent: { type: String, default: '' },
  },
  { timestamps: true }
);

export const BlogPost: Model<IBlogPost> = (mongoose.models.BlogPost as Model<IBlogPost>) || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);