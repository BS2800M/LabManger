export const Status = {
  Enable: 'Enable',
  Disable: 'Disable',
  Delete: 'Delete',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const UserRole = {
  Member: 'Member',
  Leader: 'Leader',
  Director: 'Director',
  Admin: 'Admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const OperationAction = {
  NoInfo: 'NoInfo',
  Inbound: 'Inbound',
  Outbound: 'Outbound',
} as const;

export type OperationAction = (typeof OperationAction)[keyof typeof OperationAction];

export enum InventoryWarningType {
  NoWarning = 0,
  NumberWarning = 1,
  ExpirationDateWarning = 2,
  BothNumberAndExpirationDateWarning = 3,
}

