import mongoose, { Schema, Model, Types } from "mongoose";
import { slugify } from "@/lib/utils";

export interface IArticle {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  image?: string | null;
  excerpt: string;
  content: string;
  author?: string;
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String, default: null },
    excerpt: { type: String, default: "", maxlength: 400 },
    content: { type: String, required: true },
    author: { type: String, default: "مؤسسة النخبة" },
    isPublished: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

ArticleSchema.index({ title: "text", excerpt: "text" });

ArticleSchema.pre("validate", function (next) {
  if (!this.slug && this.title) this.slug = slugify(this.title);
  next();
});

export const Article: Model<IArticle> =
  mongoose.models.Article ||
  mongoose.model<IArticle>("Article", ArticleSchema);
