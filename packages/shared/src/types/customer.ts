export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string; // ISO 8601
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
}
