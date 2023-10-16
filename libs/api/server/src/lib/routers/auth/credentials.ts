import { TRPCError } from '@trpc/server';
import { hash, verify as verifyHash } from 'argon2';
import { z } from 'zod';

import {
  createGetUser,
  createNewCredentialsUser,
} from '@sovereign-university/api/user';

import { publicProcedure } from '../../procedures';
import {
  contributorIdExists,
  generateUniqueContributorId,
} from '../../services/users';
import { createTRPCRouter } from '../../trpc';
import { contributorIdSchema } from '../../utils/validators';

const registerCredentialsSchema = z.object({
  username: z.string().min(6),
  password: z.string().min(8),
  email: z.string().email().optional(),
  contributor_id: contributorIdSchema.optional(),
});

const loginCredentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const credentialsAuthRouter = createTRPCRouter({
  register: publicProcedure
    .meta({ openapi: { method: 'POST', path: '/auth/credentials' } })
    .input(registerCredentialsSchema)
    .output(
      z.object({
        status: z.number(),
        message: z.string(),
        user: z.object({
          uid: z.string(),
          username: z.string(),
          email: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { dependencies, req } = ctx;
      const { postgres } = dependencies;

      const getUser = createGetUser(dependencies);

      if (await getUser({ username: input.username })) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username already exists',
        });
      }

      if (
        input.contributor_id &&
        (await contributorIdExists(postgres, input.contributor_id))
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Contributor ID already exists',
        });
      }

      const hashedPassword = await hash(input.password);
      const contributorId =
        input.contributor_id || (await generateUniqueContributorId(postgres));

      const newCredentialsUser = createNewCredentialsUser(dependencies);

      const user = await newCredentialsUser({
        username: input.username,
        passwordHash: hashedPassword,
        contributorId,
        email: input.email,
      });

      req.session.uid = user.uid;

      return {
        status: 201,
        message: 'User created',
        user: {
          uid: user.uid,
          username: user.username,
          email: user.email ?? undefined,
        },
      };
    }),
  login: publicProcedure
    .meta({ openapi: { method: 'POST', path: '/auth/credentials/login' } })
    .input(loginCredentialsSchema)
    .output(
      z.object({
        status: z.number(),
        message: z.string(),
        user: z.object({
          uid: z.string(),
          username: z.string(),
          email: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { dependencies, req } = ctx;

      const getUser = createGetUser(dependencies);

      const user = await getUser({
        username: input.username,
      });

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      if (!user.password_hash) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This user has no password, try another login method',
        });
      }

      if (!(await verifyHash(user.password_hash, input.password))) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      req.session.uid = user.uid;

      return {
        status: 200,
        message: 'Logged in',
        user: {
          uid: user.uid,
          username: user.username,
          email: user.email ?? undefined,
        },
      };
    }),
});
