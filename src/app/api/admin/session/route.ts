import { getAdminSessionStatus } from "@/lib/admin-server";

export async function GET() {
  try {
    return Response.json(await getAdminSessionStatus());
  } catch {
    return Response.json({ user: null, isAdmin: false });
  }
}
