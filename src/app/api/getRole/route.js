import {  getRole } from "../../../lib/server/getRole";

export async function GET() {
  const role = await getRole();
  return Response.json({ role });
}
