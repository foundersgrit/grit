"use server";

import { prisma } from "@/lib/prisma";

export async function testDatabase() {
  try {
    // Attempt to count users to verify connection
    const userCount = await prisma.user.count();
    return { success: true, count: userCount, message: "Connection established." };
  } catch (error: any) {
    console.error("Database Connection Check Failed:", error);
    return { success: false, error: error.message };
  }
}
