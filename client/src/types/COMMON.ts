import { USER } from "./USER";

type DateTime = string; // Assuming DateTime is a string type in your system

export interface Head {
  id: string;
 name: string;
  gender: string;
  organizationId?: string | null;
  createdAt: DateTime;
  updatedAt: DateTime;
  organization?: ORGANIZATION | null;
  school?: SCHOOL | null;
}

export interface ORGANIZATION {
  id: string;
  name: string;
  city?: string | null;
  notes?: string | null;
  createdAt: DateTime;
  updatedAt: DateTime;
  head: Head[];
  school: SCHOOL[];
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
  head?: Head | null;
  organization?: ORGANIZATION;
}
