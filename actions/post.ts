"use server";
import PostCRUD from "@/model/PostCRUD";

export const postsList = async () => {
  try {
    const results = await PostCRUD("list");
    var string = JSON.stringify(results);
    var json = JSON.parse(string);
    return json;
  } catch (error) {
    console.error("Database error:", error);
  }
};

export const postsUsuarioRead = async (Usuario) => {
  try {
    const results = await PostCRUD("usuarioread", { Usuario });
    var string = JSON.stringify(results);
    var json = JSON.parse(string);
    return json;
  } catch (error) {
    console.error("Database error:", error);
  }
};
export const postsIdRead = async (Usuario) => {
  try {
    const results = await PostCRUD("idread", { Usuario });
    var string = JSON.stringify(results);
    var json = JSON.parse(string);
    return json;
  } catch (error) {
    console.error("Database error:", error);
  }
};
export const postsCategoryRead = async (Usuario) => {
  try {
    const results = await PostCRUD("categoriaread", { Usuario });
    var string = JSON.stringify(results);
    var json = JSON.parse(string);
    return json;
  } catch (error) {
    console.error("Database error:", error);
  }
};

export const postsCreate = async (Titulo, Conteudo, Usuario, Categoria) => {
  try {
    const results = await PostCRUD("create", {
      Titulo,
      Conteudo,
      Categoria,
      Usuario,
    });
    return;
  } catch (error) {
    console.error("Database error:", error);
  }
};

export const postsDoom = async () => {
  try {
    const limit = "10";
    const offset = "0";

    const posts = await PostCRUD("list", {
      Limit: Number(limit),
      Offset: Number(offset),
    });
    console.log(posts);
    var string = JSON.stringify(posts);
    var json = JSON.parse(string);
    return json;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};
