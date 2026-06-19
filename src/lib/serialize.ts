import type { Types } from "mongoose";

/**
 * Recursively maps Mongoose/BSON types to their JSON-serialised form so the
 * returned type matches what actually crosses the RSC → client boundary
 * (ObjectId → string, Date → string).
 */
export type Serialized<T> = T extends Types.ObjectId
  ? string
  : T extends Date
    ? string
    : T extends (infer U)[]
      ? Serialized<U>[]
      : T extends object
        ? { [K in keyof T]: Serialized<T[K]> }
        : T;

/**
 * Converts Mongoose/BSON values (ObjectId, Date, Buffer) into plain JSON-safe
 * values so documents can cross the RSC → client boundary.
 */
export function serialize<T>(value: T): Serialized<T> {
  return JSON.parse(JSON.stringify(value, replacer));
}

function replacer(_key: string, val: unknown) {
  if (val && typeof val === "object") {
    const obj = val as { _bsontype?: string; toString?: () => string };
    if (obj._bsontype === "ObjectId" && obj.toString) {
      return obj.toString();
    }
  }
  return val;
}
