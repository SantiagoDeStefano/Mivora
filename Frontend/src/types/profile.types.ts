export interface Profile {
  name: string;
  email: string;
  avatar_url: string;
  verified: "verified" | "unverified";
  role: "attendee" | "organizer";
}
