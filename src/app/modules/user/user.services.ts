/* eslint-disable @typescript-eslint/no-unused-vars */
import { bloodType } from './user.const';
import prisma from '../../utils/prisma';
import { TUser_Profile, TUserUpdate } from './user.interface';

const createUser = async (payload: TUser_Profile) => {
  // console.log(payload);
  // const { name, email, bloodType, location, availability, ...remaining } =
  //   payload;
  const { bio, age, lastDonationDate, ...remaining } = payload;
  // console.log(payload);
  const result = await prisma.user.create({
    data: {
      ...remaining,
      password: 'abcd',
      UserProfile: {
        create: {
          bio,
          age,
          lastDonationDate,
        },
      },
    },
    include: {
      UserProfile: true,
    },
  });
  return result;
  // return null;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      UserProfile: true,
    },
  });
  return result;
};
const getALLUserFromDB = async () => {
  const result = await prisma.user.findMany({
    include: {
      UserProfile: true,
    },
  });
  return result;
};

const updateUserIntoDB = async (id: string, payload: TUserUpdate) => {
  const userKeys = ['name', 'bloodType', 'location', 'availability'];
  const userProfileKeys = ['bio', 'age', 'lastDonationDate'];

  const FinalUserProfileData: Record<string, unknown> = {};
  const finalUserData: Record<string, unknown> = {};

  if (payload && Object.keys(payload).length) {
    for (const [key, value] of Object.entries(payload)) {
      if (userKeys.includes(key)) {
        finalUserData[key] = value;
      } else if (userProfileKeys.includes(key)) {
        FinalUserProfileData[key] = value;
      }
    }
  }

  // console.log({
  //   ...finalUserData,
  //   ...FinalUserProfileData,
  // });
  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      ...finalUserData,
      UserProfile: {
        update: {
          data: {
            ...FinalUserProfileData,
          },
        },
      },
    },
    include: {
      UserProfile: true,
    },
  });
  return result;
  // return null;
};

const deleteSingleUserFromDB = async (id: string) => {
  await prisma.$transaction(async (tx) => {
    const deleteUserProfile = await prisma.userProfile.delete({
      where: {
        userId: id,
      },
    });
    if (!deleteUserProfile) {
      throw new Error('user profile deletion failed');
    }
    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    if (!deleteUser) {
      throw new Error('user deletion failed');
    }
  });

  return null;
};
export const userServices = {
  createUser,
  getSingleUserFromDB,
  getALLUserFromDB,
  updateUserIntoDB,
  deleteSingleUserFromDB,
};
