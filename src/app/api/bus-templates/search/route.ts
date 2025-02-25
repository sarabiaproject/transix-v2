import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const companyId = searchParams.get("companyId");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    
    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }
    
    const whereClause: Prisma.BusTypeTemplateWhereInput = {
      name: { contains: query, mode: 'insensitive' },
      isActive: true,
    };
    
    if (companyId) {
      whereClause.companyId = companyId;
    }
    
    const templates = await prisma.busTypeTemplate.findMany({
      where: whereClause,
      include: {
        company: true,
      },
      take: limit,
      orderBy: {
        name: "asc",
      },
    });
    
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error searching bus templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 