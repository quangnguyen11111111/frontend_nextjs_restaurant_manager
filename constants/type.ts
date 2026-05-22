export const TokenType = {
  ForgotPasswordToken: "ForgotPasswordToken",
  AccessToken: "AccessToken",
  RefreshToken: "RefreshToken",
  TableToken: "TableToken",
} as const;

export const Role = {
  Owner: "Owner",
  Employee: "Employee",
  Guest: "Guest",
} as const;

export const RoleValues = [Role.Owner, Role.Employee, Role.Guest] as const;

export const DishStatus = {
  Available: "Available",
  Unavailable: "Unavailable",
  Hidden: "Hidden",
} as const;

export const DishStatusValues = [
  DishStatus.Available,
  DishStatus.Unavailable,
  DishStatus.Hidden,
] as const;

export const CategoryStatus = {
  Active: "Active",
  Inactive: "Inactive",
} as const;

export const CategoryStatusValues = [
  CategoryStatus.Active,
  CategoryStatus.Inactive,
] as const;

export const TableStatus = {
  Available: "Available",
  Hidden: "Hidden",
  Reserved: "Reserved",
  Occupied: "Occupied",
} as const;

export const TableStatusValues = [
  TableStatus.Available,
  TableStatus.Hidden,
  TableStatus.Reserved,
  TableStatus.Occupied,
] as const;

export const SessionStatus = {
  Pending_Arrival: "Pending_Arrival",
  Active: "Active",
  Paid: "Paid",
  Cancelled: "Cancelled",
} as const;

export const SessionStatusValues = [
  SessionStatus.Pending_Arrival,
  SessionStatus.Active,
  SessionStatus.Paid,
  SessionStatus.Cancelled,
] as const;

export const OrderStatus = {
  Pending: "Pending",
  Processing: "Processing",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
} as const;

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Delivered,
  OrderStatus.Cancelled,
] as const;

export const ManagerRoom = "manager" as const;
