import { type User } from "@clerk/nextjs/dist/api";
import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dayjs from "../../lib/dayjs";
import { type FormEvent, useState } from "react";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import prisma from "../../lib/prisma";
import { ArrowsRightLeftIcon, PencilIcon } from "@heroicons/react/24/solid";

type Props = {
    feed: Post[];
};

const Post = (props: Post) => {
    const { post, author } = props;

    return (
        <div className="flex items-center gap-3 border-b border-slate-800 p-4">
            <Image
                src={author.profileImageUrl}
                alt="profile"
                height={50}
                width={50}
                className="rounded-full"
            />
            <div className="flex flex-col">
                <p>
                    <span className="font-bold">{`${author.firstName} ${author.lastName}`}</span>{" "}
                    · {`${dayjs(post.createdAt).fromNow()} `}
                </p>
                <p>{post.content}</p>
            </div>
        </div>
    );
};

const PostCreator = () => {
    const [content, setContent] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [showPostCreator, setShowPostCreator] = useState(true);

    const { user, isSignedIn } = useUser();
    if (!isSignedIn) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const body = { content, isPublic, authorId: user.id };

        fetch("/api/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }).catch((error) => console.error(error));

        setShowPostCreator(false);
    };

    if (!showPostCreator) return null;

    return (
        <div className={`absolute h-1/2 w-1/2 bg-slate-500`}>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center"
            >
                <input
                    type="text"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                />
                <input
                    type="checkbox"
                    onChange={(e) => setIsPublic(e.target.checked)}
                    checked={isPublic}
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

const Feed = ({ feed }: Props) => {
    return (
        <div className="border-x border-slate-800 text-slate-200">
            {feed.map((post) => {
                return <Post key={post.post.id} {...post} />;
            })}
        </div>
    );
};

const Home: NextPage<Props> = ({ feed }) => {
    const [showPostCreator, setShowPostCreator] = useState(false);
    const [showPublicPosts, setShowPublicPosts] = useState(true);

    const user = useUser();

    if (!feed) feed = [];

    const privateFeed = feed.filter(({ post }) => post.public === false);

    return (
        <>
            <Head>
                <title>SNET</title>
                <meta name="description" content="The best school network" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-gray-900">
                <div className="container flex flex-col items-center justify-center gap-12">
                    {!user.isSignedIn ? (
                        <>
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-[#19191A]">
                                    Welcome to
                                </h1>
                                <h1 className=" text-8xl font-extrabold text-white">
                                    SNET
                                </h1>
                            </div>
                            <SignIn />
                        </>
                    ) : (
                        <>
                            <div className="min-h-screen">
                                <nav className="background-contrast-50 sticky top-0 flex items-center justify-between border-b border-slate-800 p-6 backdrop-blur-xl">
                                    <h1 className="text-xl font-bold text-white">
                                        {showPublicPosts
                                            ? "Public Feed"
                                            : "Private Feed"}
                                    </h1>
                                    <button
                                        onClick={() =>
                                            setShowPublicPosts(!showPublicPosts)
                                        }
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-md shadow-blue-500/30 transition hover:bg-blue-600"
                                    >
                                        <ArrowsRightLeftIcon className="h-6 w-6 text-white" />
                                    </button>
                                </nav>
                                {showPublicPosts ? (
                                    <Feed feed={feed} />
                                ) : (
                                    <Feed feed={privateFeed} />
                                )}
                            </div>
                            {showPostCreator ? <PostCreator /> : null}
                            <div className="background-blur-200 sticky bottom-0 flex w-full justify-between p-6 backdrop-blur">
                                <button className="flex items-center justify-center gap-3 rounded-lg border border-slate-800 p-2 shadow shadow-slate-800/50">
                                    <Image
                                        src={user.user.profileImageUrl}
                                        alt="profile"
                                        height={40}
                                        width={40}
                                        className="rounded-full"
                                    />
                                    <p className="text-light text-white">
                                        {user.user.fullName}
                                    </p>
                                </button>
                                <button
                                    onClick={() =>
                                        setShowPostCreator(!showPostCreator)
                                    }
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-md shadow-blue-500/30 transition hover:bg-blue-600"
                                >
                                    <PencilIcon className="h-6 w-6 text-white" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </>
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

            return {
                post,
                author: {
                    ...author,
                    firsName: author.firstName,
                    lastName: author.lastName,
                    school: authorSchool,
                },
            };
        })
        .filter(Boolean);

    return {
        props: { feed },
    };
};
