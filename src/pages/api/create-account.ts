import { type NextApiRequest, type NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type AccountInfo = {
    school: string;
    userId: string;
};

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { school, userId } = req.body as AccountInfo;

    const schoolId = await prisma.school.findUnique({
        where: {
            name: school,
        },
        select: {
            id: true,
        },
    });

    if (!schoolId) {
        res.status(404).json({ error: "School not found" });
        return;
    }

    const result = await prisma.profile.create({
        data: {
            schoolId: schoolId.id,
            userId,
        },
    });

    res.json(result);
}
