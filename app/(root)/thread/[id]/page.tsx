import ThreadCard from "@/components/cards/ThreadCard"
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
    if (!params.id) return null;
    const user = await currentUser()
    if (!user) return null;

    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboarding")

    const thread = await fetchThreadById(params.id)

    return (
        <section className="relative">
            <div>
                <ThreadCard
                    id={thread.id}
                    currentUserId={user?.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    writtenAt={thread.writtenAt}
                    comments={thread.children}
                    isLiked={userInfo?.likedThreads?.includes(thread._id)}
                />
            </div>
            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImage={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {
                    thread.children.map((childItem: any) => (
                        <ThreadCard
                            id={childItem.id}
                            currentUserId={user?.id || ""}
                            parentId={childItem.parentId}
                            content={childItem.text}
                            author={childItem.author}
                            community={childItem.community}
                            writtenAt={childItem.writtenAt}
                            comments={childItem.children}
                            isComment
                            isLiked={userInfo.likedThreads.includes(childItem._id)}
                        />
                    ))
                }
            </div>
        </section>
    )
}

export default page