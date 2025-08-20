import { auth } from "@/auth";
import React from "react";

const Dashboard = async () => {
  const data = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          Annadata — Voice Assistant Preview
        </h1>

        {data?.user ? (
          <p className="text-sm mb-4">
            Signed in as <strong>{data.user.name ?? data.user.email}</strong>
          </p>
        ) : (
          <p className="text-sm mb-4">Not signed in</p>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
