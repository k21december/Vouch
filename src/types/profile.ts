export type Profile = {
  id: string;
  handle: string;
  space: "SWE" | "Finance" | "Engineering";
  role: string;
  location: string;
  skills: string[];
  about: string;
};
