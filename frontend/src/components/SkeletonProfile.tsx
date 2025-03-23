import { Skeleton } from "./ui/skeleton";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

const SkeletonProfile = () => {
  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-10 p-8">
        <div className="grid grid-cols-2">
          {/* Profile Picture Skeleton */}
          <section className="flex items-center justify-center">
            <Avatar className="w-32 h-34">
              <Skeleton className="w-32 h-32 rounded-full" />
            </Avatar>
          </section>
          {/* Profile Details Skeleton */}
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Button
                  variant={"secondary"}
                  className="cursor-pointer hover:bg-gray-200 h-8 w-28"
                  disabled
                >
                  <Skeleton className="h-5 w-20" />
                </Button>
                <Button
                  variant={"secondary"}
                  className="cursor-pointer hover:bg-gray-200 h-8 w-28"
                  disabled
                >
                  <Skeleton className="h-5 w-20" />
                </Button>
              </div>
              <div className="flex items-center gap-6">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <div className="flex flex-col gap-1 text-[14px]">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Badge
                  variant={"secondary"}
                  className="w-fit flex items-center"
                >
                  <AtSign />
                  <Skeleton className="h-4 w-20 ml-2 rounded-md" />
                </Badge>
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-36 rounded-md" />
              </div>
            </div>
          </section>
        </div>
        {/* Tabs */}
        <div className="border-t border-t-gray-300">
          <div className="flex items-center justify-center gap-10 text-sm">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          {/* Posts Skeleton */}
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="relative group cursor-pointer">
                <Skeleton className="rounded-sm my-2 w-full aspect-square" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <Skeleton className="h-4 w-6 rounded-md" />
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <Skeleton className="h-4 w-6 rounded-md" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProfile;
