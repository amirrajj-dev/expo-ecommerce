export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}