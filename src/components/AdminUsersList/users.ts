export interface Users {
    id: string;
    nickname: string;
    name: string;
    surname: string;
    email: string;
    rating: number;
    status: 'active' | 'blockiert';
  }