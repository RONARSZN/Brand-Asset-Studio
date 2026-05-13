export type StudioMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  meta?: string;
};
