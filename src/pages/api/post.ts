import { type NextApiRequest, type NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'

type PostBody = {
    content: string;
    authorId: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { content, authorId } = req.body as PostBody;

    const result = await prisma.post.create({
        data: {
            content,
            authorId,
        },
    });

    res.json(result);
}
