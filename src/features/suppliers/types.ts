// Types for Suppliers feature
import type { Supplier, Asset } from '@/types';

export interface CreateSupplierDTO {
  name: string;
  taxCode: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface UpdateSupplierDTO extends Partial<CreateSupplierDTO> {
  id: string;
}

export { Supplier };
