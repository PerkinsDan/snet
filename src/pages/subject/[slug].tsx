import { type User } from "@clerk/nextjs/dist/api";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import prisma from "lib/prisma";
import { type GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Feed from "~/components/Feed";

type Props = {
    feed: Post[];
};

const Profile = ({ feed }: Props) => {
    const router = useRouter();
    const { slug } = router.query;

    feed = feed.filter(({ post }) => post.subjectName === slug);

    return (
        <div className="min-h-screen w-full max-w-2xl">
            <div className="border border-slate-800 p-8 text-white">
                <h1 className="text-2xl font-bold ">
                    {slug}
                </h1>
                <p>Get support for {slug} or help others by answering their question</p>
            </div>
            <Feed feed={feed} />
        </div>
    );
};

export default Profile;

const filterUserForClient = (user: User) => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
    };
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { userId } = getAuth(ctx.req);

    if (!userId) {
        return {
            props: {},
        };
    }

    const data = await prisma.post.findMany({});

    // Convert createdAt to ISO string
    const posts = data.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
    }));

    const users = (
        await clerkClient.users.getUserList({
            userId: posts.map((post) => post.authorId),
            limit: 100,
        })
    ).map(filterUserForClient);

    const profiles = await prisma.profile.findMany({});
    const schools = await prisma.school.findMany({});
    const subjects = await prisma.subject.findMany({});

    const feed = posts
        .map((post) => {
            const author = users.find((user) => user.id === post.authorId);

            if (!author || !author.id) {
                throw new Error("Author not found");
            }

            const authorSchool = profiles.find(
                (profile) => profile.userId === author.id
            )?.schoolId;

            const userSchool = profiles.find(
                (profile) => profile.userId === userId
            )?.schoolId;

            if (authorSchool !== userSchool && !post.public) {
                return null;
            }

            const schoolName = schools.find(
                (school) => school.id === authorSchool
            )?.name;

            const subjectName = subjects.find(
                (subject) => subject.id === post.subjectId
            )?.name;

            return {
                post: {
                    ...post,
                    subjectName,
                },
                author: {
                    ...author,
                    firsName: author.firstName,
                    lastName: author.lastName,
                    schoolName,
                },
            };
        })
        .filter(Boolean);

    return {
        props: { feed },
    };
};
