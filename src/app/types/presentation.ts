import { Presentation } from "@prisma/client";

export type PresentationCardType = Pick<Presentation,"id"|"title"|"link">;

