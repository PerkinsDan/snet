import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dayjs from "../../lib/dayjs";
import { type FormEvent, useState } from "react";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "";

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
    const [showPostCreator, setShowPostCreator] = useState(true);

    const { user, isSignedIn } = useUser();
    if (!isSignedIn) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const body = { content, authorId: user.id };

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
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                <input
                    type="text"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

const Feed = ({ feed }: Props) => {
    return (
        <div className="border-x border-slate-800">
            {feed.map((post) => (
                <Post key={post.post.id} {...post} />
            ))}
        </div>
    );
};

const Home: NextPage<Props> = ({ feed }) => {
    const [showPostCreator, setShowPostCreator] = useState(false);

    const user = useUser();

    return (
        <>
            <Head>
                <title>SNET</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-800 to-blue-950">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
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
                            <Feed feed={feed} />
                            {showPostCreator ? (
                                <PostCreator />
                            ) : null}
                            <button
                                onClick={() =>
                                    setShowPostCreator(!showPostCreator)
                                }
                                className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-blue-500"
                            >
                                !
                            </button>
                            <SignOutButton />
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
    let feed: Post[] = [];

    try {
        await fetch(`${NEXT_PUBLIC_URL}/api/posts`)
            .then((res) => res.json())
            .then((json: Post[]) => {
                feed = json;
            });
    } catch (error) {
        console.error(error);
    }

    return {
        props: { feed },
    };
};
