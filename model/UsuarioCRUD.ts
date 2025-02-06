import { createPool, Pool, RowDataPacket, OkPacket } from "mysql2/promise";
import envConfig from "@/config/envConfig";
import bcrypt from "bcrypt";

envConfig();

// Tipagem para parâmetros
interface UsuarioParams {
  Id?: string;
  Nome?: string;
  Email?: string;
  Senha?: string;
}

// Tipagem para resultados do CRUD
type UsuarioCRUDResult = RowDataPacket[] | OkPacket;

// Hash de senha
const hashPassword = async (plainPassword: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};

// Configuração do pool
const pool: Pool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

// CRUD de usuários
async function UsuarioCRUD(
  operation:
    | "create"
    | "emailread"
    | "idread"
    | "read"
    | "update"
    | "delete"
    | "list",
  params: UsuarioParams = {}
): Promise<UsuarioCRUDResult> {
  try {
    const sqlMap: Record<string, string> = {
      list: "SELECT * FROM superblog.usuarios;",
      create:
        "INSERT INTO `usuarios` (`Nome`, `Email`, `Senha`) VALUES (?, ?, ?);",
      emailread: "SELECT * FROM `usuarios` WHERE `Email` = ?;",
      idread: "SELECT * FROM `usuarios` WHERE `Id` = ?;",
      read: "SELECT * FROM `usuarios` WHERE `Nome` LIKE CONCAT('%', ?, '%');",
      update:
        "UPDATE `usuarios` SET `Nome` = ?, `Email` = ?, `Senha` = ? WHERE `Id` = ?;",
      delete: "DELETE FROM `usuarios` WHERE `Id` = ?;",
    };

    if (!sqlMap[operation]) throw new Error("Operação inválida.");

    const sanitizeValue = (
      value: string | number | undefined
    ): string | number | null => (value !== undefined ? value : null);

    let sql = sqlMap[operation];
    let values: (string | number | null)[] = [];

    switch (operation) {
      case "create":
        const hashedPassword = await hashPassword(params.Senha as string);
        values = [
          sanitizeValue(params.Nome),
          sanitizeValue(params.Email),
          hashedPassword,
        ];
        break;
      case "emailread":
        values = [sanitizeValue(params.Email)];
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
          sanitizeValue(params.Email),
          await hashPassword(params.Senha as string),
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
      return result as UsuarioCRUDResult; // Retorna um array de resultados de consulta SELECT
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

export default UsuarioCRUD;
