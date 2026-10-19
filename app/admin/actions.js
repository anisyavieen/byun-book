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

function validasiDataProduk(formData) {
  const id = formData?.get("id") || null;
  const nama = formData?.get("nama")?.trim();
  const hargaRaw = formData?.get("harga");
  const kategori = formData?.get("kategori")?.trim() || "";
  const foto_url = formData?.get("foto_url")?.trim() || "";
  const deskripsi = formData?.get("deskripsi")?.trim() || "";

  const savedData = {
    id,
    nama: formData?.get("nama") || "",
    harga: hargaRaw || "",
    kategori,
    foto_url,
    deskripsi,
  };

  if (!nama) {
    return {
      isValid: false,
      error: "Nama produk wajib diisi.",
      data: savedData,
    };
  }

  const harga = Number(hargaRaw);
  if (!hargaRaw || isNaN(harga) || harga <= 0) {
    return {
      isValid: false,
      error: "Harga harus berupa angka lebih dari 0.",
      data: savedData,
    };
  }

  return {
    isValid: true,
    data: savedData,
    validatedData: {
      nama,
      harga: Math.round(harga),
      kategori: kategori || null,
      foto_url: foto_url || null,
      deskripsi: deskripsi || null,
    },
  };
}

export async function tambahProduk(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;

  // Validasi login di server
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const validasi = validasiDataProduk(formData);

  if (userError || !user) {
    return {
      error: "Kamu harus login sebagai admin untuk menambah produk.",
      data: validasi.data,
      timestamp: Date.now(),
    };
  }

  if (!validasi.isValid) {
    return {
      error: validasi.error,
      data: validasi.data,
      timestamp: Date.now(),
    };
  }

  // Simpan ke Supabase
  const { error: insertError } = await supabase
    .from("produk")
    .insert([validasi.validatedData]);

  if (insertError) {
    return {
      error: insertError.message || "Gagal menyimpan produk ke database.",
      data: validasi.data,
      timestamp: Date.now(),
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function ubahProduk(firstArg, secondArg, thirdArg) {
  let id;
  let formData;

  if (thirdArg instanceof FormData) {
    id = firstArg;
    formData = thirdArg;
  } else if (secondArg instanceof FormData) {
    formData = secondArg;
    id = formData.get("id");
  } else if (firstArg instanceof FormData) {
    formData = firstArg;
    id = formData.get("id");
  } else {
    formData = secondArg || firstArg;
    id = formData?.get ? formData.get("id") : undefined;
  }

  // Validasi login di server
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const validasi = validasiDataProduk(formData);

  if (userError || !user) {
    return {
      error: "Kamu harus login sebagai admin untuk mengubah produk.",
      data: validasi.data,
      timestamp: Date.now(),
    };
  }

  if (!id) {
    return {
      error: "ID produk tidak ditemukan.",
      data: validasi.data,
      timestamp: Date.now(),
    };
  }

  if (!validasi.isValid) {
    return {
      error: validasi.error,
      data: validasi.data,
      timestamp: Date.now(),
    };
  }

  const { data: updatedData, error: updateError } = await supabase
    .from("produk")
    .update(validasi.validatedData)
    .eq("id", id)
    .select();

  if (updateError) {
    return {
      error: updateError.message || "Gagal memperbarui produk di database.",
      data: validasi.data,
      timestamp: Date.now(),
    };
  }

  if (!updatedData || updatedData.length === 0) {
    return {
      error: "Produk tidak ditemukan atau gagal diperbarui.",
      data: validasi.data,
      timestamp: Date.now(),
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}
