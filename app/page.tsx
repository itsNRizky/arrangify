import Board from "@/components/Board";
import Header from "@/components/Header";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  let user: any;
  try {
    user = await currentUser();
  } catch (e) {
    user = null;
  }
  return (
    <main className="min-h-screen overflow-y-hidden">
      <Header userId={user?.id} />
      <div className="">
        <Board userId={user?.id} />
      </div>
    </main>
  );
}
