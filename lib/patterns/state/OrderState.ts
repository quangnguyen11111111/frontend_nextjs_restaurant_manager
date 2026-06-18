import { SessionStatus } from "@/constants/type";

export abstract class OrderState {
  abstract status: string;
  
  canPay(): boolean { return false; }
  canCancel(): boolean { return false; }
  canAddDishes(): boolean { return false; }
  getAllowedTransitions(): string[] { return [this.status]; }
}

export class PendingArrivalOrderState extends OrderState {
  status = SessionStatus.Pending_Arrival;
  canCancel() { return true; }
  canAddDishes() { return true; }
  getAllowedTransitions(): string[] { return [this.status, SessionStatus.Active, SessionStatus.Cancelled]; }
}

export class ActiveOrderState extends OrderState {
  status = SessionStatus.Active;
  canPay() { return true; }
  canCancel() { return true; }
  canAddDishes() { return true; }
  getAllowedTransitions(): string[] { return [this.status, SessionStatus.Paid, SessionStatus.Cancelled]; }
}

export class PaidOrderState extends OrderState {
  status = SessionStatus.Paid;
}

export class CancelledOrderState extends OrderState {
  status = SessionStatus.Cancelled;
}

export class OrderStateFactory {
  static getState(status: string): OrderState {
    switch (status) {
      case SessionStatus.Pending_Arrival: return new PendingArrivalOrderState();
      case SessionStatus.Active: return new ActiveOrderState();
      case SessionStatus.Paid: return new PaidOrderState();
      case SessionStatus.Cancelled: return new CancelledOrderState();
      default: return new ActiveOrderState(); // fallback
    }
  }
}
