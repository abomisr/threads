"use client";

import { sidebarLinks } from '@/constants'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Bottombar = () => {
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
      {
          sidebarLinks.map((link) => {
            const isActive = (pathname.includes(link.href) && link.href.length > 1) || pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`bottombar_link ${isActive && "bg-primary-500"}`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <div className="text-subtle-medium text-light-1 max-sm:hidden">
                  {link.label.split(/\s+/)[0]}
                </div>
              </Link>
            )
          }
          )}
      </div>
    </section>
  )
}

export default Bottombar