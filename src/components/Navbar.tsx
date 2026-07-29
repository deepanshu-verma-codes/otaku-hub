"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button, buttonVariants } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "./ui/sheet";
import { Menu, X, Search, Bookmark } from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useGlobalStore();
  const pathname = usePathname();

  // Hide the global Navbar completely if we are reading a manga (the manga reader has its own header)
  if (pathname.startsWith('/manga/') && pathname.length > '/manga/'.length) {
    return null;
  }

  return (
    <nav className="bg-[#f5f5f5] sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-[40px] h-20 flex items-center justify-between">
        
        {/* Left: LOGO & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <div className="md:hidden flex items-center gap-2 text-[#0c0a09] cursor-pointer hover:text-[#4e4e4e] transition-colors" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </div>
          <Link href="/" className="text-[24px] font-serif font-light font-medium text-[#0c0a09] tracking-normal flex items-center gap-3">
            <img src="/logo.jpg" alt="OtakuHub Logo" className="w-8 h-8 rounded-full" />
            <span className="hidden sm:inline">OTAKUHUB</span>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {[
            { name: 'Gallery', href: '/gallery' },
            { name: 'Anime', href: '/anime' },
            { name: 'Trailers', href: '/trailers' },
            { name: 'Manga', href: '/manga' },
            { name: 'Quotes', href: '/quotes' },
            { name: 'News', href: '/news' },
          ].map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`relative font-medium text-[15px] transition-colors pb-1
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0c0a09] 
                  after:origin-left after:transition-transform after:duration-300
                  ${isActive ? 'after:scale-x-100 text-[#0c0a09]' : 'after:scale-x-0 hover:after:scale-x-100 text-[#4e4e4e] hover:text-[#0c0a09]'}
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="cursor-pointer border border-[#e7e5e4] rounded-full hover:border-[#0c0a09] transition-all">
                  <AvatarFallback className="bg-[#ffffff] shadow-sm text-[#0c0a09] rounded-full ">
                    {session.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#ffffff] shadow-sm border-[#e7e5e4] text-[#0c0a09] rounded-2xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className=" text-[12px] tracking-normal text-[#4e4e4e]">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#494949]" />
                  <DropdownMenuItem className="p-0 hover:bg-white hover:text-black focus:bg-white focus:text-black cursor-pointer rounded-2xl">
                    <Link href="/profile" className="w-full h-full px-4 py-3 text-[14px]  tracking-[0.15px]">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0 hover:bg-white hover:text-black focus:bg-white focus:text-black cursor-pointer rounded-2xl">
                    <Link href="/favorites" className="w-full h-full px-4 py-3 text-[14px]  tracking-[0.15px]">Favorites</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-[#494949]" />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="px-4 py-3 text-[#dc2626] hover:bg-[#ff3333] hover:text-[#0c0a09] focus:bg-[#ff3333] focus:text-[#0c0a09] cursor-pointer rounded-2xl  text-[14px] tracking-[0.15px]"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/signin" className={buttonVariants({ variant: "ghost", className: "hidden sm:flex  tracking-[0.15px] text-[14.4px]" })}>
                Log in
              </Link>
              <Link href="/auth/signup" className={buttonVariants({ className: "hidden sm:flex" })}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu Content / Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={(open) => !open && closeMobileMenu()}>
        <SheetContent side="left" className="bg-[#f5f5f5] border-r border-[#e7e5e4] px-[40px] py-[40px] flex flex-col gap-8 w-[80vw] sm:max-w-sm">
          <SheetHeader className="text-left mb-8 hidden">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 pt-12 items-start">
            {[
              { name: 'Gallery', href: '/gallery' },
              { name: 'Anime', href: '/anime' },
              { name: 'Trailers', href: '/trailers' },
              { name: 'Manga', href: '/manga' },
              { name: 'Quotes', href: '/quotes' },
              { name: 'News', href: '/news' },
            ].map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={closeMobileMenu}
                  className={`relative font-medium text-[18px] transition-colors pb-1 w-fit
                    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0c0a09] 
                    after:origin-left after:transition-transform after:duration-300
                    ${isActive ? 'after:scale-x-100 text-[#0c0a09]' : 'after:scale-x-0 hover:after:scale-x-100 text-[#4e4e4e] hover:text-[#0c0a09]'}
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          {!session && (
            <div className="pt-8 flex flex-col gap-4 border-t border-[#e7e5e4] mt-auto">
              <Link href="/auth/signin" onClick={closeMobileMenu} className={buttonVariants({ variant: "ghost", className: "w-full justify-start text-[15px]" })}>Log in</Link>
              <Link href="/auth/signup" onClick={closeMobileMenu} className={buttonVariants({ className: "w-full justify-start text-[15px]" })}>Sign up</Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </nav>
  );
}
