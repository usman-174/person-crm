export const QUERY_KEYS = {
  ALL_SCHOOLS: "schools",
  ALL_USERS: "users",
};
export const REAVALIDAION_TIME = {
  COUNT: {
    TIME: 500,
    TAGS: ["counts"],
  },
  USER: {
    TIME: 500,
    TAGS: (id: string) => [QUERY_KEYS.ALL_USERS + "-" + id],
  },
  SCHOOL: {
    TIME: 500,
    TAGS: (id: string) => [QUERY_KEYS.ALL_SCHOOLS + "-" + id],
  },
};
export const SOCIAL_PLATFORMS = [
  {
    label: "LinkedIn",
    value: "LINKEDIN",
  },
  {
    label: "Facebook",
    value: "FB",
  },
  {
    label: "Twitter",
    value: "TWITTER",
  },
  {
    label: "Instagram",
    value: "IG",
  },
];
