import { PERSON, USER } from "./USER";

type DateTime = string; // Assuming DateTime is a string type in your system

export interface ORGANIZATION {
  id: string;
  name: string;
  city?: string | null;
  notes?: string | null;
  createdAt: DateTime;
  createdBy?: USER;
  lastModifiedBy?: USER;
  lastModified: Date;
  heads: PERSON[];
  schools: SCHOOL[];
}

export interface SCHOOL {
  id: string;
  name: string;
  city: string;
  state: string;
  organizationId?: string;
  headId?: string | null;
  notes?: string | null;
  createdAt: Date;
  lastModified: Date;
  createdBy?: USER;
  lastModifiedBy?: USER;
  heads: PERSON[];
  organization?: ORGANIZATION;
}
