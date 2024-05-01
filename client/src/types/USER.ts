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
    notes?: string;
    createdAt: Date;
    lastModified: Date;
    createdBy?: USER;
    lastModifiedBy? : USER
  }
export interface USER {
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
    role?: string;
    title?: string;
    type: UserType;
    mainPhoto?: string;
    social?: Social[];
    source?: SourceType;
    notes?: string;
    createdAt: Date;
    lastModified: Date;
    createdBy?: USER;
    lastModifiedBy? : USER
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