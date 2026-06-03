import { OrderStatus } from "@/constants/type";

export abstract class OrderDetailState {
  abstract status: string;
  
  canProcess(): boolean { return false; }
  canDeliver(): boolean { return false; }
  canCancel(): boolean { return false; }
}

export class PendingDetailState extends OrderDetailState {
  status = OrderStatus.Pending;
  canProcess() { return true; }
  canCancel() { return true; }
}

export class ProcessingDetailState extends OrderDetailState {
  status = OrderStatus.Processing;
  canDeliver() { return true; }
}

export class DeliveredDetailState extends OrderDetailState {
  status = OrderStatus.Delivered;
}

export class CancelledDetailState extends OrderDetailState {
  status = OrderStatus.Cancelled;
}

export class OrderDetailStateFactory {
  static getState(status: string): OrderDetailState {
    switch (status) {
      case OrderStatus.Pending: return new PendingDetailState();
      case OrderStatus.Processing: return new ProcessingDetailState();
      case OrderStatus.Delivered: return new DeliveredDetailState();
      case OrderStatus.Cancelled: return new CancelledDetailState();
      default: return new PendingDetailState();
    }
  }
}
