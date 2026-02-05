// components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const { isAuthenticated, user, logout, loadUser } = useAuth();

    const [mounted, setMounted] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isAuthenticated && !user) {
            (async () => {
                try {
                    await loadUser();
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }, [isAuthenticated, user, loadUser]);

    const handleLogoutClick = () => {
        logout();
        setShowMobileMenu(false);
        setShowProfileMenu(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setShowMobileSearch(false);
        }
    };

    // Show loading/placeholder state during SSR and initial hydration
    if (!mounted) {
        return (
            <nav className="w-full border-b border-gray-200 bg-white">
                <div className="layout-gutter">
                    <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
                        {/* LOGO */}
                        <div className="flex shrink-0 items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/assets/icons/Logo.svg"
                                    alt="Your Logo"
                                    width={48}
                                    height={48}
                                    className="h-8 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Placeholder space */}
                        <div className="flex-1" />
                        
                        {/* Right side placeholder */}
                        <div className="w-24 h-10" />
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            <nav className="w-full border-b border-gray-200 bg-white">
                <div className="layout-gutter">
                    <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
                        {/* LOGO - Always visible */}
                        <div className="flex shrink-0 items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/assets/icons/Logo.svg"
                                    alt="Your Logo"
                                    width={48}
                                    height={48}
                                    className="h-8 w-auto"
                                />
                            </Link>
                        </div>

                        {/* SEARCH - Desktop (hidden on mobile search) */}
                        {!showMobileSearch && (
                            <div className="hidden lg:flex flex-1 justify-center px-6">
                                <form onSubmit={handleSearch} className="w-full max-w-md">
                                    <div className="flex h-12 items-center rounded-xl border border-gray-300 bg-white px-4 focus-within:border-blue-500 transition-colors">
                                        <div className="flex h-10 w-10 items-center justify-center">
                                            <Image
                                                src="/assets/icons/search.svg"
                                                alt="Search"
                                                width={20}
                                                height={20}
                                                className="opacity-50"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                                        />
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* RIGHT */}
                        <div className="flex shrink-0 items-center gap-4">
                            {/* Mobile Search Icon - Always show on mobile */}
                            <button
                                onClick={() => setShowMobileSearch(true)}
                                className="lg:hidden p-1"
                            >
                                <Image
                                    src="/assets/icons/search.svg"
                                    alt="Search"
                                    width={24}
                                    height={24}
                                />
                            </button>

                            {isAuthenticated ? (
                                <>
                                {/* Desktop - Write Post */}
                                 <Link
                                    href="/write"
                                    className="
                                    hidden lg:flex
                                    items-center justify-center
                                    w-max h-max
                                    rounded-full
                                    transition-all duration-300 ease-out
                                    hover:bg-blue-50
                                    hover:scale-110
                                    active:scale-95
                                    group
                                    "
                                >
                                    <Image
                                        src="/assets/icons/Write_Post.svg"
                                        alt="Write"
                                        width={68}
                                        height={68}
                                        className="
                                        transition-transform duration-300 ease-out
                                        grouh-30 w-30
                                        mr-12
                                        "
                                        
                                    />
                                </Link>
                                    

                                    {/* Profile - Desktop & Mobile */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowProfileMenu((v) => !v)}
                                            className="flex items-center gap-2"
                                        >
                                            <Image
                                                src={
                                                    user?.avatarUrl || "/assets/images/default-avatar.png"
                                                }
                                                alt={user?.name || "User"}
                                                width={40}
                                                height={40}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <span className="hidden lg:block text-sm font-medium text-gray-900">
                                                {user?.name}
                                            </span>
                                        </button>

                                        {showProfileMenu && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setShowProfileMenu(false)}
                                                />
                                                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                                                        onClick={() => setShowProfileMenu(false)}
                                                    >
                                                        <Image
                                                            src="/assets/icons/user.svg"
                                                            alt="Profile"
                                                            width={20}
                                                            height={20}
                                                        />
                                                        <span>Profile</span>
                                                    </Link>
                                                    <button
                                                        onClick={handleLogoutClick}
                                                        className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Image
                                                            src="/assets/icons/logout.svg"
                                                            alt="Logout"
                                                            width={20}
                                                            height={20}
                                                        />
                                                        <span>Logout</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Desktop - Not Authenticated */}
                                    <Link
                                        href="/login"
                                        className="hidden lg:block text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
                                    >
                                        Login
                                    </Link>

                                    {/* Separator */}
                                    <div className="hidden lg:block h-8 w-px bg-gray-300"></div>

                                    <Link
                                        href="/register"
                                        className="hidden lg:block rounded-full bg-blue-500 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                                    >
                                        Register
                                    </Link>

                                    {/* Mobile - Hamburger for Login/Register */}
                                    <button
                                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                                        className="lg:hidden p-2"
                                    >
                                        {showMobileMenu ? (
                                            // X Icon (Close)
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M18 6L6 18M6 6L18 18"
                                                    stroke="#111827"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        ) : (
                                            // Hamburger Icon
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M3 12H21M3 6H21M3 18H21"
                                                    stroke="#111827"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 lg:hidden">
                    <div className="layout-gutter">
                        <div className="flex h-16 items-center gap-3">
                            {/* Logo */}
                            <Link href="/" className="flex items-center shrink-0">
                                <Image
                                    src="/assets/icons/Logo.svg"
                                    alt="Your Logo"
                                    width={48}
                                    height={48}
                                    className="h-8 w-auto"
                                />
                            </Link>

                            {/* Search Form */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="flex h-12 items-center rounded-xl border border-gray-300 bg-white px-4 focus-within:border-blue-500 transition-colors">
                                    <Image
                                        src="/assets/icons/search.svg"
                                        alt="Search"
                                        width={20}
                                        height={20}
                                        className="opacity-50 mr-3"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                                    />
                                </div>
                            </form>

                            {/* Close button */}
                            <button
                                onClick={() => setShowMobileSearch(false)}
                                className="p-2 shrink-0"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M18 6L6 18M6 6L18 18"
                                        stroke="#111827"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Drawer */}
            {showMobileMenu && !isAuthenticated && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setShowMobileMenu(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                            <button onClick={() => setShowMobileMenu(false)} className="p-2">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M18 6L6 18M6 6L18 18"
                                        stroke="#111827"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            <Link
                                href="/login"
                                className="block w-full text-center py-4 text-gray-900 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="flex w-full sm:w-auto items-center justify-center sm:justify-start rounded-full py-3 text-center text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}