"use server";

import axios from "axios";
import { cookies } from "next/headers";

export async function register(body: {
  dni: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}) {
  try {
    return await axios.post("http://localhost:3000/api/auth/register", body);
  } catch (error: any) {
    return console.error(
      "Error en register:",
      error.response?.data || error.message
    );
  }
}

export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  try {
    const { data } = await axios.post(
      "http://localhost:3000/api/auth/login",
      formData
    );

    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set("token", data.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
    }

    return { user: data.user };
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Error al iniciar sesión",
    };
  }
}

export async function logoutServer() {
  const cookieStore = await cookies();
  cookieStore.delete("token");

  return { ok: true };
}
