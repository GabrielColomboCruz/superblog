(async () => {
  const UsuarioCRUD = require("./UsuarioCRUD");

  // 1. Criar 10 usuários
  const usuarios = [
    { Nome: "Alice", Email: "alice@email.com", Senha: "senha123" },
    { Nome: "Bob", Email: "bob@email.com", Senha: "senha123" },
    { Nome: "Charlie", Email: "charlie@email.com", Senha: "senha123" },
    { Nome: "Daisy", Email: "daisy@email.com", Senha: "senha123" },
    { Nome: "Eve", Email: "eve@email.com", Senha: "senha123" },
    { Nome: "Frank", Email: "frank@email.com", Senha: "senha123" },
    { Nome: "Grace", Email: "grace@email.com", Senha: "senha123" },
    { Nome: "Henry", Email: "henry@email.com", Senha: "senha123" },
    { Nome: "Ivy", Email: "ivy@email.com", Senha: "senha123" },
    { Nome: "Jack", Email: "jack@email.com", Senha: "senha123" },
  ];

  console.log("\n--- Criando usuários ---");
  for (const usuario of usuarios) {
    await UsuarioCRUD("create", usuario);
    console.log(`Usuário ${usuario.Nome} criado.`);
  }

  // 2. Ler um usuário pelo email
  console.log("\n--- Lendo usuário pelo email ---");
  const emailReadResult = await UsuarioCRUD("emailread", {
    Email: "alice@email.com",
  });
  console.log("Usuário encontrado pelo email:", emailReadResult);

  // 3. Ler um usuário pelo ID
  console.log("\n--- Lendo usuário pelo ID ---");
  const idReadResult = await UsuarioCRUD("idread", { Id: 1 }); // Supondo que o ID do primeiro usuário é 1
  console.log("Usuário encontrado pelo ID:", idReadResult);

  // 4. Ler usuários pelo nome (busca parcial)
  console.log("\n--- Lendo usuários pelo nome ---");
  const nameReadResult = await UsuarioCRUD("read", { Nome: "a" }); // Busca por nomes que contenham "a"
  console.log("Usuários encontrados pelo nome:", nameReadResult);

  // 5. Atualizar um usuário existente
  console.log("\n--- Atualizando usuário ---");
  await UsuarioCRUD("update", {
    Id: 1, // Supondo que o ID do usuário a ser atualizado é 1
    Nome: "Alice Updated",
    Email: "alice_updated@email.com",
    Senha: "novasenha123",
  });
  console.log("Usuário atualizado.");

  // 6. Deletar um usuário
  console.log("\n--- Deletando usuário ---");
  await UsuarioCRUD("delete", { Id: 10 }); // Supondo que o ID do último usuário é 10
  console.log("Usuário com ID 10 deletado.");
})();
