import type { OompaLoompa, MinimalOompaLoompa } from "../types";

export const extractMinimalData = (
  items: OompaLoompa[]
): MinimalOompaLoompa[] =>
  items.map(({ id, first_name, last_name, gender, profession, image }) => ({
    id,
    first_name,
    last_name,
    gender,
    profession,
    image,
  }));

export const validateCharacterDetail = (
  detail: unknown
): detail is OompaLoompa => {
  return (
    detail !== null &&
    detail !== undefined &&
    typeof detail === "object" &&
    typeof (detail as OompaLoompa).first_name === "string" &&
    typeof (detail as OompaLoompa).last_name === "string"
  );
};

export const removeDuplicates = <T extends { id: number }>(
  existing: T[],
  newItems: T[]
): T[] => {
  const existingIds = new Set(existing.map((item) => item.id));
  return newItems.filter((item) => !existingIds.has(item.id));
};
