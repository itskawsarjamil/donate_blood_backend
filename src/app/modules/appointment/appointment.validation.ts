import { z } from 'zod';

const createAppointmentSchema = z.object({
  body: z
    .object({
      bloodRequestId: z.string(),
      needTransportFee: z.boolean(),
      transportFee: z.number().optional(),
    })
    .refine(
      (body) => {
        if (!body.needTransportFee) {
          return true;
        } else if (body.needTransportFee) {
          if (typeof body.transportFee == 'number' && body.transportFee >= 0) {
            return true;
          }
        } else {
          return false;
        }
      },
      {
        message: 'transport fee must be added  ',
      },
    ),
});

// const updateAppointmentSchema = z.object({
//   body: z.object({
//     status: z.enum(RequestStatus),
//   }),
// });

export const appointmentValidations = { createAppointmentSchema };
