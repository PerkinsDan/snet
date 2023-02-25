import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get data submitted in request's body.
  const { email, password } = req.body;

  try {
    const user = await prisma.user
      .findUniqueOrThrow({
        where: {
          email,
        },
        select: {
          password: true,
        },
      })
      .catch(() => {
        return res.status(400).json({ errors: ["User doesn't exist"] });
      });

    const passwordsMatch = await bcrypt.compare(password, user?.password || "");

    if (!passwordsMatch) {
      return res.status(400).json({ errors: ["Password is incorrect"] });
    }

    res.status(200).send("User logged in successfully");
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server error");
  }
}
