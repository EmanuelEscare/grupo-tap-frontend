export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductPayload {
  name: string;
  brand: string;
  price: number;
}
