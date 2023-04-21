import { type NextApiRequest, type NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'

type PostBody = {
    content: string;
    isPublic: boolean;
    authorId: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { content, isPublic, authorId } = req.body as PostBody;

    const body = content.trim();

    if (body.length === 0) {
        return res.status(400).json({ message: 'Content is required' });
    }

    const result = await prisma.post.create({
        data: {
            content,
            public: isPublic,
            authorId,
        },
    });

    res.json(result);
}
