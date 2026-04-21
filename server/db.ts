import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, operatorData, chatMessages, operators, modules, OperatorData, ChatMessage, Operator, Module, InsertOperatorData, InsertChatMessage, InsertOperator, InsertModule } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function addOperatorData(userId: number, data: InsertOperatorData): Promise<OperatorData | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(operatorData).values({
      ...data,
      userId,
    });
    return result as any;
  } catch (error) {
    console.error("[Database] Failed to add operator data:", error);
    throw error;
  }
}

export async function getOperatorDataByUser(userId: number): Promise<OperatorData[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(operatorData).where(eq(operatorData.userId, userId)).orderBy(desc(operatorData.data));
  } catch (error) {
    console.error("[Database] Failed to get operator data:", error);
    return [];
  }
}

export async function updateOperatorData(id: number, userId: number, data: Partial<InsertOperatorData>): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.update(operatorData).set(data).where(and(eq(operatorData.id, id), eq(operatorData.userId, userId)));
  } catch (error) {
    console.error("[Database] Failed to update operator data:", error);
    throw error;
  }
}

export async function deleteOperatorData(id: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.delete(operatorData).where(and(eq(operatorData.id, id), eq(operatorData.userId, userId)));
  } catch (error) {
    console.error("[Database] Failed to delete operator data:", error);
    throw error;
  }
}

export async function addChatMessage(userId: number, message: InsertChatMessage): Promise<ChatMessage | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(chatMessages).values({
      ...message,
      userId,
    });
    return result as any;
  } catch (error) {
    console.error("[Database] Failed to add chat message:", error);
    throw error;
  }
}

export async function getChatMessagesByUser(userId: number): Promise<ChatMessage[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId)).orderBy(desc(chatMessages.timestamp));
  } catch (error) {
    console.error("[Database] Failed to get chat messages:", error);
    return [];
  }
}

export async function getAllOperators(): Promise<Operator[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(operators);
  } catch (error) {
    console.error("[Database] Failed to get operators:", error);
    return [];
  }
}

export async function addOperator(name: string): Promise<Operator | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(operators).values({ name });
    return result as any;
  } catch (error) {
    console.error("[Database] Failed to add operator:", error);
    throw error;
  }
}

export async function getAllModules(): Promise<Module[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(modules);
  } catch (error) {
    console.error("[Database] Failed to get modules:", error);
    return [];
  }
}

export async function addModule(name: string): Promise<Module | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(modules).values({ name });
    return result as any;
  } catch (error) {
    console.error("[Database] Failed to add module:", error);
    throw error;
  }
}
