"use client";

import React from "react";
import {useAuth} from "@/context/user-auth";
import DataDisplay from "./data-display";
const AdminPage = () => {
  const {currentUser} = useAuth()!;

  console.log(currentUser?.uid);

  if (
    currentUser?.uid === "Nlh3AhHmgrQliLCkbjbKOtbVc252" ||
    currentUser?.uid === "TV8IByKFFFaupS1HV4qg6Xaw1Xc2"
  ) {
    return <DataDisplay />;
  }

  return <div>Unauthorized</div>;
};

export default AdminPage;
