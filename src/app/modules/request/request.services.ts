import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/apiError';
import prisma from '../../utils/prisma';
import { TRequest } from './request.interface';

const createRequest = async (user: JwtPayload, payload: TRequest) => {
  const requesterInfo = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!requesterInfo) {
    throw new AppError(404, 'requester not found');
  }

  const donar = await prisma.user.findFirst({
    where: {
      id: payload.donorId,
    },
  });
  if (!donar) {
    throw new AppError(404, 'donar not found');
  }
  //TODO: later i have to check is there anywhere he is already booked for giving blood
  //TODO: later check is he available
  //TODO: is his schedule free that dateofDonation time and date
  const result = await prisma.request.create({
    data: {
      ...payload,
      requesterId: requesterInfo.id,
    },
    include: {
      donor: true,
    },
  });
  return result;
};
const getAllRequest = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!userInfo) {
    throw new AppError(404, 'user not found');
  }
  const result = await prisma.request.findMany({
    where: {
      donorId: userInfo.id,
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          location: true,
          bloodType: true,
          availability: true,
        },
      },
    },
  });
  return result;
};

const updateRequest = async (
  user: JwtPayload,
  id: string,
  payload: {
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
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

  const result = await prisma.request.update({
    where: { id: id },
    data: { requestStatus: payload.status },
  });
  return result;
};
export const requestServices = {
  createRequest,
  getAllRequest,
  updateRequest,
};
