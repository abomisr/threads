import { formatDateString } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import ThreadCardControl from "../ThreadCardControl"


interface Props {
    id: string,
    currentUserId: string,
    parentId: string | null,
    content: string,
    author: {
        id: string,
        image: string,
        name: string,
    },
    community: {
        id: string,
        image: string,
        name: string,
    } | null,
    writtenAt: string,
    comments: {
        author: {
            image: string,
        }
    }[],
    isLiked: boolean,
    isComment?: boolean,
}
const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    writtenAt,
    comments,
    isComment,
    isLiked,
}: Props) => {
    

    return (
        <article className={`flex flex-col rounded-xl w-full 
            ${isComment ? "px-0 xs:px-7" : "p-7 bg-dark-2"}
        `}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image
                                src={author.image}
                                alt={author.name + " | Profile image"}
                                fill
                                className="cursor-pointer rounded-full"
                            />
                        </Link>

                        <div className="thread-card_bar" />
                    </div>

                    <div className="flex flex-col w0-full">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">
                                {author.name}
                            </h4>
                        </Link>

                        <p className="mt-2 text-small-regular text-light-2">
                            {content}
                        </p>

                        <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
                            <ThreadCardControl
                                isLiked={isLiked}
                                userId={currentUserId}
                                threadId={id}
                             />

                            {
                                isComment && comments.length > 0 && (
                                    <Link href={`/thread/${id}`}>
                                        <p className="mt-1 text-subtle-medium text-gray-1">
                                            {comments.length} replies
                                        </p>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>

            </div>
            {
                !isComment && community && (
                    <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
                        <p className="text-subtle-medium text-gray-1">
                            {formatDateString(writtenAt)} {" "} - {community.name} Community
                        </p>

                        <Image
                            src={community.image}
                            alt={community.name}
                            width={15}
                            height={15}
                            className="ml-1 rounded-full object-cover"
                        />
                    </Link>
                )
            }
        </article>
    )
}

export default ThreadCard