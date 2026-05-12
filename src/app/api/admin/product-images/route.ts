import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/admin-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "Only image uploads are allowed." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${new Date().getFullYear()}/${randomUUID()}.${extension}`;
    const upload = await supabase.storage
      .from("product-images")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (upload.error) {
      throw upload.error;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return Response.json({ path, url: data.publicUrl });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Image upload failed." },
      { status: 500 }
    );
  }
}
