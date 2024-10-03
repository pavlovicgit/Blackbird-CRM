import Link from "next/link";
import React from "react";
import { IoMdPerson, IoMdBriefcase, IoMdChatboxes, IoMdCash, IoMdHome } from "react-icons/io";

const SideNav = () => {
    return (
        <nav className="fixed left-0 top-0 h-screen w-40 p-4 bg-slate-50 border-2 border-black border-opacity-10">
            <ul className="flex flex-col space-y-4">
                <li className="py-4">
                    <img src="/images/blackbird logo.svg" alt="Logo" />
                </li>
                <li>
                    <Link href="/clients">
                        <div className="flex flex-row items-center space-x-2">
                            <IoMdPerson className="w-4 h-4" />
                            <span className="font-bold relative duration-250 cursor-pointer before:absolute before:-bottom-2 before:left-1/2 before:w-0 before:h-0.5 before:transition-all before:duration-500 before:bg-black before:from-black before:via-black before:to-black before:translate-x-[-50%] hover:before:w-full hover:before:opacity-100">
                                Clients
                            </span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link href="/projects">
                        <div className="flex flex-row items-center space-x-2">
                            <IoMdBriefcase className="w-4 h-4" />
                            <span className="font-bold relative duration-250 cursor-pointer before:absolute before:-bottom-2 before:left-1/2 before:w-0 before:h-0.5 before:transition-all before:duration-500 before:bg-black before:from-black before:via-black before:to-black before:translate-x-[-50%] hover:before:w-full hover:before:opacity-100">
                                Projects
                            </span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link href="/comments">
                        <div className="flex flex-row items-center space-x-2">
                            <IoMdChatboxes className="w-4 h-4" />
                            <span className="font-bold relative duration-250 cursor-pointer before:absolute before:-bottom-2 before:left-1/2 before:w-0 before:h-0.5 before:transition-all before:duration-500 before:bg-black before:from-black before:via-black before:to-black before:translate-x-[-50%] hover:before:w-full hover:before:opacity-100">
                                Comments
                            </span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link href="/transactions">
                        <div className="flex flex-row items-center space-x-2">
                            <IoMdCash className="w-4 h-4" />
                            <span className="font-bold relative duration-250 cursor-pointer before:absolute before:-bottom-2 before:left-1/2 before:w-0 before:h-0.5 before:transition-all before:duration-500 before:bg-black before:from-black before:via-black before:to-black before:translate-x-[-50%] hover:before:w-full hover:before:opacity-100">
                                Transactions
                            </span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        <div className="flex flex-row items-center space-x-2">
                            <IoMdHome className="w-4 h-4" />
                            <span className="font-bold relative duration-250 cursor-pointer before:absolute before:-bottom-2 before:left-1/2 before:w-0 before:h-0.5 before:transition-all before:duration-500 before:bg-black before:from-black before:via-black before:to-black before:translate-x-[-50%] hover:before:w-full hover:before:opacity-100">
                                Home
                            </span>
                        </div>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default SideNav;
