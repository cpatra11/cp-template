import { auth } from "@/auth";
import React from "react";

const Dashboard = async () => {
  const data = await auth();

  return <div>{data.user.name}</div>;
};

export default Dashboard;
