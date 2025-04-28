/* eslint-disable @typescript-eslint/no-unused-vars */
import { bloodType, userSearchableFields } from './user.const';
import prisma from '../../utils/prisma';
import { TUser_Profile, TUserUpdate } from './user.interface';
import { Prisma } from '../../../../generated/prisma';
import { paginationHelper } from '../../utils/paginationhelper';
import bcrypt from 'bcrypt';
import AppError from '../../errors/apiError';
import { fileUploader } from '../../utils/fileUploader';

const createUser = async (payload: TUser_Profile) => {
  // console.log(payload);
  // const { name, email, bloodType, location, availability, ...remaining } =
  //   payload;
  const { bio, age, lastDonationDate, password, ...remaining } = payload;
  // console.log(payload);
  const hashedPassword = await bcrypt.hash(password, 12);
  // console.log(hashedPassword);
  const result = await prisma.user.create({
    data: {
      ...remaining,
      password: hashedPassword,
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
const getALLUserFromDB = async (
  filterQueryData: Record<string, unknown>,
  filterQueryOptions: Record<string, unknown>,
) => {
  const { searchTerm, ...remainingFilterData } = filterQueryData;
  const options = paginationHelper.calculatePagination(filterQueryOptions);
  const andCondition: Prisma.UserWhereInput[] = [];
  let orCondition: Prisma.UserWhereInput[] = [];
  if (searchTerm) {
    orCondition = userSearchableFields.map((field) => {
      return {
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      };
    });
    andCondition.push({
      OR: orCondition,
    });
  }

  if (remainingFilterData && Object.keys(remainingFilterData).length) {
    andCondition.push({
      AND: Object.keys(remainingFilterData).map((key) => ({
        [key]: {
          equals: remainingFilterData[key],
        },
      })),
    });
  }
  const whereInput: Prisma.UserWhereInput = andCondition.length
    ? { AND: andCondition }
    : {};

  const result = await prisma.user.findMany({
    where: whereInput,
    skip: options.skip,
    take: options.limit,
    include: {
      UserProfile: true,
    },
    orderBy: {
      [options.sortBy]: options.sortOrder,
    },
  });
  const total = await prisma.user.count({
    where: whereInput,
  });

  return {
    meta: {
      total,
      page: options.page,
      limit: options.limit,
    },
    result,
  };
  // return null;
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
const getMyProfile = async (email: string) => {
  const result = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      name: true,
      email: true,
      location: true,
      bloodType: true,
      availability: true,
      password: false,
      UserProfile: true,
    },
  });
  if (!result) {
    throw new AppError(404, 'user not found');
  }
  return result;
};

const updateMyProfile = async (
  file: any,
  email: string,
  payload: TUserUpdate,
) => {
  if (file) {
    const imgName = '';
    const path = file?.path;
    const uploadToCloudinary = await fileUploader.sendImageToCloudinary(path);
    const secure_url = uploadToCloudinary?.secure_url;
  }
  return null;
};
export const userServices = {
  createUser,
  getSingleUserFromDB,
  getALLUserFromDB,
  updateUserIntoDB,
  deleteSingleUserFromDB,
  getMyProfile,
  updateMyProfile,
};
