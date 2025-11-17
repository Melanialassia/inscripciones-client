"use server";

import axios from "axios";
import { cookies } from "next/headers";

async function axiosWithAuth(
  url: string,
  method: "get" | "post" | "put" | "delete",
  body?: any
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return axios({
    url,
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    data: body,
  });
}

export async function register(body: {
  dni: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: string;
}) {
  try {
    const { data } = await axios.post(
      "https://plataforma-inscripciones.vercel.app/api/auth/register",
      body
    );
    
    return data;
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
      "https://plataforma-inscripciones.vercel.app/api/auth/login",
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
    const { data } = await axios.get(
      `https://plataforma-inscripciones.vercel.app/api/materias`
    );

    return data;
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Error al iniciar sesión",
    };
  }
}

export async function obtenerProfesionales() {
  try {
    const { data } = await axios.get(
      `https://plataforma-inscripciones.vercel.app/api/profesionales`
    );

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
    const { data } = await axiosWithAuth(
      "https://plataforma-inscripciones.vercel.app/api/materias",
      "post",
      body
    );
    return data;
  } catch (error: any) {
    return { error: error.response?.data?.message || "Error al crear materia" };
  }
}

export async function editarMateria({
  id,
  body,
}: {
  id: number;
  body: { id_profesor: number; descripcion: string };
}) {
  try {
    const { data } = await axiosWithAuth(
      `https://plataforma-inscripciones.vercel.app/api/materias/${id}`,
      "put",
      body
    );
    return data;
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Error al editar materia",
    };
  }
}

export async function eliminarMateria(id: number) {
  try {
    const { data } = await axiosWithAuth(
      `https://plataforma-inscripciones.vercel.app/api/materias/${id}`,
      "delete"
    );
    return data;
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Error al eliminar materia",
    };
  }
}
