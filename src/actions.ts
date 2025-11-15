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
    return {
      error: error.response?.data?.message || "Error al registrar al usuario",
    };
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

    return {
      user: {
        email: data.user.email,
        dni: data.user.user_metadata?.dni,
      },
    };
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

export async function obtenerMaterias() {
  try {
    const { data } = await axios.get(`http://localhost:3000/api/materias`);

    return data;
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Error al iniciar sesión",
    };
  }
}

export async function obtenerProfesionales() {
  try {
    const { data } = await axios.get(`http://localhost:3000/api/profesionales`);

    return data;
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Error al iniciar sesión",
    };
  }
}

export async function crearMateria(body: {
  id_profesor: number;
  descripcion: string;
}) {
  try {
    const { data } = await axios.post(
      "http://localhost:3000/api/materias/",
      body
    );
    return data;
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Error al registrar al usuario",
    };
  }
}

export async function editarMateria({
  body,
  id,
}: {
  body: {
    id_profesor: number;
    descripcion: string;
  };
  id: number;
}) {
  try {
    const { data } = await axios.put(
      `http://localhost:3000/api/materias/${id}`,
      body
    );
    return data;
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Error al registrar al usuario",
    };
  }
}

export async function eliminarMateria(id: number) {
  try {
    console.log("AAA", id);
    const { data } = await axios.delete(
      `http://localhost:3000/api/materias/${id}`
    );
    console.log("DATA", data);
    return data;
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Error al registrar al usuario",
    };
  }
}
