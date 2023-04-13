import { useUser } from "@clerk/nextjs";
import prisma from "lib/prisma";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";

type Props = {
    schools: School[];
};

const CreateAccount = ({ schools }: Props) => {
    const [school, setSchool] = useState("");

    const router = useRouter();

    const { user } = useUser();

    if (!user) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const body = { school, userId: user.id };

        try {
            await fetch("/api/create-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            await router.push("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Create Profile</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="school">School</label>
                <input
                    type="text"
                    id="school"
                    name="school"
                    value={school}
                    list="schools"
                    onChange={(e) => setSchool(e.target.value)}
                />
                <datalist id="schools">
                    {schools.map((school) => (
                        <option key={school.id} value={school.name} />
                    ))}
                </datalist>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateAccount;

export const getServerSideProps: GetServerSideProps = async () => {
    const schools = await prisma.school.findMany();

    return {
        props: { schools },
    };
};
