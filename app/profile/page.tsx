"use client";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Sidebar from "../_components/SideMenu";
import ProfileViewer from "../_components/Profile";

const Profile = () => {
  return (
    <>
      <Sidebar></Sidebar>
      <ProfileViewer></ProfileViewer>
    </>
  );
};

export default Profile;
