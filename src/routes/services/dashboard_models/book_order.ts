export class BookOrder {
  constructor(readonly bookId: number, readonly orderId: number, readonly quantity: number, readonly title: string) {}

  static fromRow(row: BookOrderRow): BookOrder {
    return new BookOrder(row.book_id, row.order_id, row.quantity, row.title);
  }
}

interface BookOrderRow {
  book_id: number;
  order_id: number;
  quantity: number;
  title: string;
}
