import { createPool, Pool, RowDataPacket, OkPacket } from "mysql2/promise";
import envConfig from "@/config/envConfig";

envConfig();

// Tipagem para parâmetros
interface NotificacaoParams {
  Id?: string;
  Conteudo?: string;
  Usuario?: string;
  Post?: string;
  Read?: string;
  CriadoEm?: string;
}

// Tipagem para resultados do CRUD
type NotificacaoCRUDResult = RowDataPacket[] | OkPacket;

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
    | "list"
    | "readed",
  params: NotificacaoParams = {}
): Promise<NotificacaoCRUDResult> {
  try {
    const sqlMap: Record<string, string> = {
      list: `SELECT notificacoes.id, notificacoes.conteudo, notificacoes.usuario_id,notificacoes.post_id, notificacoes.read,
         usuarios.nome AS usuario, 
         notificacoes.criado_em AS criado_em
         FROM notificacoes 
         JOIN usuarios ON notificacoes.usuario_id = usuarios.id
         order by notificacoes.id DESC`,

      postread: `SELECT notificacoes.id, notificacoes.conteudo, notificacoes.usuario_id,notificacoes.post_id, notificacoes.read,
             usuarios.nome AS usuario, 
             notificacoes.criado_em AS criado_em
             FROM notificacoes 
             JOIN usuarios ON notificacoes.usuario_id = usuarios.id
             where notificacoes.post_id = ?
             order by notificacoes.id DESC `,

      usuarioread: `SELECT notificacoes.id, notificacoes.conteudo, notificacoes.usuario_id, notificacoes.post_id, notificacoes.read,
                 usuarios.nome AS usuario, 
                 notificacoes.criado_em AS criado_em
                 FROM notificacoes 
                 JOIN usuarios ON notificacoes.usuario_id = usuarios.id
                 where notificacoes.usuario_id = ?
                 order by notificacoes.id DESC `,

      create:
        "INSERT INTO `notificacoes` (`conteudo`,`usuario_id`,`post_id`, `criado_em`) VALUES (?, ?, ?, NOW());",

      idread: `SELECT notificacoes.id, notificacoes.conteudo, notificacoes.usuario_id,notificacoes.post_id, notificacoes.read,
             usuarios.nome AS usuario, 
             notificacoes.criado_em AS criado_em
             FROM notificacoes 
             JOIN usuarios ON notificacoes.usuario_id = usuarios.id
             where notificacoes.id = ?
             order by notificacoes.id DESC `,

      read: `SELECT notificacoes.id, notificacoes.conteudo, notificacoes.usuario_id,notificacoes.post_id, notificacoes.read,
             usuarios.nome AS usuario, 
             notificacoes.criado_em AS criado_em
             FROM notificacoes 
             JOIN usuarios ON notificacoes.usuario_id = usuarios.id
             WHERE notificacoes.conteudo LIKE CONCAT('%', ?, '%')`,

      update: "UPDATE `notificacoes` SET `conteudo` = ? WHERE `id` = ?",
      delete: "DELETE FROM `notificacoes` WHERE `id` = ?",
      readed: "UPDATE `notificacoes` SET `read` = ? WHERE `id` = ?",
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
      case "readed":
        values = [sanitizeValue(params.Read), sanitizeValue(params.Id)];
        break;
    }

    const [result] = await pool.execute<NotificacaoCRUDResult>(sql, values);

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
