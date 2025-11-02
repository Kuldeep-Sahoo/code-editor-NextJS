import { getProStatus } from "../../../lib/server/getProStatus";

export async function GET() {
  const isPro = await getProStatus();
  return Response.json({ isPro });
}
