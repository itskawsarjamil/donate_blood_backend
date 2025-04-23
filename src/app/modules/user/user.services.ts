import prisma from '../../utils/prisma';
import { TUser_Profile } from './user.interface';

const createUser = async (payload: TUser_Profile) => {
  console.log(payload);
  // const { name, email, bloodType, location, availability, ...remaining } =
  //   payload;
  // console.log(payload);
  // const result = await prisma.user.create({
  //   data: {
  //     name,
  //     email,
  //     bloodType,
  //     location,
  //     availability,
  //     password: 'asdfgh',
  //     UserProfile: {
  //       create: {},
  //     },
  //   },
  // });
  // return result;
  return null;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};
const getALLUserFromDB = async () => {
  const result = await prisma.user.findMany({});
  return result;
};

const updateUserIntoDB = async (id: string, payload) => {
  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: payload,
  });
  return result;
};

const deleteSingleUserFromDB = async (id: string) => {};
export const userServices = {
  createUser,
  getSingleUserFromDB,
  getALLUserFromDB,
  updateUserIntoDB,
  deleteSingleUserFromDB,
};
