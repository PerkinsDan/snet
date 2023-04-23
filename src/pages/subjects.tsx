import prisma from "lib/prisma";
import Link from "next/link";
import Layout from "~/components/Layout";

type Props = {
    subjects: Subject[];
};

const Subjects = ({ subjects }: Props) => {
    return (
        <Layout>
            <div className="min-h-screen w-full text-white">
                <div className="flex items-center justify-between border border-slate-800 p-8">
                    <h1 className="text-center text-xl font-bold text-white">
                        Subjects
                    </h1>
                </div>
                <ul className="border-r border-slate-800">
                    {subjects.map((subject) => {
                        return (
                            <li
                                key={subject.id}
                                className="border-b border-slate-800 p-8"
                            >
                                <Link href={`/subjects/${subject.name}`}>
                                    {subject.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Layout>
    );
};

export default Subjects;

export const getServerSideProps = async () => {
    const subjects = await prisma.subject.findMany({});

    return {
        props: {
            subjects,
        },
    };
};
