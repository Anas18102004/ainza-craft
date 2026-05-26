import { z } from "zod";

export const serviceInterestOptions = [
  "AI Systems & Automation",
  "Cybersecurity",
  "Apps / Web & Mobile",
  "Digital Platforms",
  "Cloud & DevOps",
  "Strategy",
  "Not sure yet",
] as const;

export const budgetRangeOptions = [
  "Under $5k",
  "$5k - $15k",
  "$15k - $50k",
  "$50k+",
  "Need guidance",
] as const;

export const leadInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email.").max(180),
  company: z.string().trim().max(160).optional().default(""),
  serviceInterest: z.enum(serviceInterestOptions),
  budgetRange: z.enum(budgetRangeOptions),
  message: z.string().trim().min(20, "Tell us a little more about the project.").max(2000),
  sourcePath: z.string().trim().min(1).max(240).default("/contact"),
});

export type LeadInput = z.infer<typeof leadInputSchema>;
