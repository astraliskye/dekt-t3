import type { NextPage } from "next";
import Link from "next/link";

declare module "next-auth/react" {
  export interface Session {
    user: {
      email: string;
      id: string;
      image: string;
      name: string;
    };
  }
}

const Home: NextPage = () => {
  return (
    <>
      <h1 className="text-7xl mt-36 text-center">DEKT.</h1>
      <p className="text-xl text-center pb-4 mt-8 w-96 mx-auto">
        Create and analyze Back4Blood builds and share those builds with the
        community!
      </p>
      <div className="w-72 flex justify-between mx-auto">
        <Link href="/decks">
          <a className="bg-red-700 px-3 py-2 rounded-lg font-bold">
            Browse Decks
          </a>
        </Link>
        <Link href="/decks/create">
          <a className="bg-red-700 px-3 py-2 rounded-lg font-bold">
            Create a Deck
          </a>
        </Link>
      </div>
    </>
  );
};

export default Home;
