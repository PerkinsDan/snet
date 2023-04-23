import { useUser } from "@clerk/nextjs";
import {
    ArrowUturnLeftIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { type GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import Loading from "~/components/Loading";
import NoLayout from "~/components/NoLayout";

type Props = {
    subjects: Subject[];
};

const CreatePost = ({ subjects }: Props) => {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [toolTip, setToolTip] = useState(false);
    const [error, setError] = useState("");
    const [subjectId, setSubjectId] = useState("");

    useEffect(() => {
        if (subjects[0]) {
            setSubjectId(subjects[0].id);
        }
    }, [subjects]);

    const router = useRouter();

    const { user, isSignedIn } = useUser();
    if (!isSignedIn) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setLoading(true);

        const body = { content, isPublic, authorId: user.id, subjectId };

        const res = await fetch("/api/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const { message } = (await res.json()) as { message: string };

        if (res.status === 200) {
            await router.push("/home");
        } else {
            setLoading(false);
            setError(message);
        }
    };

    if (loading) return <Loading />;

    return (
        <NoLayout>
            <div
                className={`min-h-screen w-full bg-gradient-to-b from-slate-950 to-gray-900`}
            >
                <Link href="/home">
                    <ArrowUturnLeftIcon className="ml-8 mt-8 h-8 w-8 text-white" />
                </Link>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center justify-center gap-8 p-8"
                >
                    <h1 className="text-2xl font-bold text-white">
                        Create your post:
                    </h1>
                    <textarea
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        placeholder="What's your question?"
                        className="h-40 w-full max-w-2xl border border-slate-800 bg-transparent p-2 text-white outline-none"
                    />
                    <div className="relative flex items-center gap-2">
                        <input
                            type="checkbox"
                            onChange={(e) => setIsPublic(!e.target.checked)}
                            checked={!isPublic}
                            className="rounded-full"
                        />
                        <label className="text-white">Private</label>
                        <div className="flex">
                            <div
                                onMouseEnter={() => setToolTip(true)}
                                onMouseLeave={() => setToolTip(false)}
                            >
                                <QuestionMarkCircleIcon className="h-6 w-6 text-slate-400" />
                            </div>
                            {toolTip && (
                                <p className="absolute z-10 ml-10 w-max rounded bg-slate-500 p-1 text-sm text-black text-white">
                                    When enabled only people from
                                    <br />
                                    your school can see the post.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <label className="text-white">Subject:</label>
                        <select
                            className="w-80 rounded bg-transparent text-white"
                            value={subjectId}
                            onChange={(e) => setSubjectId(e.target.value)}
                        >
                            {subjects.map((subject) => (
                                <option
                                    value={subject.id}
                                    key={subject.id}
                                    className="text-black"
                                >
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="rounded border border-slate-800 px-4 py-2 text-white hover:border-slate-400"
                    >
                        Post
                    </button>
                    {error.length > 0 && (
                        <div className="w-full rounded border border-red-500 p-4 text-red-500">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </NoLayout>
    );
};

export default CreatePost;

export const getServerSideProps: GetServerSideProps = async () => {
    const subjects = await prisma.subject.findMany({});

    return {
        props: { subjects },
    };
};
