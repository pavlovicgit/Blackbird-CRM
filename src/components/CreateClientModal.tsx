import React, { useState } from 'react';
import { Client } from '../utils/types';
import { Button } from './ui/button';

interface CreateClientModalProps {
    onClose: () => void;
    onClientCreated: (client: Client) => void;
}

const CreateClientModal: React.FC<CreateClientModalProps> = ({ onClose, onClientCreated }) => {
    const [clientName, setClientName] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('Form submitted');
        const client: Omit<Client, 'id'> = { clientName, status, email, phoneNumber };
        console.log('Client data:', client);

        try {
            const response = await fetch('http://localhost:5034/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(client)
            });

            if (response.ok) {
                const newClient: Client = await response.json();
                console.log('Client created successfully:', newClient);
                onClientCreated(newClient);
                onClose();
            } else {
                console.error('There was an error creating the client!', response.statusText);
            }
        } catch (error) {
            console.error('There was an error creating the client!', error);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center text-black">
            <div className="bg-white p-5 rounded-lg w-[400px]">
                <h2 className="text-xl mb-4">Create Client</h2>
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
                    <div className="mt-6 flex justify-between">
                        <Button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white mr-2">Cancel</Button>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">Create</Button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClientModal;
