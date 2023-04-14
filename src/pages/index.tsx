import { SignIn } from "@clerk/nextjs";
import { type NextPage } from "next";

const Home: NextPage = () => {
    return (
        <>
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#19191A]">
                        Welcome to
                    </h1>
                    <h1 className=" text-8xl font-extrabold text-white">
                        SNET
                    </h1>
                </div>
                <SignIn />
        </>
    );
};

export default Home;
