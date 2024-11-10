import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"

export const paymentRouter = router({
  createCheckoutSession: privateProcedure.mutation(
    async ({ c, ctx, input }) => {
      const { user } = ctx
      return c.json({})
    }
  ),
})
