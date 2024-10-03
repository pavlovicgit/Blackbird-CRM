import React, { useState, useEffect } from 'react';
import { Client, Project, Transaction } from '../utils/types';
import { Button } from './ui/button';
import { IoCloseOutline } from 'react-icons/io5';

// Add this utility function
function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

interface EditTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onTransactionUpdated: (transaction: Transaction) => void;
  onTransactionDeleted: (id: number) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onClose, onTransactionUpdated, onTransactionDeleted }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientId, setClientId] = useState<number>(transaction.clientId);
  const [projectId, setProjectId] = useState<number>(transaction.projectId);
  const [amount, setAmount] = useState<number>(transaction.amount);
  const [transactionStatus, setTransactionStatus] = useState<string>(transaction.transactionStatus);
  const [dueAmount, setDueAmount] = useState<number>(transaction.dueAmount);
  const [dueDate, setDueDate] = useState<string>(formatDateForInput(transaction.dueDate));
  const [currency, setCurrency] = useState<string>(transaction.currency);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:5034/api/clients');
        if (response.ok) {
          const data: Client[] = await response.json();
          setClients(data);
        } else {
          console.error('There was an error fetching the clients!');
        }
      } catch (error) {
        console.error('There was an error fetching the clients!', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5034/api/projects');
        if (response.ok) {
          const data: Project[] = await response.json();
          setProjects(data);
        } else {
          console.error('There was an error fetching the projects!');
        }
      } catch (error) {
        console.error('There was an error fetching the projects!', error);
      }
    };

    fetchClients();
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedTransaction: Transaction = { 
      ...transaction, 
      clientId, 
      projectId, 
      amount,
      transactionStatus,
      dueAmount,
      dueDate: new Date(dueDate).toISOString(),
      currency
    };

    try {
      const response = await fetch(`http://localhost:5034/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTransaction),
      });

      if (response.ok) {
        const newTransactionData: Transaction = await response.json();
        onTransactionUpdated(newTransactionData);
        onClose();
      } else {
        console.error('There was an error updating the transaction!', response.statusText);
      }
    } catch (error) {
      console.error('There was an error updating the transaction!', error);
    }
  };

  const handleDelete = async () => {
    onTransactionDeleted(transaction.id);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 flex justify-center items-center text-black bg-opacity-70 bg-black z-50">
      <div className="bg-slate-50 p-5 rounded-lg border-2 border-slate-100">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl">Edit Transaction</h2>
          <button type="button" onClick={onClose} className="text-black hover:font-bold"><IoCloseOutline /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block mb-1">Client Name</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.clientName}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Project Name</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.projectName}</option>
              ))}
            </select>
          </div>        
          <div className="mb-2">
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Transaction Status</label>
            <select
              value={transactionStatus}
              onChange={(e) => setTransactionStatus(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Invoice">Invoice</option>
              <option value="Outvoice">Outvoice</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Due Amount</label>
            <input
              type="number"
              value={dueAmount}
              onChange={(e) => setDueAmount(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="RSD">RSD (РСД)</option>
            </select>
          </div>
          <div className="flex justify-between mt-4">
            <Button type="submit" className="bg-gray-700 hover:bg-gray-800">Save</Button>
            <Button type="button" onClick={handleDelete} className="bg-gray-700 hover:bg-gray-800">Delete</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
