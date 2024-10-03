import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, Comment } from '../utils/types';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

const ProjectDetails: React.FC = () => {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const projectId = new URLSearchParams(window.location.search).get('projectId');

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails(projectId);
      fetchProjectComments(projectId);
    }
  }, [projectId]);

  const fetchProjectDetails = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5034/api/projects/${id}`);
      if (response.ok) {
        const data: Project = await response.json();
        setProject(data);
      } else {
        console.error('There was an error fetching the project details!');
      }
    } catch (error) {
      console.error('There was an error fetching the project details!', error);
    }
  };

  const fetchProjectComments = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5034/api/comments/project/${id}`);
      if (response.ok) {
        const data: Comment[] = await response.json();
        setComments(data);
      } else {
        console.error('There was an error fetching the comments!');
      }
    } catch (error) {
      console.error('There was an error fetching the comments!', error);
    }
  };

  const handleAddComment = async () => {
    if (projectId && newComment.trim() && project) {
      const commentObj = {
        commentText: newComment,
        projectId: projectId,
        clientId: project.clientId, 
      };

      try {
        const response = await fetch(`http://localhost:5034/api/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentObj),
        });

        if (response.ok) {
          fetchProjectComments(projectId);
          setNewComment('');
        } else {
          console.error('Failed to save comment');
        }
      } catch (error) {
        console.error('Error adding comment', error);
      }
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex space-x-4">
        <Table className="bg-white border text-xs w-full max-w-2xl">
          <TableHeader>
            <TableRow>
              <TableCell colSpan={2} className="text-center text-black font-bold">
                Project Details
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-700">
            <TableRow>
              <TableCell className="border px-4 py-2 font-semibold">Project Name</TableCell>
              <TableCell className="border px-4 py-2">{project.projectName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border px-4 py-2 font-semibold">Start Date</TableCell>
              <TableCell className="border px-4 py-2">{new Date(project.startDate).toLocaleDateString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border px-4 py-2 font-semibold">Status</TableCell>
              <TableCell className="border px-4 py-2">{project.status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table className="bg-white border text-xs w-full max-w-2xl">
  <TableHeader>
    <TableRow>
      <TableCell colSpan={2} className="text-center text-black font-bold">
        Comments
      </TableCell>
    </TableRow>
  </TableHeader>
  <TableBody className="text-gray-700">
    <TableRow>
      <TableCell colSpan={2} className="border px-4 py-2">
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="border p-2 w-full text-black"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-3 py-1 mt-2 rounded text-xs"
          >
            Add Comment
          </button>
        </div>
        <div className="overflow-y-auto max-h-96 border-t border-gray-300 pt-2">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="border-b mb-2 pb-2 flex items-start">
              <div className="flex-1 break-all">
                <p><strong>{comment.projectName}:</strong> {comment.commentText}</p>
              </div>
              <div className="w-24 text-gray-500 text-[10px] text-right">
                {new Date(comment.createdDate).toLocaleDateString()}
              </div>
            </div>
            ))
          ) : (
            <div className="text-center">No comments available</div>
          )}
        </div>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={() => router.push('/projects')}
          className="text-blue-500 underline"
        >
          Back to Projects
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
