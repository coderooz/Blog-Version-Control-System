import mongoose, { Schema, Model } from 'mongoose';

export interface IBlogPost {
  title: string;
  currentContent: string; // HTML string
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    currentContent: { type: String, default: '' }
  },
  { timestamps: true }
);

export default (mongoose.models.BlogPost as Model<IBlogPost>) || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
