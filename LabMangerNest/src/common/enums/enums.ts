export enum Status {
  Enable = 0,
  Disable = 1,
  Delete = 2,
}

export enum UserRole {
  Member = 0,
  Leader = 1,
  Director = 2,
  Admin = 3,
}

export enum OperationAction {
  NoInfo = 0,
  Inbound = 1,
  Outbound = 2,
}

export enum InventoryWarningType {
  NoWarning = 0,
  NumberWarning = 1,
  ExpirationDateWarning = 2,
  BothNumberAndExpirationDateWarning = 3,
}

