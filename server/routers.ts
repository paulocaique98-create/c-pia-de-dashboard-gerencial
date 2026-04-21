import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  operatorData: router({
    list: protectedProcedure.query(({ ctx }) => db.getOperatorDataByUser(ctx.user.id)),
    add: protectedProcedure
      .input(z.object({
        data: z.string().transform(d => new Date(d)),
        operador: z.string(),
        leads: z.number().int().default(0),
        ligacoes: z.number().int().default(0),
        atendidas: z.number().int().default(0),
        reunioesAgendadas: z.number().int().default(0),
        reunioesRealizadas: z.number().int().default(0),
        vendas: z.number().int().default(0),
        noShow: z.number().int().default(0),
        mrr: z.string().default("0.00"),
      }))
      .mutation(({ ctx, input }) => db.addOperatorData(ctx.user.id, input as any)),
    update: protectedProcedure
      .input(z.object({
        id: z.number().int(),
        data: z.object({
          data: z.string().transform(d => new Date(d)).optional(),
          operador: z.string().optional(),
          leads: z.number().int().optional(),
          ligacoes: z.number().int().optional(),
          atendidas: z.number().int().optional(),
          reunioesAgendadas: z.number().int().optional(),
          reunioesRealizadas: z.number().int().optional(),
          vendas: z.number().int().optional(),
          noShow: z.number().int().optional(),
          mrr: z.string().optional(),
        }),
      }))
      .mutation(({ ctx, input }) => db.updateOperatorData(input.id, ctx.user.id, input.data as any)),
    delete: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(({ ctx, input }) => db.deleteOperatorData(input.id, ctx.user.id)),
  }),

  chatMessages: router({
    list: protectedProcedure.query(({ ctx }) => db.getChatMessagesByUser(ctx.user.id)),
    add: protectedProcedure
      .input(z.object({
        sender: z.string(),
        text: z.string(),
      }))
      .mutation(({ ctx, input }) => db.addChatMessage(ctx.user.id, input as any)),
  }),

  operators: router({
    list: protectedProcedure.query(() => db.getAllOperators()),
    add: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(({ input }) => db.addOperator(input.name)),
  }),

  modules: router({
    list: protectedProcedure.query(() => db.getAllModules()),
    add: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(({ input }) => db.addModule(input.name)),
  }),
});

export type AppRouter = typeof appRouter;
