import { getUser } from "../../../lib/server/getUser";

export async function GET() {
  const user = await getUser();
  return Response.json({ user });
}
