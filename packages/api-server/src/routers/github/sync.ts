import { z } from 'zod';

import { createProcessChangedFiles } from '@sovereign-academy/content';
import { getAllRepoFiles } from '@sovereign-academy/github';

import { publicProcedure } from '../../trpc';

// TODO: Protect this endpoint (admin only when we have roles)
export const syncProcedure = publicProcedure
  .meta({ openapi: { method: 'POST', path: '/github/sync' } })
  .input(z.void())
  .output(z.void())
  .mutation(async ({ ctx }) => {
    const processChangedFiles = createProcessChangedFiles(ctx.dependencies);

    await getAllRepoFiles(
      'https://github.com/DecouvreBitcoin/sovereign-university-data.git'
    ).then(processChangedFiles);
  });
