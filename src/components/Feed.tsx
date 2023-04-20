import Link from "next/link";
import Image from "next/image";
import dayjs from "../../lib/dayjs";

type Props = {
    feed: Post[];
};

const Post = (props: Post) => {
    const { post, author } = props;

    return (
        <div className="flex items-center gap-3 border-b border-slate-800 p-4">
            <Link href={`/profile/${author.id}`}>
                <Image
                    src={author.profileImageUrl}
                    alt="profile"
                    height={50}
                    width={50}
                    className="rounded-full"
                />
            </Link>
            <div className="flex flex-col w-full">
                <Link href={`/profile/${author.id}`} className="flex w-full justify-between">
                    <p>
                        <span className="font-bold">{`${author.firstName} ${author.lastName}`}</span>{" "}
                        · {`${dayjs(post.createdAt).fromNow()} `}
                    </p>
                    <span className="hidden sm:block">{author.schoolName}</span>
                </Link>
                <p>{post.content}</p>
            </div>
        </div>
    );
};

const Feed = ({ feed }: Props) => {
    return (
        <div className="min-w-120 border-x border-slate-800 text-slate-200">
            {feed.map((post) => {
                return <Post key={post.post.id} {...post} />;
            })}
        </div>
    );
};

export default Feed;
