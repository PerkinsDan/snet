import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get data submitted in request's body.
  const { firstName, lastName, email, password, password2 } = req.body;

  let errors = [];

  if (password !== password2) {
    errors.push("Passwords do not match");
  }

  if (password.length < 6) {
    errors.push("Password should be at least 6 characters");
  }

  if (errors.length > 0) {
    // Sends a HTTP error code
    res.status(400);
    res.json({ errors });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(400).json({ errors: ["User already exists"] });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).send("User created successfully");
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server error");
  }
}
