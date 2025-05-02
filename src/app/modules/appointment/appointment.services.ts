import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/apiError';
import prisma from '../../utils/prisma';
import { AppointmentStatus, RequestStatus } from '../../../../generated/prisma';
import { TAppointment } from './appointment.interface';
import { v4 as uuidv4 } from 'uuid';
const createAppointment = async (user: JwtPayload, payload: TAppointment) => {
  const donorInfo = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!donorInfo) {
    throw new AppError(404, 'your token is not valid');
  }
  const bloodRequestInfo = await prisma.bloodRequest.findFirst({
    where: {
      id: payload.bloodRequestId,
    },
  });
  if (!bloodRequestInfo) {
    throw new AppError(404, 'the request of blood is not found');
  }
  const videoCallingId = uuidv4();
  const result = await prisma.appointment.create({
    data: {
      ...payload,
      donorId: donorInfo.id,
      videoCallingId,
      requesterId: bloodRequestInfo.requesterId,
    },
    select: {
      Payment: true,
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          bloodType: true,
          location: true,
          availability: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      bloodRequest: true,
      donor: {
        select: {
          id: true,
          name: true,
          email: true,
          bloodType: true,
          location: true,
          availability: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return result;
};
const getAllAppointmentofMyReq = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!userInfo) {
    throw new AppError(404, 'user not found');
  }
  const result = await prisma.appointment.findMany({
    where: {
      AND: [
        {
          appointmentStatus: AppointmentStatus.PENDING,
        },
        {
          requesterId: userInfo.id,
        },
      ],
    },
  });
  return result;
};

const getAllMyAppointmentsofMyDonation = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!userInfo) {
    throw new AppError(404, 'user not found');
  }
  const result = await prisma.appointment.findMany({
    where: {
      donorId: userInfo.id,
    },
  });
  return result;
};
const getTheCurrentAppointmentOfmyDonation = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!userInfo) {
    throw new AppError(404, 'user not found');
  }
  const result = await prisma.appointment.findMany({
    where: {
      AND: [
        {
          appointmentStatus: AppointmentStatus.PENDING,
        },
        {
          donorId: userInfo.id,
        },
      ],
    },
  });
  return result;
};

const updateSingleAppointmentofMyRequest = async (
  user: JwtPayload,
  appointmentId: string,
  payload: {
    appointmentStatus:
      | 'PENDING'
      | 'SCHEDULED'
      | 'INPROGRESS'
      | 'COMPLETED'
      | 'CANCELED';
  },
) => {
  const userInfo = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!userInfo) {
    throw new AppError(404, 'user not found');
  }

  const appointmentInfo = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
    },
  });
  if (!appointmentInfo) {
    throw new AppError(404, 'appointmentInfo not found');
  }
  if (userInfo.id !== appointmentInfo.requesterId) {
    throw new AppError(404, 'you are not authorized');
  }
  const requestStatus =
    payload.appointmentStatus == 'CANCELED' ? 'REJECTED' : 'APPROVED';
  const today = new Date();

  const transactionId =
    'donate-blood-' +
    today.getFullYear() +
    '-' +
    today.getMonth() +
    '-' +
    today.getDay() +
    '-' +
    today.getHours() +
    '-' +
    today.getMinutes();

  const result = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      appointmentStatus: payload.appointmentStatus,
      bloodRequest: {
        update: {
          data: {
            requestStatus: requestStatus,
          },
        },
      },
      Payment: {
        create: {
          amount: appointmentInfo.transportFee as number,
          transactionId,
        },
      },
    },
    include: {
      bloodRequest: true,
      Payment: true,
    },
  });
  return result;
};
export const appointmentServices = {
  createAppointment,
  getAllAppointmentofMyReq,
  getAllMyAppointmentsofMyDonation,
  getTheCurrentAppointmentOfmyDonation,
  updateSingleAppointmentofMyRequest,
};
