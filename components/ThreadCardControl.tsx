"use client";


import Image from "next/image"
import Link from "next/link"
import { useState } from "react";
import { BsBalloonHeartFill } from "react-icons/bs";
import axios from "axios"


const ThreadCardControl = ({
    isLiked: liked,
    threadId,
    userId,
}: {
    isLiked: boolean,
    threadId: string,
    userId: string,
}) => {
    const [isLiked, setIsLiked] = useState(liked)


    const handleLike = async () => {
        setIsLiked(prev=>!prev)
        await axios.post("/api/threads/like", { userId, threadId });
    }


    return (
        <div className="flex gap-3.5">
            <button onClick={handleLike}>
                {
                    isLiked ?
                        <BsBalloonHeartFill size={24} className="fill-red-600" />
                        :
                        <Image
                            src={"/assets/heart-gray.svg"}
                            alt="heart"
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                }
            </button>
            <Link href={`/thread/${threadId}`}>
                <Image
                    src={"/assets/reply.svg"}
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                />
            </Link>
            <Image
                src={"/assets/repost.svg"}
                alt="repost"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
            />
            <Image
                src={"/assets/share.svg"}
                alt="share"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
            />
        </div>
    )
}

export default ThreadCardControl