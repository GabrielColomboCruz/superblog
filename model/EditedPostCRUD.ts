import { createPool, Pool, RowDataPacket, OkPacket } from "mysql2/promise";
import envConfig from "@/config/envConfig";

envConfig();

// Tipagem para parâmetros
interface PostParams {
  Id?: string;
  Titulo?: string;
  Conteudo?: string;
  Usuario?: string;
  Categoria?: string;
  Post?: string;
  Limit?: string;
  Offset?: string;
}

// Tipagem para resultados do CRUD
type EditedPostCRUDResult = RowDataPacket[] | OkPacket;

// Configuração do pool
const pool: Pool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

// CRUD de posts
async function EditedPostsCRUD(
  operation:
    | "create"
    | "idread"
    | "read"
    | "categoriaread"
    | "usuarioread"
    | "update"
    | "delete"
    | "list"
    | "postread",
  params: PostParams = {}
): Promise<EditedPostCRUDResult> {
  try {
    const sqlMap: Record<string, string> = {
      list: `SELECT editedposts.id, editedposts.titulo, editedposts.conteudo, 
      categorias.nome AS categoria, usuarios.id AS usuario_id, usuarios.nome AS usuario 
FROM editedposts
JOIN categorias ON editedposts.categoria_id = categorias.id
JOIN usuarios ON editedposts.usuario_id = usuarios.id
ORDER BY editedposts.id DESC
LIMIT ? OFFSET ?;`,

      categoriaread: `SELECT editedposts.id, editedposts.titulo, editedposts.conteudo, 
           categorias.nome AS categoria, usuarios.id AS usuario_id, usuarios.nome AS usuario 
    FROM editedposts
    JOIN categorias ON editedposts.categoria_id = categorias.id
    JOIN usuarios ON editedposts.usuario_id = usuarios.id
    WHERE editedposts.categoria_id = ?;`,

      usuarioread: `SELECT editedposts.id, editedposts.titulo, editedposts.conteudo, 
        categorias.nome AS categoria, usuarios.id AS usuario_id, usuarios.nome AS usuario 
 FROM editedposts
 JOIN categorias ON editedposts.categoria_id = categorias.id
 JOIN usuarios ON editedposts.usuario_id = usuarios.id
 WHERE editedposts.usuario_id = ?;`,

      create: `INSERT INTO editedposts (titulo, conteudo, usuario_id, categoria_id) 
VALUES (?, ?, ?, ?);`,

      idread: `SELECT editedposts.id, editedposts.titulo, editedposts.conteudo, 
    categorias.nome AS categoria, usuarios.id AS usuario_id, usuarios.nome AS usuario 
FROM editedposts
JOIN categorias ON editedposts.categoria_id = categorias.id
JOIN usuarios ON editedposts.usuario_id = usuarios.id
WHERE editedposts.id = ?;`,

      read: `SELECT editedposts.id, editedposts.titulo, editedposts.conteudo, 
  categorias.nome AS categoria, usuarios.id AS usuario_id, usuarios.nome AS usuario 
FROM editedposts
JOIN categorias ON editedposts.categoria_id = categorias.id
JOIN usuarios ON editedposts.usuario_id = usuarios.id
WHERE editedposts.titulo LIKE CONCAT('%', ?, '%');`,

      update: `UPDATE editedposts SET titulo = ?, conteudo = ?, categoria_id = ? WHERE id = ?;`,

      delete: `DELETE FROM editedposts WHERE id = ?;`,

      postread: `SELECT editedposts.id, editedposts.titulo, editedposts.conteudo, 
      categorias.nome AS categoria, usuarios.id AS usuario_id, usuarios.nome AS usuario 
FROM editedposts
JOIN categorias ON editedposts.categoria_id = categorias.id
JOIN usuarios ON editedposts.usuario_id = usuarios.id
WHERE editedposts.id = ?;`,
    };

    if (!sqlMap[operation]) throw new Error("Operação inválida.");

    const sanitizeValue = (
      value: string | number | undefined
    ): string | number | null => (value !== undefined ? value : null);

    let sql = sqlMap[operation];
    let values: (string | number | null)[] = [];

    switch (operation) {
      case "create":
        values = [
          sanitizeValue(params.Titulo),
          sanitizeValue(params.Conteudo),
          sanitizeValue(params.Usuario),
          sanitizeValue(params.Categoria),
        ];
        break;
      case "idread":
        values = [sanitizeValue(params.Id)];
        break;
      case "categoriaread":
        values = [sanitizeValue(params.Categoria)];
        break;
      case "usuarioread":
        values = [sanitizeValue(params.Usuario)];
        break;
      case "read":
        values = [sanitizeValue(params.Titulo)];
        break;
      case "update":
        values = [
          sanitizeValue(params.Titulo),
          sanitizeValue(params.Conteudo),
          sanitizeValue(params.Categoria),
          sanitizeValue(params.Id),
        ];
        break;
      case "delete":
        values = [sanitizeValue(params.Id)];
        break;
      case "list":
        values = [
          sanitizeValue(params.Limit || "10"), // Default to 10 posts
          sanitizeValue(params.Offset || "0"), // Default to 0 (start from beginning)
        ];
        break;
    }

    const [result] = await pool.execute<EditedPostCRUDResult>(sql, values);

    console.log(`Operação ${operation} executada com sucesso.`);
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao executar operação ${operation}:`, error.message);
      throw error;
    } else {
      console.error("Erro inesperado:", error);
      throw new Error("Erro desconhecido ocorreu.");
    }
  }
}

export default EditedPostsCRUD;
