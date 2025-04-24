import { z } from 'zod';
import { bloodType } from './user.const';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
    bloodType: z.enum(bloodType),
    location: z.string(),
    availability: z.boolean(),
    bio: z.string(),
    age: z.number(),
    lastDonationDate: z.string(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    bloodType: z.enum(bloodType).optional(),
    location: z.string().optional(),
    availability: z.boolean().optional(),
    bio: z.string().optional(),
    age: z.number().optional(),
    lastDonationDate: z.string().optional(),
  }),
});

export const userValidationSchema = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
