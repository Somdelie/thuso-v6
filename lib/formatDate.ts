// dateUtils.ts

export const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
