import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from 'react';
import CreateClientModal from './CreateClientModal';
import EditClientModal from './EditClientModal'; 
import { Client } from '@/utils/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const ClientTable: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false); 
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null); 

  const router = useRouter(); 

  const fetchClients = async () => {
    try {
      const queryParams = new URLSearchParams({
        searchQuery: searchQuery || "",
      });

      const response = await fetch(`http://localhost:5034/api/clients?${queryParams.toString()}`);
      if (response.ok) {
        const data: Client[] = await response.json();
        setClients(data);
        setFilteredClients(data);
      } else {
        console.error('There was an error fetching the clients!');
      }
    } catch (error) {
      console.error('There was an error fetching the clients!', error);
    }
  };

  useEffect(() => {
    fetchClients().then();
  }, [searchQuery]);

  // Use useEffect to filter clients when searchQuery changes
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredClients(clients); // If search is empty, show all clients
    } else {
      const filtered = clients.filter(client =>
        client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]); // Dependency array includes searchQuery and clients

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClientCreated = (newClient: Client) => {
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    setFilteredClients(updatedClients); // Ensure new clients are reflected in the filtered list
  };

  const handleClientUpdated = async (updatedClient: Client) => {
    try {
      const response = await fetch('http://localhost:5034/api/clients');
      if (response.ok) {
        const data: Client[] = await response.json();
        setClients(data);
        setFilteredClients(data); // After update, set the filtered list
      }
      setShowEditModal(false);
    } catch (error) {
      console.error('Error fetching clients after update:', error);
    }
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);
  
  const openEditModal = (client: Client) => {
    setClientToEdit(client);
    setShowEditModal(true); 
  };
  
  const closeEditModal = () => {
    setClientToEdit(null);
    setShowEditModal(false); 
  };

  const handleDeleteClient = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5034/api/clients/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedClients = clients.filter(client => client.id !== id);
        setClients(updatedClients);
        setFilteredClients(updatedClients); // Reflect the deleted client in the filtered list
      } else {
        console.error('There was an error deleting the client!');
      }
    } catch (error) {
      console.error('There was an error deleting the client!', error);
    }
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-2">Clients</h1>
      <div className="py-2 flex items-center space-x-4">
        <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={(e) => { e.preventDefault(); openCreateModal(); }}>
          Create
        </Button>
        <input
          placeholder="Search clients"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-1/3 p-2 border border-gray-200  text-black"
        />    
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Client Name</TableHead>
            <TableHead className="text-black">Status</TableHead>
            <TableHead className="text-black">Email</TableHead>
            <TableHead className="text-black">Phone Number</TableHead>
            <TableHead className="text-black">Edit</TableHead>
            <TableHead className="text-black">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <Link href={`/details?clientId=${client.id}`}>
                  <Link href={`/clients/${client.id}`} className="text-blue-600 cursor-pointer hover:underline">
                    {client.clientName}
                  </Link>
                </Link>
              </TableCell>
              <TableCell>{client.status}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phoneNumber}</TableCell>
              <TableCell>
                <Button className="text-white bg-yellow-500 hover:bg-yellow-600" onClick={() => openEditModal(client)}>
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="text-white bg-red-500 hover:bg-red-600 rounded-md">Delete</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete client?</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this client?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button className="text-white bg-red-500 hover:bg-red-600" onClick={() => handleDeleteClient(client.id)}>
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

      {showCreateModal && <CreateClientModal onClose={closeCreateModal} onClientCreated={handleClientCreated} />}
      {showEditModal && clientToEdit && (
        <EditClientModal 
          client={clientToEdit} 
          onClose={closeEditModal} 
          onClientUpdated={handleClientUpdated} 
          onClientDeleted={handleDeleteClient}
        />
      )}
    </div>
  );
};

export default ClientTable;
