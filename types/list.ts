export interface ListInterface {
  title: string;
  id: string | number;
  cards: {
    title: string;
  }[];
  dateCreated: number;
}
