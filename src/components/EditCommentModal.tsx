import React, { useState, useEffect } from 'react';
import { Client, Project, Comment } from '../utils/types';
import { IoCloseOutline } from "react-icons/io5";
import { Button } from './ui/button';

interface EditCommentModalProps {
  comment: Comment;
  onClose: () => void;
  onCommentUpdated: (comment: Comment) => void;
  onCommentDeleted: (id:number) => void; 
}

const EditCommentModal: React.FC<EditCommentModalProps> = ({ comment, onClose, onCommentUpdated, onCommentDeleted }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientId, setClientId] = useState<number>(comment.clientId);
  const [projectId, setProjectId] = useState<number>(comment.projectId);
  const [commentText, setCommentText] = useState<string>(comment.commentText);

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

  useEffect(() => {
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
  
    fetchProjects();
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedComment: Comment = { ...comment, commentText };

    try {
      const response = await fetch(`http://localhost:5034/api/comments/${comment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedComment),
      });

      if (response.ok) {
        const newCommentData: Comment = await response.json();
        onCommentUpdated(newCommentData);
        onClose();
      } else {
        console.error('There was an error updating the comment!', response.statusText);
      }
    } catch (error) {
      console.error('There was an error updating the comment!', error);
    }
  };
  
  const handleDelete = async () => {
    onCommentDeleted(comment.id);
    onClose();
  }

  

  return (
    <div className="fixed inset-0 flex justify-center items-center text-black bg-opacity-70 bg-black z-50">
  <div className="bg-slate-50 p-5 rounded-lg border-2 border-slate-100 h-[450px] w-[500px]">
  <div className="flex justify-between mb-4">
        <h2 className="text-xl ">Edit Comment</h2>
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
        <label className="block mb-1">Comment Text</label>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full p-2 border rounded h-32"  
          required
        />
      </div>
      <div className="flex justify-between mt-4">
        <Button type="button" onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded">Delete</Button>
        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">Save</Button>
      </div>
    </form>
  </div>
</div>


  );
};

export default EditCommentModal;
