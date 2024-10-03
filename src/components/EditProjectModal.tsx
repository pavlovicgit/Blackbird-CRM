import React, { useState, useEffect } from 'react';
import { Client, Project } from '../utils/types';
import { IoCloseOutline } from "react-icons/io5";

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onProjectUpdated: (project: Project) => void;
  onProjectDeleted: (id: number) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onClose, onProjectUpdated, onProjectDeleted }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<number>(project.clientId);
  const [clientName, setClientName] = useState<string>(project.clientName);
  const [projectName, setProjectName] = useState<string>(project.projectName);
  const [startDate, setStartDate] = useState<string>(project.startDate);
  const [status, setStatus] = useState<string>(project.status);

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

    const updatedProject: Project = { ...project, clientName, projectName, startDate, status };

    try {
      const response = await fetch(`http://localhost:5034/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      });

      if (response.ok) {
        const newProjectData: Project = await response.json();
        onProjectUpdated(newProjectData);
        onClose();
      } else {
        console.error('There was an error updating the project!', response.statusText);
      }
    } catch (error) {
      console.error('There was an error updating the project!', error);
    }
  };

  const handleDelete = async () => {
    onProjectDeleted(project.id);
    onClose();
    
    // try {
    //   const response = await fetch(`http://localhost:5034/api/projects/${project.id}`, {
    //     method: 'DELETE',
    //   });

    //   if (response.ok) {
        
    //     onClose();
    //   } else {
    //     console.error('There was an error deleting the project!', response.statusText);
    //   }
    // } catch (error) {
    //   console.error('There was an error deleting the project!', error);
    // }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center text-black bg-opacity-70 bg-black z-50">
      <div className="bg-slate-50 p-5 rounded-lg border-2 border-slate-100">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl ">Edit Project</h2>
        <button type="button" onClick={onClose} className=" text-black hover:font-bold"><IoCloseOutline /></button>
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
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-gray-700 hover:bg-gray-800 p-2 rounded text-white">Save</button>
            <button type="button" onClick={handleDelete} className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded">Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
