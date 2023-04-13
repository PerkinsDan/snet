import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";

const CreateAccount = () => {
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

            await router.push('/')
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
                    onChange={(e) => setSchool(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateAccount;
