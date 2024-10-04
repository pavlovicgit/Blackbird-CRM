import React, { useState } from 'react';
import { Client } from '../utils/types';
import { IoCloseOutline } from "react-icons/io5";
import { Button } from './ui/button';

interface EditClientModalProps {
  client: Client;
  onClose: () => void;
  onClientUpdated: (client: Client) => void;
  onClientDeleted: (id: number) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ client, onClose, onClientUpdated, onClientDeleted }) => {
  const [clientName, setClientName] = useState<string>(client.clientName);
  const [status, setStatus] = useState<string>(client.status);
  const [email, setEmail] = useState<string>(client.email);
  const [phoneNumber, setPhoneNumber] = useState<string>(client.phoneNumber);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedClient: Client = { ...client, clientName, status, email, phoneNumber };

    try {
      const response = await fetch(`http://localhost:5034/api/clients/${client.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });

      if (response.ok) {
        const newClientData: Client = await response.json();
        onClientUpdated(newClientData);
        onClose();
      } else {
        console.error('There was an error updating the client!', response.statusText);
      }
    } catch (error) {
      console.error('There was an error updating the client!', error);
    }
  };

  const handleDelete = async () => {
    onClientDeleted(client.id);
    onClose();
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center text-black bg-opacity-70 bg-black z-50">
      <div className="bg-slate-50 p-5 rounded-lg border-2 border-slate-100">
        <div className="flex justify-between mb-4">
        <h2 className="text-xl ">Edit Client</h2>
        <button type="button" onClick={onClose} className=" text-black hover:font-bold"><IoCloseOutline /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block mb-1">Client Name</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)} 
              className="w-full p-2 border rounded"
              required 
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Status</option>
              <option value="Lead">Lead</option>
              <option value="Engaged Lead">Engaged Lead</option>
              <option value="Client">Client</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-2 border rounded"
              required 
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Phone Number</label>
            <input 
              type="tel" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              className="w-full p-2 border rounded"
              required 
            />
          </div>
          <div className="flex justify-between">          
            <Button type="button" onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">Delete</Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">Save</Button>    
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;
