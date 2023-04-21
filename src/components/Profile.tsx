import { SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";

const Profile = () => {
    const [showProfile, setShowProfile] = useState(false);

    const { user } = useUser();
    if (!user) return null;

    return (
        <div className="relative">
            <button
                className="flex items-center justify-center gap-3 rounded-lg border border-slate-800 p-2 shadow shadow-slate-800/50 w-max"
                onClick={() => setShowProfile(!showProfile)}
            >
                <Image
                    src={user.profileImageUrl}
                    alt="profile"
                    height={40}
                    width={40}
                    className="rounded-full"
                />
                <p className="text-light text-white">{user.fullName}</p>
            </button>
            {showProfile && (
                <div className="absolute bottom-full mb-4 flex w-full flex-col rounded-md border border-slate-800 bg-slate-900 text-center text-white shadow-md shadow-slate-400/50">
                    <a
                        className="border-b border-slate-700 py-2"
                        href={`/profiles/${user.id}`}
                    >
                        View Profile
                    </a>
                    <div className="py-2">
                        <SignOutButton />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
