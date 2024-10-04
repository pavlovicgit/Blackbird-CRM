import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreateTransactionModal from './CreateTransactionModal';
import EditTransactionModal from './EditTransactionModal';
import { Transaction } from '../utils/types';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Updated formatDate function
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  RSD: 'РСД'
};

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTransactions = async () => {
    try {
      const queryParams = new URLSearchParams({
        searchQuery: searchQuery || "",
      });

      const response = await fetch(`http://localhost:5034/api/transactions?${queryParams.toString()}`);
      if (response.ok) {
        const data: Transaction[] = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      } else {
        console.error('There was an error fetching the transactions!');
      }
    } catch (error) {
      console.error('There was an error fetching the transactions!', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTransactionCreated = (newTransaction: Transaction) => {
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    setFilteredTransactions(prevFiltered => [...prevFiltered, newTransaction]);
  };

  const handleTransactionUpdated = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch('http://localhost:5034/api/transactions');
      if (response.ok) {
        const data: Transaction[] = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      }
      setShowEditModal(false);
    } catch (error) {
      console.error('Error fetching transactions after update:', error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5034/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
        setTransactions(updatedTransactions);
        setFilteredTransactions(updatedTransactions);
      } else {
        console.error('There was an error deleting the transaction!', response.statusText);
      }
    } catch (error) {
      console.error('There was an error deleting the transaction!', error);
    }
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  const openEditModal = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setTransactionToEdit(null);
    setShowEditModal(false);
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-2">Transactions</h1>
      <div className="flex items-center mb-4 gap-4">
        <Button
          onClick={openCreateModal}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Create Transaction
        </Button>
        <input
          placeholder="Search transactions"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-1/3 text-black p-2 border border-gray-200 rounded-md"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Client Name</TableHead>
            <TableHead className="text-black">Project Name</TableHead>
            <TableHead className="text-black">Amount</TableHead>
            <TableHead className="text-black">Transaction Status</TableHead>
            <TableHead className="text-black">Due Amount</TableHead>
            <TableHead className="text-black">Due Date</TableHead>
            <TableHead className="text-black">Edit</TableHead>
            <TableHead className="text-black">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.clientName}</TableCell>
              <TableCell>{transaction.projectName}</TableCell>
              <TableCell>{currencySymbols[transaction.currency]}{transaction.amount}</TableCell>
              <TableCell>{transaction.transactionStatus}</TableCell>
              <TableCell>{currencySymbols[transaction.currency]}{transaction.dueAmount}</TableCell>
              <TableCell>{formatDate(transaction.dueDate)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => openEditModal(transaction)}
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-red-500 text-white hover:bg-red-600">Delete</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete transaction?</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this transaction?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button className="bg-red-500 text-white hover:bg-red-600" onClick={() => handleDeleteTransaction(transaction.id)}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showCreateModal && (
        <CreateTransactionModal
          onClose={closeCreateModal}
          onTransactionCreated={(newTransaction) => {
            handleTransactionCreated(newTransaction);
            fetchTransactions();
          }}
        />
      )}
      {showEditModal && transactionToEdit && (
        <EditTransactionModal
          transaction={transactionToEdit}
          onClose={closeEditModal}
          onTransactionUpdated={handleTransactionUpdated}
          onTransactionDeleted={handleDeleteTransaction}
        />
      )}
    </div>
  );
};

export default TransactionTable;
