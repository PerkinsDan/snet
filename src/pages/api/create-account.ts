import { type NextApiRequest, type NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type AccountInfo = {
    school: string;
    userId: string;
};

const fetchSchoolId = async (school: string) => {
    const schoolId = await prisma.school.findUnique({
        where: {
            name: school,
        },
        select: {
            id: true,
        },
    });

    return schoolId;
};


export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { school, userId } = req.body as AccountInfo;

    let schoolId = await fetchSchoolId(school);

    if (!schoolId) {
        await prisma.school.create({
            data: {
                name: school,
            },
        });

        schoolId = await fetchSchoolId(school);
    }

    const result = await prisma.profile.create({
        data: {
            schoolId: (schoolId ? schoolId.id :  ""),
            userId,
        },
    });

    res.json(result);
}
