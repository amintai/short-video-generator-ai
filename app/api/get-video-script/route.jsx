import { chatSession } from "../../../configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { propmt } = await req.json();
    console.log(propmt);

    const result = await chatSession.sendMessage(propmt);
    console.log(result.response.text());
    return NextResponse.json({
      result: JSON.parse(result.response.text()),
    });
  } catch (e) {
    return NextResponse.json({ "Error:": e });
  }
}
