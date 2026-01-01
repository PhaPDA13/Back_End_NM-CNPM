import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

const prismaClient = new PrismaClient({ adapter });

/** Models có ownerId (multi-tenant) */
const TENANT_MODELS = ["Agent", "ExportNote", "Receipt"];

/** Models có soft-delete */
const SOFT_DELETE_MODELS = ["Agent"];

/**
 * Prisma Client với multi-tenant support
 *
 * @example
 * // Dùng với tenant filter
 * const agents = await prisma(userId).agent.findMany();
 *
 * // Dùng không có tenant filter (shared data hoặc admin)
 * const districts = await prisma().district.findMany();
 */
export const prisma = (ownerId = null) => {
  return prismaClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const isTenantModel = TENANT_MODELS.includes(model);
          const isSoftDeleteModel = SOFT_DELETE_MODELS.includes(model);
          const hasOwner = ownerId && isTenantModel;

          // Read operations
          if (
            [
              "findMany",
              "findFirst",
              "findUnique",
              "findFirstOrThrow",
              "findUniqueOrThrow",
              "count",
              "aggregate",
              "groupBy",
            ].includes(operation)
          ) {
            if (hasOwner) args.where = { ...args.where, ownerId };
            if (isSoftDeleteModel) args.where = { ...args.where, isDeleted: false };
          }

          // Write operations
          if (["update", "updateMany", "delete", "deleteMany"].includes(operation)) {
            if (hasOwner) args.where = { ...args.where, ownerId };
            if (isSoftDeleteModel) args.where = { ...args.where, isDeleted: false };
          }

          // Create
          if (operation === "create" && hasOwner) {
            args.data = { ...args.data, ownerId };
          }

          // CreateMany
          if (operation === "createMany" && hasOwner) {
            args.data = Array.isArray(args.data)
              ? args.data.map((item) => ({ ...item, ownerId }))
              : { ...args.data, ownerId };
          }

          // Upsert
          if (operation === "upsert" && hasOwner) {
            args.where = { ...args.where, ownerId };
            args.create = { ...args.create, ownerId };
          }

          return query(args);
        },
      },
    },
  });
};

/** Client gốc - không có filter */
export const prismaRaw = prismaClient;
