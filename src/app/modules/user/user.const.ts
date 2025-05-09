export const bloodType = [
  'A_POSITIVE',
  'A_NEGATIVE',
  'B_POSITIVE',
  'B_NEGATIVE',
  'AB_POSITIVE',
  'AB_NEGATIVE',
  'O_POSITIVE',
  'O_NEGATIVE',
] as const;

export const userSearchableFields = ['name', 'email', 'location'];

export const userQueryFields = [
  'email',
  'bloodType',
  'location',
  'availability',
  'searchTerm',
];
