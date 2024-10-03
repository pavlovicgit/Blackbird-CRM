import React, { useState, useEffect } from 'react';
import { Client, Project } from '../utils/types';

interface CreateProjectModalProps {
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onProjectCreated }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<number>(0);
  const [projectName, setProjectName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [status, setStatus] = useState<string>('');

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

    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const project: Omit<Project, 'id' | 'clientName'> = { clientId, projectName, startDate, status };
  
    try {
      const response = await fetch('http://localhost:5034/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      });
  
      if (response.ok) {
        const newProject: Project = await response.json();

        const client = clients.find(c => c.id === newProject.clientId);
        if (client) {
          newProject.clientName = client.clientName;
        }
  
        onProjectCreated(newProject);
        onClose();
      } else {
        const errorResponse = await response.json();
        console.error('There was an error creating the project!', errorResponse);
      }
    } catch (error) {
      console.error('There was an error creating the project!', error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center text-black">
      <div className="bg-white p-5 rounded">
        <h2 className="text-xl mb-4">Create Project</h2>
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
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
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
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-700 text-white p-2 rounded-md mr-2">Cancel</button>
            <button type="submit" className="bg-gray-700 p-2 rounded text-white">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
