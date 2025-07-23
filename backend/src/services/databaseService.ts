import { prisma } from '@/config/database';
import type { Prisma } from '@prisma/client';
import { CreateUserRequest, UpdateUserRequest } from '@/types/shared';

export class DatabaseService {
  // User operations
  async createUser(data: CreateUserRequest): Promise<Prisma.UserGetPayload<{ include: { skills: true } }>> {
    const { skills, ...userData } = data;
    
    return await prisma.user.create({
      data: {
        ...userData,
        skills: {
          create: skills?.map((skill: string) => ({
            skillName: skill.trim()
          })) || []
        }
      },
      include: {
        skills: true
      }
    });
  }

  async getUserById(id: string): Promise<Prisma.UserGetPayload<{ include: { skills: true } }> | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        skills: true
      }
    });
  }

  async getUserByEmail(email: string): Promise<Prisma.UserGetPayload<{ include: { skills: true } }> | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        skills: true
      }
    });
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<Prisma.UserGetPayload<{ include: { skills: true } }>> {
    const { skills, ...userData } = data;
    
    // Delete existing skills if new ones provided
    if (skills !== undefined) {
      await prisma.userSkill.deleteMany({
        where: { userId: id }
      });
    }

    return await prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(skills && {
          skills: {
            create: skills.map((skill: string) => ({
              skillName: skill.trim()
            }))
          }
        })
      },
      include: {
        skills: true
      }
    });
  }

  // CV Upload operations
  async createCVUpload(data: {
    userId: string;
    fileName: string;
    filePath: string;
    fileSize: number;
  }): Promise<any> {
    return await prisma.cVUpload.create({
      data
    });
  }

  async getCVUploadsByUserId(userId: string): Promise<any[]> {
    return await prisma.cVUpload.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getCVUploadById(id: string): Promise<any | null> {
    return await prisma.cVUpload.findUnique({
      where: { id }
    });
  }

  async deleteCVUpload(id: string): Promise<void> {
    await prisma.cVUpload.delete({
      where: { id }
    });
  }

  // Validation Result operations
  async createValidationResult(data: {
    userId: string;
    isValid: boolean;
    mismatchedFields: any[];
    confidenceScore: number;
  }): Promise<any> {
    return await prisma.validationResult.create({
      data: {
        ...data,
        mismatchedFields: data.mismatchedFields as any
      }
    });
  }

  async getValidationResultsByUserId(userId: string): Promise<any[]> {
    return await prisma.validationResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getValidationResultById(id: string): Promise<any | null> {
    return await prisma.validationResult.findUnique({
      where: { id }
    });
  }

  async getLatestValidationResult(userId: string): Promise<any | null> {
    return await prisma.validationResult.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Statistics
  async getValidationStats(userId: string) {
    const results = await prisma.validationResult.findMany({
      where: { userId }
    });

    const total = results.length;
    const successful = results.filter((r: any) => r.isValid).length;
    const averageConfidence = results.length > 0 
      ? results.reduce((sum: number, r: any) => sum + r.confidenceScore, 0) / results.length 
      : 0;

    return {
      total,
      successful,
      failed: total - successful,
      averageConfidence,
      successRate: total > 0 ? (successful / total) * 100 : 0
    };
  }
} 