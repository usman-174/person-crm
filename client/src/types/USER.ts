export interface USER {
  id: string;
  username: string;
  TFF_ID?: string;
  fname?: string;
  mname?: string;

  lname?: string;
  fullName: string;

  role?: string;
  title?: string;

  mainPhoto?: string;

  createdAt: Date;
  lastModified: Date;
  createdBy?: USER;
  lastModifiedBy?: USER;
}
