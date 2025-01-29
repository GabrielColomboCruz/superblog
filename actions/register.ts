"use server";
import UsuarioCRUD from "@/model/UsuarioCRUD";
import bcrypt from "bcrypt";

export const registrar = async () => {
  try {
    const result = await UsuarioCRUD("emailread", { Email: "email" });
    if (result) {
      return;
    } else {
      await UsuarioCRUD("create", {
        Email: "email",
        Nome: "nome",
        Senha: "Senha",
      });
    }
  } catch (error) {
    console.error("Database error:", error);
  }
};

// Helper function to validate the email format
const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  // Validate form data
  if (!email || !name || !password) {
    throw new Error("All fields are required.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format.");
  }

  try {
    // Check if the email is already registered
    const existingUser = await UsuarioCRUD("emailread", { Email: email });

    if (
      existingUser &&
      Array.isArray(existingUser) &&
      existingUser.length > 0
    ) {
      return -1;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    await UsuarioCRUD("create", {
      Email: email,
      Nome: name,
      Senha: hashedPassword,
    });
    return 200;
  } catch (error) {
    console.error("Error registering user:", error);
    return;
  }
}
