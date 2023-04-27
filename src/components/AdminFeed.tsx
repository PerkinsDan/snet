import Link from "next/link";
import Image from "next/image";
import dayjs from "../../lib/dayjs";

type Props = {
    feed: Post[];
};

const Post = (props: Post) => {
    const { post, author } = props;

    const handleSubmit = async () => {
        const res = await fetch(`/api/post/?id=${post.id}`, {
            method: "DELETE",
        });

        if (res.status === 200) {
            window.location.reload();
        } else {
            const { message } = (await res.json()) as { message: string };
            console.log(message);
        }
    };

    return (
        <div className="flex w-full border-b border-slate-800">
            <div className="flex w-full gap-3 p-4">
                <Link href={`/profiles/${author.id}`}>
                    <Image
                        src={author.profileImageUrl}
                        alt="profile"
                        height={50}
                        width={50}
                        className="rounded-full"
                    />
                </Link>
                <div className="flex w-full flex-col">
                    <div className="flex w-full flex-wrap justify-between">
                        <p>
                            <span className="font-bold">{`${author.firstName} ${author.lastName}`}</span>{" "}
                            · {`${dayjs(post.createdAt).fromNow()} `}
                        </p>
                        <p className="font-light italic">{author.schoolName}</p>
                    </div>
                    <p className="py-2">{post.content}</p>
                    <Link
                        href={`/subjects/${post.subjectName}`}
                        className="w-max self-end rounded border border-blue-500 px-2 py-1"
                    >
                        {post.subjectName}
                    </Link>
                </div>
            </div>
            <button
                className="py-auto bg-red-500 px-4 hover:bg-red-600"
                onClick={handleSubmit}
            >
                X
            </button>
        </div>
    );
};

const AdminFeed = ({ feed }: Props) => {
    return (
        <div className="min-w-120 border-x border-slate-800 text-slate-200">
            {feed.map((post) => {
                return <Post key={post.post.id} {...post} />;
            })}
        </div>
    );
};

export default AdminFeed;
