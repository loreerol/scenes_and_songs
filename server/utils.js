import * as crypto from "node:crypto";

export const generateId = () =>
  crypto.randomBytes(5).toString("base64url").toUpperCase();

export const currentTimeString = () => new Date().toISOString();
