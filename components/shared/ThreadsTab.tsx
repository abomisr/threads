import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
    accountType: string,
    accountId: string,
    currentUserId: string,
}

const ThreadsTab = async ({
    accountType,
    accountId,
    currentUserId,
}: Props) => {
    let result:any;

    if(accountType === "Community"){
        result = await fetchCommunityPosts(accountId)
    }else{
        result = await fetchUserPosts(accountId)
    }

    if (!result) redirect("/")

    const userInfo = await fetchUser(currentUserId)

    return (
        <section className="mt-9 flex flex-col gap-10">
            {
                result.threads.map((thread:any) => (
                    <ThreadCard
                        key={thread.id}
                        id={thread.id}
                        currentUserId={currentUserId}
                        parentId={thread.parentId}
                        content={thread.text}
                        author={
                            accountType === "User"
                            ? {name:result.name,image:result.image,id:result.id}
                            : {name:thread.author.name,image:thread.author.image,id:thread.author.id}
                        }
                        community={thread.community}
                        writtenAt={thread.writtenAt}
                        comments={thread.children}
                        likes={thread?.likes}
                        isLiked={userInfo?.likedThreads?.includes(thread._id)}
                    />
                ))
            }
        </section>
    )
}

export default ThreadsTab