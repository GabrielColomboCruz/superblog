import Image from "next/image";
import Link from "next/link";
import Sidebar from "./_components/SideMenu";

export default function Home() {
  return (
    <>
      <Sidebar></Sidebar>
      <div className="flex justify-center">
        <img src="/MainMenuImage.png" alt="" />
      </div>
    </>
  );
}
