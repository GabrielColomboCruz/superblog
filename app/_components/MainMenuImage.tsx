import React from "react";
import styles from "./page.module.css";
interface MainMenuImageProps {
  image: string;
}
const MainMenuImage = ({ image }: MainMenuImageProps) => {
  return (
    <div className={styles.back}>
      <img className={styles.img} src={image} />
    </div>
  );
};

export default MainMenuImage;
