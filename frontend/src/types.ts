import { z } from "zod";
import { loginSchema } from "./schema";

export type Login = z.infer<typeof loginSchema>;
