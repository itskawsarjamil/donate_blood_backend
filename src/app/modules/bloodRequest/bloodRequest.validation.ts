import { z } from 'zod';
import { RequestStatus } from './bloodRequest.const';

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
    return regex.test(time);
  },
  {
    message: 'Invalid time format , expected "HH:MM" in 24 hours format',
  },
);
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const createDonationRequestSchema = z.object({
  body: z
    .object({
      requesterPhoneNumber: z.string(),
      dateOfDonation: z.string().regex(dateRegex, {
        message: 'Date must be in YYYY-MM-DD format',
      }),
      timeOfDonation: timeStringSchema,
      hospitalName: z.string(),
      hospitalAddress: z.string(),
      reason: z.string(),
    })
    .refine(
      (body) => {
        const givenDate = new Date(
          `${body.dateOfDonation}T${body.timeOfDonation}Z`,
        );
        const today = new Date();
        return givenDate > today;
      },
      {
        message: 'date and time should be after present time !  ',
      },
    ),
});

const updateDonationRequestSchema = z.object({
  body: z.object({
    status: z.enum(RequestStatus),
  }),
});

export const bloodRequestValidations = {
  createDonationRequestSchema,
  updateDonationRequestSchema,
};
