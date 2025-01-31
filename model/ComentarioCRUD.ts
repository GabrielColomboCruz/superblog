import { createPool, Pool, RowDataPacket, OkPacket } from "mysql2/promise";
import envConfig from "@/config/envConfig";

envConfig();

// Tipagem para parâmetros
interface ComentarioParams {
  Id?: number;
  Conteudo?: string;
  Usuario?: string;
  Post?: string;
}

// Tipagem para resultados do CRUD
type ComentarioCRUDResult = RowDataPacket[] | OkPacket;

// Configuração do pool
const pool: Pool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

// CRUD de posts
async function ComentariosCRUD(
  operation:
    | "create"
    | "idread"
    | "read"
    | "usuarioread"
    | "postread"
    | "delete"
    | "update"
    | "list",
  params: ComentarioParams = {}
): Promise<ComentarioCRUDResult> {
  try {
    const sqlMap: Record<string, string> = {
      list: `SELECT comentarios.id, comentarios.conteudo, comentarios.usuario_id,
usuarios.nome AS usuario 
FROM comentarios 
JOIN usuarios ON comentarios.usuario_id = usuarios.id
order by comentarios.id DESC`,

      postread: `SELECT comentarios.id, comentarios.conteudo, comentarios.usuario_id,
usuarios.nome AS usuario 
FROM comentarios 
JOIN usuarios ON comentarios.usuario_id = usuarios.id
where comentarios.post_id = ?
order by comentarios.id DESC `,
      usuarioread: `SELECT comentarios.id, comentarios.conteudo, comentarios.usuario_id,
usuarios.nome AS usuario 
FROM comentarios 
JOIN usuarios ON comentarios.usuario_id = usuarios.id
where comentarios.usuario_id = ?
order by comentarios.id DESC `,
      create:
        "INSERT INTO `comentarios` (`conteudo`,`usuario_id`,`post_id` ) VALUES (?, ?, ?);",
      idread: `SELECT comentarios.id, comentarios.conteudo, comentarios.usuario_id,
usuarios.nome AS usuario 
FROM comentarios 
JOIN usuarios ON comentarios.usuario_id = usuarios.id
where comentarios.id = ?
order by comentarios.id DESC `,
      read: `SELECT comentarios.id, comentarios.conteudo, comentarios.usuario_id,
usuarios.nome AS usuario 
FROM comentarios 
JOIN usuarios ON comentarios.usuario_id = usuarios.id
             WHERE comentarios.conteudo LIKE CONCAT('%', ?, '%');`,
      update: "UPDATE `comentarios` SET `conteudo` = ? WHERE `id` = ?;",
      delete: "DELETE FROM `comentarios` WHERE `id` = ?;",
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
          sanitizeValue(params.Conteudo),
          sanitizeValue(params.Usuario),
          sanitizeValue(params.Post),
        ];
        break;
      case "idread":
        values = [sanitizeValue(params.Id)];
        break;
      case "postread":
        values = [sanitizeValue(params.Post)];
        break;
      case "usuarioread":
        values = [sanitizeValue(params.Usuario)];
        break;
      case "read":
        values = [sanitizeValue(params.Conteudo)];
        break;
      case "update":
        values = [sanitizeValue(params.Conteudo), sanitizeValue(params.Id)];
        break;
      case "delete":
        values = [sanitizeValue(params.Id)];
        break;
    }

    const [result] = await pool.execute<ComentarioCRUDResult>(sql, values);

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

export default ComentariosCRUD;
