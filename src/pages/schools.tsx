import prisma from "lib/prisma";
import Link from "next/link";

type Props = {
    schools: School[];
};

const Schools = ({ schools }: Props) => {
    return (
        <div className="text-white min-h-screen w-full">
            <div className="flex items-center justify-between border border-slate-800 p-8">
                <h1 className="text-center text-xl font-bold text-white">
                    Schools
                </h1>
            </div>
            <ul className="border-r border-slate-800">
                {schools.map((school) => {
                    return (
                        <li key={school.id} className="p-8 border-b border-slate-800">
                            <Link href={`/schools/${school.id}`}>
                                {school.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
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
