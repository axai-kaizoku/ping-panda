import { db } from "@/db"
import {
  CATEGORY_NAME_VALIDATOR,
  EVENT_CATEGORY_VALIDATOR,
} from "@/lib/validators/category-validators"
import { startOfMonth } from "date-fns"
import { z } from "zod"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { parseColor } from "@/utils"
import { HTTPException } from "hono/http-exception"

export const categoryRouter = router({
  getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
    const categories = await db.eventCategory.findMany({
      where: { userId: ctx.user.id },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: { updatedAt: "desc" },
    })

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const now = new Date()
        const firstDayOfMonth = startOfMonth(now)

        const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all([
          db.event
            .findMany({
              where: {
                EventCategory: { id: category.id },
                createdAt: { gte: firstDayOfMonth },
              },
              select: { fields: true },
              distinct: ["fields"],
            })
            .then((events) => {
              const fieldNames = new Set<string>()
              events.forEach((event) => {
                Object.keys(event.fields as Object).forEach((fieldName) => {
                  fieldNames.add(fieldName)
                })
              })

              return fieldNames.size
            }),
          db.event.count({
            where: {
              EventCategory: { id: category.id },
              createdAt: { gte: firstDayOfMonth },
            },
          }),
          db.event.findFirst({
            where: { EventCategory: { id: category.id } },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ])

        return {
          ...category,
          uniqueFieldCount,
          lastPing: lastPing?.createdAt || null,
          eventsCount,
        }
      })
    )

    return c.superjson({ categories: categoriesWithCounts })
  }),

  deleteCategory: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      const { name } = input

      await db.eventCategory.delete({
        where: { name_userId: { name, userId: ctx.user.id } },
      })

      return c.json({ success: true })
    }),

  createEventCategory: privateProcedure
    .input(EVENT_CATEGORY_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { color, name, emoji } = input

      // TODO: ADD PAIN PLAN LOGIC

      const eventCategory = await db.eventCategory.create({
        data: {
          name: name.toLocaleLowerCase(),
          color: parseColor(color),
          emoji,
          userId: user.id,
        },
      })

      return c.json({ eventCategory })
    }),

  insertQuickstartCategories: privateProcedure.mutation(async ({ c, ctx }) => {
    const categories = await db.eventCategory.createMany({
      data: [
        { name: "Bug", emoji: "🐞", color: 0xff6b6b },
        { name: "Sale", emoji: "💰", color: 0xffeb3b },
        { name: "Question", emoji: "🤔", color: 0x6c5ce7 },
      ].map((category) => ({
        ...category,
        userId: ctx.user.id,
      })),
    })

    return c.json({ success: true, count: categories.count })
  }),

  pollCategory: privateProcedure
    .input(z.object({ name: CATEGORY_NAME_VALIDATOR }))
    .query(async ({ c, ctx, input }) => {
      const { name } = input
      const category = await db.eventCategory.findUnique({
        where: { name_userId: { name, userId: ctx.user.id } },
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
      })

      if (!category)
        throw new HTTPException(404, {
          message: `Category "${name}" not found`,
        })

      const hasEvents = category._count.events > 0

      return c.json({ hasEvents })
    }),
})