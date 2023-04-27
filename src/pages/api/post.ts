import { type NextApiRequest, type NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type PostBody = {
    content: string;
    isPublic: boolean;
    authorId: string;
    subjectId: string;
};

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { content, isPublic, authorId, subjectId } = req.body as PostBody;

        const body = content.trim();

        if (body.length === 0) {
            return res.status(400).json({ message: "Content is required" });
        }

        if (body.length > 600) {
            return res.status(400).json({ message: "Content is too long" });
        }

        const result = await prisma.post.create({
            data: {
                content,
                public: isPublic,
                authorId,
                subjectId,
            },
        });

        res.json(result);
    }

    if (req.method === "DELETE") {
        const { id } = req.query as { id: string };

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        try {
            const post = await prisma.post.delete({
                where: { id },
            });

            return res.status(200).json(post);
        } catch (err) {
            return res.status(500).json({ message: "Server error" });
        }
    }
}
