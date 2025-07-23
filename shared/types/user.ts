export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  yearsExperience: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillName: string;
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  createdAt: Date;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  phone?: string;
  yearsExperience: number;
  skills?: string[];
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  yearsExperience?: number;
  skills?: string[];
}

export interface UserWithSkills extends User {
  skills: UserSkill[];
} 