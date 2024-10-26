import { Presentation } from "@prisma/client";

export type PresentationCardType = Omit<Presentation,"userId">;

