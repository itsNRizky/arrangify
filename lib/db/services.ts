import { Models, Query } from "appwrite";
import { ID, databases } from "./appwrite";

export const User = {
  createUser: async (user: User): Promise<void> => {
    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!,
      ID.unique(),
      {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    );
  },

  getUsers: async (): Promise<Models.Document[]> => {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!,
    );
    return response.documents;
  },

  getUser: async ($id: string): Promise<Models.Document> => {
    const response = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!,
      $id,
    );
    return response;
  },
};

export const Sections = {
  createSection: async (section: Section): Promise<string> => {
    const id = await databases
      .createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_SECTIONS_COLLECTION_ID!,
        ID.unique(),
        {
          name: section.name,
          color: section.color,
          user: section.user,
        },
      )
      .then((val) => val.$id);

    return id;
  },

  getSections: async (): Promise<Models.Document[]> => {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SECTIONS_COLLECTION_ID!,
    );
    return response.documents;
  },

  getSectionsByUserId: async ($userId: string): Promise<Models.Document[]> => {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SECTIONS_COLLECTION_ID!,
      [Query.equal("user", $userId)],
    );
    return response.documents;
  },

  deleteSection: async ($id: string): Promise<void> => {
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SECTIONS_COLLECTION_ID!,
      $id,
    );
  },

  updateSection: async ($id: string, section: Section): Promise<void> => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SECTIONS_COLLECTION_ID!,
      $id,
      {
        name: section.name,
        color: section.color,
      },
    );
  },
};

export const Tasks = {
  getTasks: async (): Promise<Models.Document[]> => {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
    );
    return response.documents;
  },

  getTasksById: async ($id: string): Promise<Models.Document> => {
    const response = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
      $id,
    );
    return response;
  },

  getTasksBySectionId: async (
    $sectionId: string,
  ): Promise<Models.Document[]> => {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
      [Query.equal("section", $sectionId)],
    );
    return response.documents;
  },

  createTask: async (task: Task): Promise<string> => {
    const id = await databases
      .createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
        ID.unique(),
        {
          title: task.title,
          description: task.description,
          due_date: task.dueDate,
          image: task.image,
          section: task.sectionId,
        },
      )
      .then((val) => val.$id);

    return id;
  },

  updateTask: async ($id: string, task: Task): Promise<void> => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
      $id,
      {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        image: task.image,
      },
    );
  },

  deleteTask: async ($id: string): Promise<void> => {
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
      $id,
    );
  },

  moveTaskToSection: async ($id: string, sectionId: string): Promise<void> => {
    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
        $id,
        {
          section: sectionId,
        },
      );
    } catch (err) {
      console.log(err);
    }
  },
};

export const Board = {
  getBoardByUser: async ($userId: string): Promise<any> => {
    const tasks = await Tasks.getTasks();
    const sections = await Sections.getSectionsByUserId($userId);

    const userTasks = tasks.filter((task) => task.section.user.$id === $userId);
    const board = sections.map((section) => ({
      sectionId: section.$id,
      sectionName: section.name,
      sectionColor: section.color,
      tasks: userTasks.flatMap((task) =>
        task.section.$id === section.$id
          ? [
              {
                $id: task.$id,
                title: task.title,
                description: task.description,
                columnId: section.$id,
                $createdAt: task.$createdAt,
                dueDate: task.dueDate,
                image: task.image,
                sectionId: section.$id,
                sectionName: section.name,
              },
            ]
          : [],
      ),
    }));

    return board;
  },
};
