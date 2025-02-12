import { createPool, Pool, RowDataPacket } from "mysql2/promise";
import envConfig from "@/config/envConfig";

envConfig();

// Configuração do pool
const pool: Pool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

interface SearchParams {
  query?: string;
}

// Full-Text Search Function
async function FullTextSearch(params: SearchParams): Promise<RowDataPacket[]> {
  try {
    if (!params.query) throw new Error("Nenhuma query de busca fornecida.");

    const query = params.query;

    const sql = `
      SELECT 'user' AS type, Id, Nome, NULL AS Descricao 
FROM usuarios 
WHERE CONCAT(LOWER(nome), ' ') LIKE LOWER(CONCAT('%', ?, '%'))

UNION

SELECT 'post' AS type, Id, titulo AS Nome, conteudo AS Descricao 
FROM posts 
WHERE CONCAT(LOWER(titulo), ' ', LOWER(conteudo)) LIKE LOWER(CONCAT('%', ?, '%'))

UNION

SELECT 'category' AS type, Id, Nome, NULL AS Descricao 
FROM categorias 
WHERE MATCH(Nome) AGAINST(LOWER(?))
      
      LIMIT 15;
    `;

    const [result] = await pool.execute<RowDataPacket[]>(sql, [
      query,
      query,
      query,
    ]);

    console.log(
      `Busca full-text executada com sucesso para query: "${query}".`
    );
    return result;
  } catch (error) {
    console.error("Erro na busca full-text:", error);
    throw error;
  }
}

export default FullTextSearch;
