import { j } from "./__internals/j"

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */

const authMiddleware = j.middleware(({ next }) => {
  const user = { name: "john" }
  return next({})
})

export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure

export const privateProcedure = publicProcedure.use(authMiddleware)
