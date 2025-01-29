"use server";
import CategoriasCRUD from "@/model/CategoriaCRUD";
import { getSession } from "next-auth/react";

export const categoriasList = async () => {
  try {
    const results = await CategoriasCRUD("list");

    //console.log(">> results: ", results);
    var string = JSON.stringify(results);
    //console.log(">> string: ", string);
    var json = JSON.parse(string);
    //console.log(">> json: ", json);
    //console.log(">> user.name: ", json[0].nome);
    //console.log(">> user.descricao: ", json[0].descricao);

    return json;
  } catch (error) {
    console.error("Database error:", error);
  }
};
