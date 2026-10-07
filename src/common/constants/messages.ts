export const USER_MESSAGES = {
  RETRIEVED: 'Users retrieved successfully.',
  NOT_FOUND: 'User not found.',
  CREATED: 'User created successfully.',
  UPDATED: 'User updated successfully.',
  DELETED: 'User deleted successfully.',
  EMAIL_ALREADY_EXISTS: 'A user with this email already exists.',
  PROFILE: 'Profile retrieved successfully',
};

export const PERMISSION_MESSAGES = {
  RETRIEVED: 'Permissions retrieved successfully.',
  NOT_FOUND: 'Permission not found.',
  CREATED: 'Permission created successfully.',
  UPDATED: 'Permission updated successfully.',
  DELETED: 'Permission deleted successfully.',
};

export const ROLES_MESSAGES = {
  RETRIEVED: 'Roles retrieved successfully.',
  NOT_FOUND: 'Role not found.',
  CREATED: 'Role created successfully.',
  UPDATED: 'Role updated successfully.',
  DELETED: 'Role deleted successfully.',
};

export const NOT_FOUND_MESSAGE_BY_ID = (
  entity: string,
  id: string | number,
): string => `${entity} with ID '${id}' not found.`;

export const ALREADY_EXISTS = (entity: string, id?: string | number): string =>
  `${entity} already exists${id ? ` (ID: ${id})` : ''}.`;
