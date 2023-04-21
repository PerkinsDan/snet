import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Loading = () => {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-white" />
        </div>
    );
};

export default Loading;
