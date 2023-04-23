import { useUser } from "@clerk/nextjs";
import prisma from "lib/prisma";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";
import NoLayout from "~/components/NoLayout";

type Props = {
    schools: School[];
};

const CreateAccount = ({ schools }: Props) => {
    const [school, setSchool] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const { user } = useUser();

    if (!user) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const body = { school, userId: user.id };

        try {
            const res = await fetch("/api/create-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.status === 200) {
                await router.push("/");
            } else {
                const { error } = (await res.json()) as { error: string };
                setError(error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <NoLayout>
            <div className="flex flex-col items-center justify-center gap-12 text-white">
                <h1 className="text-xl font-bold">Create Profile: </h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center gap-8"
                >
                    <div className="flex items-center gap-3">
                        <label htmlFor="school">School: </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="school"
                                name="school"
                                value={school}
                                list="schools"
                                onChange={(e) => setSchool(e.target.value)}
                                className="rounded border border-white bg-transparent"
                            />
                            <datalist id="schools">
                                {schools.map((school) => (
                                    <option
                                        key={school.id}
                                        value={school.name}
                                    />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="rounded-lg border border-white px-4 py-2"
                    >
                        Create
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

export default CreateAccount;

export const getServerSideProps: GetServerSideProps = async () => {
    const schools = await prisma.school.findMany();

    return {
        props: { schools },
    };
};
