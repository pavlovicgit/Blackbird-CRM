import React, { useState, useEffect } from 'react';
import { Client, Project, Comment } from '../utils/types';
import { Button } from './ui/button';

interface CreateCommentModalProps {
  onClose: () => void;
  onCommentCreated: (comment: Comment) => void;
}

const CreateCommentModal: React.FC<CreateCommentModalProps> = ({ onClose, onCommentCreated }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientId, setClientId] = useState<number>(0);
  const [projectId, setProjectId] = useState<number>(0);
  const [commentText, setCommentText] = useState<string>('');

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

    const comment: Comment = { 
        id: 0, 
        clientId, 
        projectId, 
        commentText, 
        clientName: '', 
        projectName: '', 
        createdDate: ''
    };
    
    try {
        const response = await fetch('http://localhost:5034/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });

        if (response.ok) {
            const newComment = await response.json();
            onCommentCreated(newComment);
            onClose();
        } else {
            console.error('Error creating comment', await response.text());
        }
    } catch (error) {
        console.error('Network error', error);
    }
};
  
  return (
    <div className="fixed inset-0 flex justify-center items-center text-black">
      <div className="bg-white p-5 rounded">
        <h2 className="text-xl mb-4">Create Comment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block mb-1">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(parseInt(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.clientName}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Project</label>
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
          <div className="mb-2">
            <label className="block mb-1">Comment</label>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white mr-2">Cancel</Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommentModal;
