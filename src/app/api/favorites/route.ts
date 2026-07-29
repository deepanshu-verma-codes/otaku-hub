import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json({
    images: user.favoriteImages || [],
    trailers: user.favoriteTrailers || [],
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { type, action, item } = await req.json();
  
  if (!["image", "trailer"].includes(type) || !["add", "remove"].includes(action)) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  const arrayKey = type === "image" ? "favoriteImages" : "favoriteTrailers";

  if (action === "add") {
    // Check if already exists
    const exists = user[arrayKey].find((i: any) => i.id === item.id);
    if (!exists) {
      user[arrayKey].push(item);
    }
  } else if (action === "remove") {
    user[arrayKey] = user[arrayKey].filter((i: any) => i.id !== item.id);
  }

  // Mongoose mixed array modification requires marking as modified
  user.markModified(arrayKey);
  await user.save();

  return NextResponse.json({ success: true });
}
