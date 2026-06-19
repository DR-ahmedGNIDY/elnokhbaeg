import mongoose, { Schema, Model } from "mongoose";

export interface ICounter {
  _id: string; // counter key, e.g. "approvedStudentCode"
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter: Model<ICounter> =
  mongoose.models.Counter ||
  mongoose.model<ICounter>("Counter", CounterSchema);

/**
 * Atomically increments and returns the next sequence value for a key.
 * Used to generate gap-free NOK00001, NOK00002… credential codes.
 */
export async function nextSequence(key: string): Promise<number> {
  const doc = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  ).lean();
  return doc!.seq;
}
