import { Secret } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/apiError';
import { jwtHelper } from '../../utils/jwtHelper';
import prisma from '../../utils/prisma';
import bcrypt from 'bcrypt';
import sendEmail from '../../utils/sendEmail';
const login = async (payload: { identifier: string; password: string }) => {
  //   console.log(payload);
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          id: payload.identifier,
        },
        {
          email: payload.identifier,
        },
      ],
    },
  });
  if (!user) {
    throw new AppError(404, 'user not found');
  }
  const comparePass = await bcrypt.compare(payload.password, user.password);
  //   console.log(comparePass);
  if (!comparePass) {
    throw new AppError(400, 'password do not matched');
  }
  const accessToken = jwtHelper.generateToken(
    {
      email: user.email,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );
  const refreshToken = jwtHelper.generateToken(
    {
      email: user.email,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret,
    );
  } catch (err) {
    throw new Error('You are not authorized!');
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
    },
  });

  const accessToken = jwtHelper.generateToken(
    {
      email: userData.email,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );
  return {
    accessToken,
  };
};

const changePassword = async (
  userData: any,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await prisma.user.findFirst({
    where: {
      email: userData.email,
    },
  });

  const comparePass = bcrypt.compare(
    user?.password as string,
    payload.oldPassword,
  );
  if (!comparePass) {
    throw new AppError(404, 'unauthorized access');
  }
  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: {
      email: user?.email,
    },
    data: {
      password: hashedPassword,
    },
    include: {
      UserProfile: true,
    },
  });

  return null;
};

const forgetPassword = async (payload: { id: string }) => {
  const userData = await prisma.user.findFirst({
    where: {
      id: payload.id,
    },
  });
  if (!userData) {
    throw new AppError(404, 'user not found');
  }
  const newTempToken = jwtHelper.generateToken(
    { email: userData.email },
    config.jwt.jwt_secret as string,
    '5m',
  );
  const resetPassLink = `${config.reset_pass_link}?id=${userData.id}&token=${newTempToken}`;
  sendEmail(
    userData.email,
    `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `,
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string },
) => {
  //   console.log({ token, payload });

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
    },
  });

  if (!userData) {
    throw new AppError(404, 'user not found');
  }

  const isValidToken = jwtHelper.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret,
  );

  if (!isValidToken) {
    throw new AppError(403, 'Forbidden!');
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};

export const authServices = {
  login,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
