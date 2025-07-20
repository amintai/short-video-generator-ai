import Replicate from "replicate";
import { NextResponse } from "next/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const { input } = await req.json();
    const output = await replicate.run(
      "prunaai/flux.1-dev:970a966e3a5d8aa9a4bf13d395cf49c975dc4726e359f982fb833f9b100f75d5",
      { input }
    );
    return NextResponse.json({ result: output });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message || e.toString() }, { status: 500 });
  }
}