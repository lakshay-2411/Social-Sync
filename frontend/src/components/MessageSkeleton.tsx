const MessageSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`flex ${
            index % 2 === 0 ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`p-2 rounded-lg max-w-xs bg-gray-300 animate-pulse h-6 w-28`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
