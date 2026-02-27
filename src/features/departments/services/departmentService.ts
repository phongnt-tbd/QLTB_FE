import { Department, CreateDepartmentDTO, UpdateDepartmentDTO } from '../types';

export const departmentService = {
  /**
   * Validate department data
   */
  validate: (dto: Partial<CreateDepartmentDTO>): string[] => {
    const errors: string[] = [];

    if (!dto.name?.trim()) {
      errors.push('Tên đơn vị không được để trống');
    }

    if (!dto.code?.trim()) {
      errors.push('Mã đơn vị không được để trống');
    } else if (dto.code.length > 10) {
      errors.push('Mã đơn vị không quá 10 ký tự');
    }

    return errors;
  },

  /**
   * Create new department
   */
  create: (dto: CreateDepartmentDTO): Department => {
    return {
      id: `d${Date.now()}`,
      name: dto.name,
      code: dto.code.toUpperCase(),
      managerId: '1',
      description: dto.description || '',
    };
  },

  /**
   * Update department
   */
  update: (department: Department, dto: Partial<CreateDepartmentDTO>): Department => {
    return {
      ...department,
      name: dto.name || department.name,
      code: dto.code?.toUpperCase() || department.code,
      description: dto.description !== undefined ? dto.description : department.description,
    };
  },

  /**
   * Check if department can be deleted
   */
  canDelete: (departmentId: string, usedInAssets: boolean): boolean => {
    return !usedInAssets;
  },
};
