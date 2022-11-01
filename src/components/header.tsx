import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "./button";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-red-700 px-4 h-12 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto h-full">
        <Link href={"/"}>
          <a className="text-2xl font-bold">DEKT.</a>
        </Link>

        {session ? (
          <div className="flex items-center">
            {session.user && (
              <span className="flex border-2 border-white mr-3 rounded-full overflow-hidden">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    width="35px"
                    height="35px"
                    alt="profile picture"
                  />
                ) : (
                  <>
                    Signed in as{" "}
                    <span className="font-bold">{session.user.name}</span>
                  </>
                )}
              </span>
            )}
            <Button onClick={() => signOut()}>Sign Out</Button>
          </div>
        ) : (
          <Button onClick={() => signIn("discord")}>
            Sign in with Discord
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
