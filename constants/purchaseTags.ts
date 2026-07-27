export interface PurchaseTag {
  id: string;
  label: string;
  icon: string; // Ionicons name
  color: string;
  keywords: string[]; // lowercase substrings matched against the expense description
}

// The sheet has no "what kind of purchase" field for card expenses — the
// `category` column is already spent on identifying *which card* was used.
// This is a best-effort heuristic that guesses a purchase type from the
// free-text expense description, so the Credit Card screens can still show
// a category breakdown. It WILL misclassify unfamiliar merchant names —
// anything that matches nothing falls into "Uncategorized" rather than a
// silent wrong guess.
export const PURCHASE_TAGS: PurchaseTag[] = [
  {
    id: "food",
    label: "Food & Dining",
    icon: "fast-food-outline",
    color: "#FB923C",
    keywords: ["zomato", "swiggy", "restaurant", "cafe", "dominos", "pizza", "starbucks", "mcdonald", "kfc", "burger", "dine", "food"],
  },
  {
    id: "grocery",
    label: "Grocery",
    icon: "cart-outline",
    color: "#2DD4BF",
    keywords: ["bigbasket", "blinkit", "zepto", "dmart", "grofers", "instamart", "grocery", "supermarket"],
  },
  {
    id: "transport",
    label: "Transport",
    icon: "car-outline",
    color: "#818CF8",
    keywords: ["uber", "ola", "rapido", "metro", "taxi", "cab", "auto", "irctc", "train"],
  },
  {
    id: "fuel",
    label: "Fuel",
    icon: "flame-outline",
    color: "#F87171",
    keywords: ["petrol", "diesel", "fuel", "hpcl", "iocl", "bpcl", "shell"],
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: "bag-handle-outline",
    color: "#38BDF8",
    keywords: ["amazon", "flipkart", "myntra", "ajio", "meesho", "nykaa", "shopping", "mall"],
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: "film-outline",
    color: "#F472B6",
    keywords: ["netflix", "hotstar", "prime video", "spotify", "bookmyshow", "movie", "cinema", "pvr", "inox"],
  },
  {
    id: "travel",
    label: "Travel",
    icon: "airplane-outline",
    color: "#A78BFA",
    keywords: ["flight", "airbnb", "hotel", "makemytrip", "goibibo", "oyo", "yatra", "trip", "travel"],
  },
  {
    id: "bills",
    label: "Bills & Utilities",
    icon: "receipt-outline",
    color: "#FB7185",
    keywords: ["electricity", "recharge", "broadband", "wifi", "dth", "water bill", "gas bill", "insurance", "emi"],
  },
  {
    id: "health",
    label: "Health",
    icon: "medkit-outline",
    color: "#4ADE80",
    keywords: ["pharmacy", "hospital", "doctor", "medical", "medicine", "apollo", "pharmeasy", "1mg"],
  },
  {
    id: "subscriptions",
    label: "Subscriptions",
    icon: "sync-outline",
    color: "#C084FC",
    keywords: ["subscription", "membership", "icloud", "google one"],
  },
];

export const UNCATEGORIZED_TAG: PurchaseTag = {
  id: "uncategorized",
  label: "Uncategorized",
  icon: "help-circle-outline",
  color: "#94A3B8",
  keywords: [],
};

export function classifyPurchase(description: string): PurchaseTag {
  const text = description.toLowerCase();
  for (const tag of PURCHASE_TAGS) {
    if (tag.keywords.some((keyword) => text.includes(keyword))) return tag;
  }
  return UNCATEGORIZED_TAG;
}
