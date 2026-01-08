export type NamedEntity = {
  id: number;
  name: string;
};

export type Recipe = {
  id: number;
  name: string;
  description?: string | null;
  recipeUrl?: string | null;
  preferences: NamedEntity[];
  ingredients: NamedEntity[];
};

export type CartItem = {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
};

export type CheckoutCustomer = {
  fullName: string;
  email: string;
  address: string;
};

export type CheckoutDraft = {
  customer: CheckoutCustomer;
  items: CartItem[];
};

