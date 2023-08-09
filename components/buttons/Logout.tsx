"use client";

import { SignOutButton, SignedIn } from "@clerk/nextjs"
import Image from "next/image"
import { useRouter } from "next/navigation"

const Logout = () => {
    const router = useRouter();
    
    return (
        <SignedIn>
            <SignOutButton signOutCallback={()=> router.push("/sign-in")}>
                <div className="flex cursor-pointer">
                    <Image
                        src={"/assets/logout.svg"}
                        alt="logout"
                        width={24}
                        height={24}
                    />

                    <p className="text-light-2 max-lg:hidden">
                        Logout
                    </p>
                </div>
            </SignOutButton>
        </SignedIn>
    )
}

export default Logout