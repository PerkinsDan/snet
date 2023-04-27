import { type NextApiRequest, type NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.body as { userId: string };

    const isAdmin = await prisma.profile.findUnique({
        where: {
            userId,
        },
        select: {
            admin: true,
        },
    });

    if (!isAdmin?.admin) {
        return res.status(401).json({ isAdmin });
    }

    res.status(200).json({ isAdmin });
}
