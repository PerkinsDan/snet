import { type User } from "@clerk/nextjs/dist/api";
import { useUser } from "@clerk/nextjs";
import { type GetServerSideProps } from "next";
import { useState } from "react";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import prisma from "../../lib/prisma";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import Feed from "../components/Feed";
import Layout from "~/components/Layout";

type Props = {
    feed: Post[];
};

const Home = ({ feed }: Props) => {
    const [showPublicPosts, setShowPublicPosts] = useState(true);

    const { isSignedIn } = useUser();
    if (!isSignedIn) return null;

    if (!feed) feed = [];

    const publicFeed = feed.filter(({ post }) => post.public);
    const privateFeed = feed.filter(({ author }) => author.sameSchool);

    return (
        <Layout>
            <div className="min-h-screen w-full">
                <nav className="background-contrast-50 sticky top-0 flex items-center justify-between border border-slate-800 p-6 backdrop-blur-xl">
                    <h1 className="text-xl font-bold text-white">
                        {showPublicPosts ? "Public Feed" : "My School Feed"}
                    </h1>
                    <button
                        onClick={() => setShowPublicPosts(!showPublicPosts)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-md shadow-blue-500/30 transition hover:bg-blue-600"
                    >
                        <ArrowsRightLeftIcon className="h-6 w-6 text-white" />
                    </button>
                </nav>
                {showPublicPosts ? (
                    <Feed feed={publicFeed} />
                ) : (
                    <Feed feed={privateFeed} />
                )}
            </div>
        </Layout>
    );
};

export default Home;

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

    const data = await prisma.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

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
                    sameSchool: authorSchool === userSchool,
                },
            };
        })
        .filter(Boolean);

    return {
        props: { feed },
    };
};
