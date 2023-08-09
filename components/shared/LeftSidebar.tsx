"use client";

import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from "next/navigation"
import Logout from '../buttons/Logout';

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {
          sidebarLinks.map((link) => {
            const isActive = (pathname.includes(link.href) && link.href.length > 1) || pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <div className="text-light-1 max-lg:hidden">
                  {link.label}
                </div>
              </Link>
            )
          }
          )}
      </div>

      <div className="mt-10 px-6">
        <Logout />
      </div>
    </section>
  )
}

export default LeftSidebar