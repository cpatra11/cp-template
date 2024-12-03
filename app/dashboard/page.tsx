"use server";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const DashboardPage = async () => {
  const session = await auth();
  console.log(session);
  return (
    <div>
      Hi {session?.user?.email}
      {/* <div>
        <Button formAction={async () => signOut()}>Sign Out</Button>
      </div> */}
    </div>
  );
};

export default DashboardPage;
