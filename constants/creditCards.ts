import type { CategoryId } from "@/types/expense";

export type CreditCardId = "icici-coral" | "amazon-pay-icici";

export interface CreditCardMeta {
  id: CreditCardId;
  categoryId: CategoryId; // must match the category string written to the sheet
  name: string;
  gradient: readonly [string, string];
  accentColor: string;
}

// Static for now — adding a third card later means adding one entry here
// plus one CategoryMeta entry in constants/categories.ts, nothing else.
export const CREDIT_CARDS: CreditCardMeta[] = [
  {
    id: "icici-coral",
    categoryId: "ICICI Coral",
    name: "ICICI Coral",
    gradient: ["#FF8A65", "#B33A2E"],
    accentColor: "#FF6F61",
  },
  {
    id: "amazon-pay-icici",
    categoryId: "Amazon Pay ICICI",
    name: "Amazon Pay ICICI",
    gradient: ["#22B8E8", "#0B3D66"],
    accentColor: "#00A8E8",
  },
];

const CARD_MAP = new Map(CREDIT_CARDS.map((c) => [c.id, c]));
const CATEGORY_TO_CARD = new Map(CREDIT_CARDS.map((c) => [c.categoryId, c]));

export function getCardMeta(id: CreditCardId): CreditCardMeta {
  const meta = CARD_MAP.get(id);
  if (!meta) throw new Error(`Unknown credit card id: ${id}`);
  return meta;
}

// For route params, which arrive as plain (unvalidated) strings.
export function findCardMeta(id?: string): CreditCardMeta | undefined {
  if (!id) return undefined;
  return CARD_MAP.get(id as CreditCardId);
}

export function getCardByCategory(category?: string): CreditCardMeta | undefined {
  if (!category) return undefined;
  return CATEGORY_TO_CARD.get(category as CategoryId);
}

export function isCreditCardCategory(category?: string): boolean {
  return getCardByCategory(category) !== undefined;
}
