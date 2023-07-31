export type EntryData = {
  id: string;
  title: string;
  content: string;
  published: Boolean;
  author: UserData;
  authorId: string;
  createdAt: Date;
  modifiedAt: Date;
}

export type UserData = {
  id: string;
  name: string;
  email:string;
  createdAt: Date;
  updatedAt: Date;
  entries: EntryData[];
}