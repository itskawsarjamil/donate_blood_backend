import { BloodGroup } from '../../../../generated/prisma';

export type TUser_Profile = {
  name: string;
  email: string;
  password?: string;
  bloodType: BloodGroup;
  location: string;
  availability: boolean;
  bio: string;
  age: number;
  lastDonationDate: string;
};
