import AccountProfile from "@/components/forms/AccountProfile"
import { currentUser } from "@clerk/nextjs"

const page = async () => {
  const user = await currentUser();
  const userFromDB = {}

  const userData = {
    id: user?.id,
    objectId: userFromDB?._id,
    username: userFromDB?.username || user?.username,
    name: userFromDB?.name || user?.firstName || "",
    bio: userFromDB?.bio || "",
    image: userFromDB?.image || user?.imageUrl

  }
  return (
  <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">
        Onboarding
      </h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile
          user={userData}
          btnLabel="Continue"
        />
      </section>
    </main>
  )
}

export default page