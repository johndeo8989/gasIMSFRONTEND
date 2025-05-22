const CardSkeleton = () => {
    return (
        <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 2xl:max-w-2xl shadow-sm rounded-xl p-5 sm:p-6 md:p-4 mx-auto animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-gray-200 mx-auto sm:mx-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 rounded" />
                </div>
            </div>

            <hr className="border-gray-200 my-4" />

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="w-full sm:w-36 h-4 bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="w-full sm:w-36 h-4 bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="w-full sm:w-36 h-4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
            </div>

            <div className="mt-6 h-10 w-full bg-gray-300 rounded" />
        </div>
    );
};

export default CardSkeleton;
