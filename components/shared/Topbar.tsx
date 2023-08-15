import { OrganizationSwitcher } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import Logout from "../buttons/Logout"

const Topbar = () => {
  return (
    <nav className="topbar">
      <Link href={"/"} className="flex items-center gap-4">
        <Image
          src={"/assets/logo.svg"}
          alt="logo"
          width={34}
          height={34}
        />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">
          Threads
        </p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="max-md:block hidden">
        <Logout />
        </div>
        <OrganizationSwitcher 
          appearance={{
            elements:{
              organizationSwitcherTrigger: "py-2 px-4"
            }
          }}
        />
      </div>
    </nav>
  )
}

export default Topbar