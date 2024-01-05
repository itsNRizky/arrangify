type Task = {
  $id: string;
  $createdAt: string;
  title: string;
  description?: string;
  dueDate?: string;
  image?: string;
  sectionId: string;
};

type Column = {
  sectionId: string;
  sectionName: string;
  sectionColor: string;
  tasks: Task[];
};

type BoardData = Column[];

type User = {
  username: string;
  email: string;
  password: string;
};

type Section = {
  $id: string;
  name: string;
  user: string;
  color: string;
};

type TargetModal =
  | ""
  | "addCard"
  | "addSection"
  | "deleteCard"
  | "deleteSection"
  | "editSection";
