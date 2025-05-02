import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/apiError';
import prisma from '../../utils/prisma';
import { TRequest } from './bloodRequest.interface';
import { RequestStatus } from '../../../../generated/prisma';

const createBloodRequest = async (user: JwtPayload, payload: TRequest) => {
  // console.log(payload);
  const requesterInfo = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!requesterInfo) {
    throw new AppError(404, 'requester not found');
  }
  const result = await prisma.bloodRequest.create({
    data: {
      ...payload,
      requesterId: requesterInfo.id,
    },
    include: {
      requester: true,
    },
  });
  return result;
};
const getAllBloodRequest = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!userInfo) {
    throw new AppError(404, 'user not found');
  }

  const result = await prisma.bloodRequest.findMany({
    where: {
      AND: [
        {
          requestStatus: RequestStatus.PENDING,
        },
        {
          dateOfDonation: {
            gte: new Date(),
          },
        },
      ],
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

const updateBloodRequest = async (
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

  const result = await prisma.bloodRequest.update({
    where: { id: id },
    data: { requestStatus: payload.status },
  });
  return result;
};
export const requestServices = {
  createBloodRequest,
  getAllBloodRequest,
  updateBloodRequest,
};
