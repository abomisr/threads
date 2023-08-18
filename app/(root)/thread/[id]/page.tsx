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
                    key={thread.id}
                    id={thread.id}
                    currentUserId={user?.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    writtenAt={thread.writtenAt}
                    comments={thread.children}
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
                            key={childItem.id}
                            id={childItem.id}
                            currentUserId={user?.id || ""}
                            parentId={childItem.parentId}
                            content={childItem.text}
                            author={childItem.author}
                            community={childItem.community}
                            writtenAt={childItem.writtenAt}
                            comments={childItem.children}
                            isComment
                        />
                    ))
                }
            </div>
        </section>
    )
}

export default page