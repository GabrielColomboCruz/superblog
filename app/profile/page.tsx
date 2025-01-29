"use client";
import React, { useEffect, useState } from "react";
import Post from "../_components/Post";
import { getSession } from "next-auth/react";

const Profile = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      setSession(userSession);
    };

    fetchSession();
  }, []);

  if (!session) return <p>Loading...</p>;

  return (
    <div>
      <Post userId={session.user.id} />
    </div>
  );
};

export default Profile;
