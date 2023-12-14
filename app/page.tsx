import Board from "@/components/Board";
import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen px-2">
      <Header />
      <Board />
    </main>
  );
}
