import React, { useState, useEffect } from 'react';
import { Client, Project, Transaction } from '../utils/types';
import { Button } from "@/components/ui/button";

interface CreateTransactionModalProps {
  onClose: () => void;
  onTransactionCreated: (transaction: Transaction) => void;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ onClose, onTransactionCreated }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientId, setClientId] = useState<number>(0);
  const [projectId, setProjectId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<string>('Invoice');
  const [dueAmount, setDueAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch('http://localhost:5034/api/clients');
      const data = await response.json();
      setClients(data);
    };

    const fetchProjects = async () => {
      const response = await fetch('http://localhost:5034/api/projects');
      const data = await response.json();
      setProjects(data);
    };

    fetchClients();
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selectedClient = clients.find(client => client.id === clientId);
    const selectedProject = projects.find(project => project.id === projectId);

    const transaction: Omit<Transaction, 'id'> = {
      clientId,
      projectId,
      amount,
      clientName: selectedClient ? selectedClient.clientName : '',
      projectName: selectedProject ? selectedProject.projectName : '',
      transactionStatus,
      dueAmount,
      dueDate,
      currency
    };

    console.log('Sending transaction data:', JSON.stringify(transaction, null, 2));

    try {
      const response = await fetch('http://localhost:5034/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Failed to create transaction: ${response.status} ${response.statusText}`);
      }

      const newTransaction: Transaction = await response.json();
      onTransactionCreated(newTransaction);
      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Create Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block mb-1">Client Name</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.clientName}</option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label className="block mb-1">Project Name</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.projectName}</option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
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
          <div className="mt-4">
            <label className="block mb-1">Due Amount</label>
            <input
              type="number"
              value={dueAmount}
              onChange={(e) => setDueAmount(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
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
          <div className="mt-6 flex justify-between">
            <button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md mr-2">Cancel</button>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTransactionModal;
