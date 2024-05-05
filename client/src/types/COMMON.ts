import { USER } from "./USER";

type DateTime = string; // Assuming DateTime is a string type in your system
export interface INCIDENT {
  id: string;
  title: string;
  type: string;
  targeted: string;
  date: Date;
  time: string;
  source?: SourceType;
  persons: PERSON[];
  schools: SCHOOL[];
  organizations: ORGANIZATION[];
  location: string;
  notes?: string;
  createdAt: Date;
  createdBy?: USER;
  createdById?: string;
  lastModified: Date;
  lastModifiedById?: string;
  lastModifiedBy?: USER;
}
export interface PERSON {
  id: string;
  username: string;
  TFF_ID?: string;
  fname?: string;
  mname?: string;

  lname?: string;
  fullName: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  DOB?: Date;

  title?: string;
  type: UserType;
  mainPhoto?: string;
  social?: Social[];
  source?: SourceType;
  incidents: INCIDENT[];
  notes?: string;
  createdAt: Date;
  lastModified: Date;
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

interface Social {
  id: string;
  platform: SocialPlatform;
  account: string;
  user: USER;
  userId: string;
}

enum UserType {
  ADMIN = "ADMIN",
  REPORTER = "REPORTER",
  USER = "USER",
}

enum SocialPlatform {
  LINKEDIN = "LINKEDIN",
  FB = "FB",
  TWITTER = "TWITTER",
  IG = "IG",
}

enum SourceType {
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  PERSON = "PERSON",
}
