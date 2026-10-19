"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

export async function loginAdmin(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;

  const email = formData?.get("email");
  const password = formData?.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: String(password),
  });

  if (error) {
    if (
      error.message &&
      error.message.toLowerCase().includes("invalid login credentials")
    ) {
      return { error: "Email atau password salah. Silakan coba lagi." };
    }
    return { error: error.message || "Gagal masuk. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;

  const passwordBaru = formData?.get("password_baru");
  const konfirmasiPassword = formData?.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Kamu harus login terlebih dahulu." };
  }

  const { error } = await supabase.auth.updateUser({
    password: String(passwordBaru),
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { success: "Password berhasil diganti." };
}

export async function tambahProduk(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;

  const nama = formData?.get("nama")?.trim();
  const hargaRaw = formData?.get("harga");
  const kategori = formData?.get("kategori")?.trim() || "";
  const foto_url = formData?.get("foto_url")?.trim() || "";
  const deskripsi = formData?.get("deskripsi")?.trim() || "";

  const savedData = {
    nama: formData?.get("nama") || "",
    harga: hargaRaw || "",
    kategori,
    foto_url,
    deskripsi,
  };

  // Validasi login di server
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Kamu harus login sebagai admin untuk menambah produk.",
      data: savedData,
      timestamp: Date.now(),
    };
  }

  // Validasi input
  if (!nama) {
    return {
      error: "Nama produk wajib diisi.",
      data: savedData,
      timestamp: Date.now(),
    };
  }

  const harga = Number(hargaRaw);
  if (!hargaRaw || isNaN(harga) || harga <= 0) {
    return {
      error: "Harga harus berupa angka lebih dari 0.",
      data: savedData,
      timestamp: Date.now(),
    };
  }

  // Simpan ke Supabase
  const { error: insertError } = await supabase.from("produk").insert([
    {
      nama,
      harga: Math.round(harga),
      kategori: kategori || null,
      foto_url: foto_url || null,
      deskripsi: deskripsi || null,
    },
  ]);

  if (insertError) {
    return {
      error: insertError.message || "Gagal menyimpan produk ke database.",
      data: savedData,
      timestamp: Date.now(),
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}
