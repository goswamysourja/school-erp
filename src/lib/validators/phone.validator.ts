import { z } from "zod";

export const e164PhoneSchema = z
  .string()
  .trim()
  .regex(
    /^\+[1-9]\d{6,14}$/,
    "Invalid international phone number.",
  );