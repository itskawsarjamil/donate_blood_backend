import { z } from 'zod';
import { RequestStatus } from './request.const';

const createDonationRequestSchema = z.object({
  body: z.object({
    donorId: z.string(),
    phoneNumber: z.string(),
    dateOfDonation: z.string(),
    hospitalName: z.string(),
    hospitalAddress: z.string(),
    reason: z.string(),
  }),
});

const updateDonationRequestSchema = z.object({
  body: z.object({
    status: z.enum(RequestStatus),
  }),
});

export const requestValidations = {
  createDonationRequestSchema,
  updateDonationRequestSchema,
};
