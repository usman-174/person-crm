import { USER } from "./USER";

type DateTime = string; // Assuming DateTime is a string type in your system

export interface Head {
  id: string;
  name: string;
  gender: string;
  organizationId?: string | null;
  createdAt: DateTime;
  lastModified: Date;
  organization?: ORGANIZATION | null;
  school?: SCHOOL | null;
  createdBy?: USER;
  lastModifiedBy?: USER;
}

export interface ORGANIZATION {
  id: string;
  name: string;
  city?: string | null;
  notes?: string | null;
  createdAt: DateTime;
  createdBy?: USER;
  lastModifiedBy?: USER;
  lastModified: Date;
  heads: Head[];
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
  head?: Head | null;
  organization?: ORGANIZATION;
}
