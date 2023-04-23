import { SignIn } from "@clerk/nextjs";
import { type NextPage } from "next";
import NoLayout from "~/components/NoLayout";

const Home: NextPage = () => {
  return (
    <NoLayout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-400">Welcome to</h1>
        <h1 className=" text-8xl font-extrabold text-white">SNET</h1>
      </div>
      <SignIn />
    </NoLayout>
  );
};

export default Home;
