"use client";

import TransactionTable from "@/components/TransactionTable";
import { useAuth } from "@/components/useAuth";
import Profile from "@/components/Profile";

export default function TransactionsPage() {
    useAuth();

    return (
        <div className="relative min-h-screen p-12">
            <TransactionTable params={{}}/>
            <Profile className="absolute top-4 right-4"/>
        </div>
    );
}
