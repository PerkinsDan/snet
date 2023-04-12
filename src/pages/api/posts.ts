import { type User } from "@clerk/nextjs/dist/api";
import { type NextApiRequest, type NextApiResponse } from "next";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "../../../lib/prisma";

const filterUserForClient = (user: User) => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
    };
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const data = await prisma.post.findMany({});

    const feed = data.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
    }));

    const users = (
        await clerkClient.users.getUserList({
            userId: feed.map((post) => post.authorId),
            limit: 100,
        })
    ).map(filterUserForClient);

    const posts = feed.map((post) => {
        const author = users.find((user) => user.id === post.authorId);

        if (!author || !author.id) {
            throw new Error("Author not found");
        }

        return {
            post,
            author: {
                ...author,
                firsName: author.firstName,
                lastName: author.lastName,
            },
        };
    });

    res.status(200).json(posts);
}
