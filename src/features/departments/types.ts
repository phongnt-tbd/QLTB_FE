// Types for Departments feature
import type { Department } from '@/types';

export interface CreateDepartmentDTO {
  name: string;
  code: string;
  description: string;
}

export interface UpdateDepartmentDTO extends Partial<CreateDepartmentDTO> {
  id: string;
}

export { Department };
