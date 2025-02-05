import { createPool, Pool, RowDataPacket, OkPacket } from "mysql2/promise";
import envConfig from "@/config/envConfig";

envConfig();

// Tipagem para parâmetros
interface UsuarioParams {
  Id?: string;
  Nome?: string;
  Descricao?: string;
}

// Tipagem para resultados do CRUD
type UsuarioCRUDResult = RowDataPacket[] | OkPacket;

// Configuração do pool
const pool: Pool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

// CRUD de usuários
async function CategoriasCRUD(
  operation: "create" | "idread" | "read" | "update" | "delete" | "list",
  params: UsuarioParams = {}
): Promise<UsuarioCRUDResult> {
  try {
    const sqlMap: Record<string, string> = {
      list: "SELECT * FROM superblog.categorias;",
      create: "INSERT INTO `categorias` (`Nome`, `Descricao`) VALUES (?, ?);",
      idread: "SELECT * FROM `categorias` WHERE `Id` = ?;",
      read: "SELECT * FROM `categorias` WHERE `Nome` LIKE CONCAT('%', ?, '%');",
      update:
        "UPDATE `categorias` SET `Nome` = ?, `Descricao` = ? WHERE `Id` = ?;",
      delete: "DELETE FROM `categorias` WHERE `Id` = ?;",
    };

    if (!sqlMap[operation]) throw new Error("Operação inválida.");

    const sanitizeValue = (
      value: string | number | undefined
    ): string | number | null => (value !== undefined ? value : null);

    let sql = sqlMap[operation];
    let values: (string | number | null)[] = [];

    switch (operation) {
      case "create":
        values = [sanitizeValue(params.Nome), sanitizeValue(params.Descricao)];
        break;
      case "idread":
        values = [sanitizeValue(params.Id)];
        break;
      case "read":
        values = [sanitizeValue(params.Nome)];
        break;
      case "update":
        values = [
          sanitizeValue(params.Nome),
          sanitizeValue(params.Descricao),
          sanitizeValue(params.Id),
        ];
        break;
      case "delete":
        values = [sanitizeValue(params.Id)];
        break;
    }

    const [result] = await pool.execute<UsuarioCRUDResult>(sql, values);

    console.log(`Operação ${operation} executada com sucesso.`);
    if (Array.isArray(result)) {
      return result as RowDataPacket[]; // Retorna um array de resultados de consulta SELECT
    } else {
      return result as OkPacket; // Retorna o OkPacket em caso de INSERT, UPDATE ou DELETE
    }
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

export default CategoriasCRUD;
