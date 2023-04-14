import { useUser } from "@clerk/nextjs";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useState, type FormEvent } from "react";

const PostCreator = () => {
    const [content, setContent] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [showPostCreator, setShowPostCreator] = useState(true);
    const [toolTip, setToolTip] = useState(false);

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
        <div
            className={`absolute left-0 top-0 min-h-screen w-full bg-gradient-to-b from-slate-950 to-gray-900`}
        >
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
                <button
                    type="submit"
                    className="rounded border border-slate-800 px-4 py-2 text-white hover:border-slate-400"
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default PostCreator;
