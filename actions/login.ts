"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { getUserEmail } from "../app/api/auth/[...nextauth]/getUserData";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import AuthError from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log(values);

  // Validate input fields
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    // Retrieve user by email from the database
    const result = await getUserEmail({ email });

    // Check if user exists and password matches
    if (result?.Senha === password) {
      // Attempt sign-in with valid credentials
      await signIn("credentials", {
        email,
        password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });
      console.log("Success on Login");
      return { error: "Success" };
    }
  } catch (error) {
    // Handle any sign-in errors related to credentials
    if (error instanceof AuthError) {
      return { error: "Something went wrong!!" };
    }

    // Log and rethrow any other errors (e.g., database issues)

    throw error;
  }
};
