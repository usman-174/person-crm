export const QUERY_KEYS = {
  ALL_SCHOOLS: "schools",
  ALL_PERSONS: "persons",
  ALL_HEADS: "heads",
  ALL_ORGANIZATIONS: "organizations",
};
export const REAVALIDAION_TIME = {
  COUNT: {
    TIME: 500,
    TAGS: ["counts"],
    type: "count",
  },
  PERSON: {
    TIME: 500,
    TAGS: (id: string) => [QUERY_KEYS.ALL_PERSONS + "-" + id],
    type: "person",
  },
  SCHOOL: {
    TIME: 500,
    TAGS: (id: string) => [QUERY_KEYS.ALL_SCHOOLS + "-" + id],
    type: "school",
  },
  HEAD: {
    TIME: 500,
    TAGS: (id: string) => [QUERY_KEYS.ALL_HEADS + "-" + id],
    type: "head",
  },
  ORGANIZATION: {
    TIME: 500,
    TAGS: (id: string) => [QUERY_KEYS.ALL_ORGANIZATIONS + "-" + id],
    type: "organization",
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
