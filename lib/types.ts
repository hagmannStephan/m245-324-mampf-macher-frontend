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
