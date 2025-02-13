"use client";
import ProfileViewer from "@/app/_components/Profile";
import Sidebar from "@/app/_components/SideMenu";
import React from "react";
import { useParams } from "next/navigation";

const Profile = () => {
  const { id } = useParams();
  return (
    <>
      <Sidebar></Sidebar>
      <ProfileViewer userId={id}></ProfileViewer>
    </>
  );
};

export default Profile;
