import { Supplier, CreateSupplierDTO } from '../types';

export const supplierService = {
  validate: (dto: Partial<CreateSupplierDTO>): string[] => {
    const errors: string[] = [];
    if (!dto.name?.trim()) errors.push('Tên nhà cung cấp không được để trống');
    if (!dto.taxCode?.trim()) errors.push('Mã số thuế không được để trống');
    if (!dto.contactPerson?.trim()) errors.push('Người đại diện không được để trống');
    if (!dto.phone?.trim()) errors.push('Số điện thoại không được để trống');
    if (!dto.email?.trim()) {
      errors.push('Email không được để trống');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
      errors.push('Email không hợp lệ');
    }
    return errors;
  },

  create: (dto: CreateSupplierDTO): Supplier => ({
    id: `s${Date.now()}`,
    name: dto.name,
    taxCode: dto.taxCode,
    contactPerson: dto.contactPerson,
    phone: dto.phone,
    email: dto.email,
  }),

  update: (supplier: Supplier, dto: Partial<CreateSupplierDTO>): Supplier => ({
    ...supplier,
    ...dto,
  }),
};
