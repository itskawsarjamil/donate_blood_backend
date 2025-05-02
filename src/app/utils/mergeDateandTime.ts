export const mergeDateandTime = (date: string, time: string): Date => {
  const iso = `${date}T${time}:00Z`;
  return new Date(iso);
};
