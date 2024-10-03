import React, { useState, useEffect } from 'react';
import CreateProjectModal from './CreateProjectModal';
import EditProjectModal from './EditProjectModal';
import { Project } from '../utils/types';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

const ProjectTable: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const queryParams = new URLSearchParams({
        searchQuery: searchQuery || "",
        sortOrder: sortOrder,
      });

      const response = await fetch(`http://localhost:5034/api/projects?${queryParams.toString()}`);
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

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, sortOrder]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(projects.map(project =>
      project.id === updatedProject.id ? updatedProject : project
    ));
    setShowEditModal(false);
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  const openEditModal = (project: Project) => {
    setProjectToEdit(project);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setProjectToEdit(null);
    setShowEditModal(false);
  };

  const handleDeleteProject = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5034/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProjects(projects.filter(project => project.id !== id));
      } else {
        console.error('There was an error deleting the project!');
      }
    } catch (error) {
      console.error('There was an error deleting the project!', error);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleProjectNameClick = (projectId: number, event: React.MouseEvent<HTMLTableCellElement>) => {
    event.stopPropagation(); 
    router.push(`/project-details?projectId=${projectId}`);
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-2">Projects</h1>
      <div className="flex space-x-4 items-center py-2">
        <Button className="bg-gray-700" onClick={openCreateModal}>Create</Button>
        <input
          placeholder="Search projects" 
          value={searchQuery} 
          onChange={(e) => handleSearch(e.target.value)} 
          className="w-1/3 text-black p-2 border-2 border-gray-800"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Client Name</TableHead>
            <TableHead className="text-black">Project Name</TableHead>
            <TableHead className="text-black">
              <Button className="text-black" variant="link" onClick={toggleSortOrder}>
                Start Date {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </TableHead>
            <TableHead className="text-black">Status</TableHead>
            <TableHead className="text-black">Edit</TableHead>
            <TableHead className="text-black">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.clientName}</TableCell>
              <TableCell 
                onClick={(e) => handleProjectNameClick(project.id, e)} 
                className="cursor-pointer text-blue-600 hover:underline"
              >
                {project.projectName}
              </TableCell>
              <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>
                <Button className="bg-gray-700 hover:bg-gray-800" onClick={(e) => { e.stopPropagation(); openEditModal(project); }}>
                  Edit
                </Button>
              </TableCell>
              <TableCell>
              <Dialog>
                  <DialogTrigger asChild>
                    <Button  className="bg-gray-700 text-white hover:bg-gray-800">Delete</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete project?</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this project?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    <Button className="bg-gray-700 hover:bg-gray-800" onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}>
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

      {showCreateModal && <CreateProjectModal onClose={closeCreateModal} onProjectCreated={handleProjectCreated} />}
      {showEditModal && projectToEdit && (
        <EditProjectModal 
          project={projectToEdit} 
          onClose={closeEditModal} 
          onProjectUpdated={handleProjectUpdated}
          onProjectDeleted={handleDeleteProject}
        />
      )}
    </div>
  );
};

export default ProjectTable;
