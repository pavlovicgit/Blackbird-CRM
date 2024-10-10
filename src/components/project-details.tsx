// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Project, Comment } from '../utils/types';
// import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from './ui/button';
//
// const ProjectDetails: React.FC = () => {
//   const router = useRouter();
//   const [project, setProject] = useState<Project | null>(null);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState('');
//   const projectId = new URLSearchParams(window.location.search).get('projectId');
//
//   useEffect(() => {
//     if (projectId) {
//       fetchProjectDetails(projectId);
//       fetchProjectComments(projectId);
//     }
//   }, [projectId]);
//
//   const fetchProjectDetails = async (id: string) => {
//     try {
//       const response = await fetch(`http://localhost:5034/api/projects/${id}`);
//       if (response.ok) {
//         const data: Project = await response.json();
//         setProject(data);
//       } else {
//         console.error('There was an error fetching the project details!');
//       }
//     } catch (error) {
//       console.error('There was an error fetching the project details!', error);
//     }
//   };
//
//   const fetchProjectComments = async (id: string) => {
//     try {
//       const response = await fetch(`http://localhost:5034/api/comments/project/${id}`);
//       if (response.ok) {
//         const data: Comment[] = await response.json();
//         setComments(data);
//       } else {
//         console.error('There was an error fetching the comments!');
//       }
//     } catch (error) {
//       console.error('There was an error fetching the comments!', error);
//     }
//   };
//
//
//   const handleAddComment = async () => {
//     if (projectId && newComment.trim() && project) {
//       const commentObj = {
//         commentText: newComment,
//         projectId: projectId,
//         clientId: project.clientId,
//       };
//
//       try {
//         const response = await fetch(`http://localhost:5034/api/comments`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(commentObj),
//         });
//
//         if (response.ok) {
//           fetchProjectComments(projectId);
//           setNewComment('');
//         } else {
//           console.error('Failed to save comment');
//         }
//       } catch (error) {
//         console.error('Error adding comment', error);
//       }
//     }
//   };
//
//   if (!project) {
//     return <div>Loading...</div>;
//   }
//
//   return (
//     <div className="p-4">
//        <div className="mt-4 flex flex-row space-x-4 h-[300px]">
//
//
//   <div className="bg-white border border-gray rounded-md p-4 w-1/3 h-full">
//                   <div className="mb-4 font-semibold text-[20px]">Client Details</div>
//
//                   <div className="flex flex-row items-center w-full">
//                       <div className="flex flex-col space-y-2">
//                           <p>
//                               <span className="text-black font-bold">Project Name</span>: {project.projectName}
//                           </p>
//                           <p>
//                               <span className="text-black font-bold">Start Date</span>: {new Date(project.startDate).toLocaleDateString()}
//                           </p>
//                           <p>
//                               <span className="text-black font-bold">Status</span>: {project.status}
//                           </p>
//                       </div>
//                   </div>
//               </div>
//
//
//             <div className="bg-white border border-gray rounded-md p-4 w-1/3 flex flex-col h-full">
//                 <div className="mb-4 font-semibold text-[20px]">Create Comment</div>
//
//                 <textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="Add a comment..."
//                     rows={3}
//                     className="border p-2 w-full text-black grow mb-4 resize-none"
//                 />
//
//                 <Button
//                     onClick={handleAddComment}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 mt-2 rounded"
//                 >
//                     Add Comment
//                 </Button>
//             </div>
//
//             <div className="bg-white border border-gray rounded-md p-4 w-1/3 h-full  overflow-y-scroll">
//                 <div className="mb-4 font-semibold text-[20px]">Comments</div>
//
//                 <div className="text-[16px]">
//                     <div className="pb-2">
//                         <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
//                         <p className="mt-2 text-gray text-[14px]">9:30 2024/10/01</p>
//                     </div>
//                     <hr/>
//                     <div className="pb-2">
//                         <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
//                         <p className="text-gray text-[14px]">9:30 2024/10/01</p>
//                     </div>
//                     <hr/>
//                     <div className="pb-2">
//                         <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
//                         <p className="text-gray text-[14px]">9:30 2024/10/01</p>
//                     </div>
//                     <hr/>
//                     <div className="pb-2">
//                         <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
//                         <p className="text-gray text-[14px]">9:30 2024/10/01</p>
//                     </div>
//                     <hr/>
//                     <div className="pb-2">
//                         <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
//                         <p className="text-gray text-[14px]">9:30 2024/10/01</p>
//                     </div>
//                     <hr/>
//                     <div className="pb-2">
//                         <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
//                         <p className="text-gray text-[14px]">9:30 2024/10/01</p>
//                     </div>
//                 </div>
//               </div>
//       </div>
//
//       <div className="text-center mt-4">
//         <button
//           onClick={() => router.push('/projects')}
//
//           className="text-blue-500 hover:text-blue-600 font-bold underline"
//         >
//           Back to Projects
//         </button>
//       </div>
//     </div>
//   );
// };
//
// export default ProjectDetails;
