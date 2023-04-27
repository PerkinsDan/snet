import { type NextApiRequest, type NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'

type PostBody = {
    content: string;
    isPublic: boolean;
    authorId: string;
    subjectId: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { content, isPublic, authorId, subjectId } = req.body as PostBody;

    const body = content.trim();

    if (body.length === 0) {
        return res.status(400).json({ message: 'Content is required' });
    }

    if (body.length > 600) {
        return res.status(400).json({ message: 'Content is too long' });
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
