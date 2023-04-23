import prisma from "lib/prisma";
import Link from "next/link";
import Layout from "~/components/Layout";

type Props = {
    schools: School[];
};

const Schools = ({ schools }: Props) => {
    return (
        <Layout>
            <div className="min-h-screen w-full text-white">
                <div className="flex items-center justify-between border border-slate-800 p-8">
                    <h1 className="text-center text-xl font-bold text-white">
                        Schools
                    </h1>
                </div>
                <ul className="border-r border-slate-800">
                    {schools.map((school) => {
                        return (
                            <li
                                key={school.id}
                                className="border-b border-slate-800 p-8"
                            >
                                <Link href={`/schools/${school.id}`}>
                                    {school.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Layout>
    );
};

export default Schools;

export const getServerSideProps = async () => {
    const schools = await prisma.school.findMany({});

    return {
        props: {
            schools,
        },
    };
};
