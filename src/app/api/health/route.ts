import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const health: {
    status: string;
    timestamp: string;
    services: Record<string, { status: string; message?: string }>;
  } = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      api: { status: "ok" },
      database: { status: "unknown" },
      groq: { status: process.env.GROQ_API_KEY ? "configured" : "missing_key" },
    },
  };

  // Check database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = { status: "ok" };
  } catch (error) {
    health.services.database = {
      status: "error",
      message: "Database connection failed",
    };
    health.status = "degraded";
  }

  if (!process.env.GROQ_API_KEY) {
    health.status = "degraded";
  }

  const statusCode = health.status === "ok" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
