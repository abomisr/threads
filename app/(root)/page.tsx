import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  if(!user) return null
  const userInfo = await fetchUser(user?.id);
  const result = await fetchPosts(1, 30);


  return (
    <>
      <h1 className="head-text text-left">
        Home
      </h1>

      <section className="mt-9 flex flex-col gap-10">
        {
          result.posts.length === 0 ?
            <p className="no-result">
              No Threads found
            </p>
            :
            <>
              {result.posts.map((post) => (
                <ThreadCard
                  key={post._id}
                  id={post.id}
                  currentUserId={user?.id || ""}
                  parentId={post.parentId}
                  content={post.text}
                  author={post.author}
                  community={post.community}
                  writtenAt={post.writtenAt}
                  comments={post.children}
                  likes={post?.likes}
                  isLiked={userInfo?.likedThreads?.includes(post._id)}
                />
              ))}
            </>
        }
      </section>
    </>
  )
}
