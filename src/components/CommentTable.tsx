import React, { useState, useEffect } from 'react';
import CreateCommentModal from './CreateCommentModal';
import EditCommentModal from './EditCommentModal';
import FullCommentModal from './FullCommentModal';
import { Comment } from '../utils/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

const CommentTable: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showFullCommentModal, setShowFullCommentModal] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<Comment | null>(null);
  const [fullComment, setFullComment] = useState<Comment | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchComments();
    
  }, [searchQuery, selectedProjectId]);
  

  const fetchComments = async () => {
    try {
      const queryParams = new URLSearchParams({
        searchQuery: searchQuery || "", 
        selectedProjectId: selectedProjectId ? selectedProjectId.toString() : ""  
      });
  
      const response = await fetch(`http://localhost:5034/api/comments?${queryParams.toString()}`);
      
      if (response.ok) {
        const data: Comment[] = await response.json();
        setComments(data);
      } else {
        console.error('Error fetching comments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleProjectClick = (projectId: number | null) => {
    if (projectId === selectedProjectId) {
      setSelectedProjectId(null);
    } else {
      setSelectedProjectId(projectId);
    }
  };

  const handleCommentCreated = (newComment: any) => {
    newComment.projectName = newComment.project.projectName;
    newComment.clientName = newComment.project.client.clientName;
    setComments([...comments, newComment]);
    setShowCreateModal(false);
    
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments(comments.map(c => (c.id === updatedComment.id ? updatedComment : c)));
    setShowEditModal(false);
  };

  const handleDeleteComment = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5034/api/comments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Comment with ID ${id} deleted successfully.`);
        setComments(comments.filter(comment => comment.id !== id));
      } else {
        console.error('Error deleting comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const truncateComment = (commentText: string, maxLength: number) => {
    if (commentText.length <= maxLength) return commentText;
    return `${commentText.slice(0, maxLength)}...`;
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-2">Comments</h1>
      <input
        placeholder="Search comments"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-1/3 text-black p-2 border border-gray-200 rounded-md"
        
      />
      <Link href="#" passHref>
        <span
          className={`text-blue-600 ${!selectedProjectId ? 'hidden' : ''} px-8 cursor-pointer hover:underline`}
          onClick={(e) => {
            e.preventDefault(); 
            handleProjectClick(null);
          }}
        >
          Show All Comments
        </span>
      </Link>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Client Name</TableHead>
            <TableHead className="text-black">Project Name</TableHead>
            <TableHead className="text-black">Comment</TableHead>
            <TableHead className="text-black">Edit</TableHead>
            <TableHead className="text-black">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>{comment.clientName}</TableCell>
              <TableCell>
                <Link href="#" passHref>
                  <span
                    className={`text-blue-600 hover:underline ${comment.projectId === selectedProjectId ? '' : ''}`}
                    onClick={(e) => {
                      e.preventDefault(); 
                      handleProjectClick(comment.projectId);
                    }}
                  >
                    {comment.projectName}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="break-all">
                <span
                  className="cursor-pointer hover:underline text-blue-600 truncate"
                  style={{ maxWidth: '200px' }} 
                  onClick={() => {
                    setFullComment(comment);
                    setShowFullCommentModal(true);
                  }}
                >
                  {truncateComment(comment.commentText, 20)}
                </span>
              </TableCell>
              <TableCell>
                <Button className="bg-yellow-500 text-white hover:bg-yellow-600" onClick={() => {
                  setEditComment(comment);
                  setShowEditModal(true);
                }}>
                  Edit
                </Button>
              </TableCell>
              
              <TableCell>
              <Dialog>
                  <DialogTrigger asChild>
                    <Button  className="bg-red-500 text-white hover:bg-red-600">Delete</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete comment?</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this comment?
                      </DialogDescription>
                    </DialogHeader>
                    
                    <DialogFooter>
                    <Button className="bg-red-500 text-white hover:bg-red-600" onClick={() => handleDeleteComment(comment.id)}>
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

      {showCreateModal && (
        <CreateCommentModal
          onClose={() => setShowCreateModal(false)}
          onCommentCreated={handleCommentCreated}
        />
      )}
      {showEditModal && editComment && (
        <EditCommentModal
          comment={editComment}
          onClose={() => setShowEditModal(false)}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleDeleteComment}
        />
      )}
      {showFullCommentModal && fullComment && (
        <FullCommentModal
          comment={fullComment}
          onClose={() => setShowFullCommentModal(false)}
        />
      )}
      
    </div>
  );
};

export default CommentTable;
