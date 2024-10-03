// "use client";
// import React, { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Client, Project, Comment } from '@/utils/types';
// import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
//
// const ClientDetails = ({ params }: { params: { clientId: number } }) => {
//   const router = useRouter();
//
//   const { clientId } = params;
//
//   // const clientId = params.clientId;
//   // const searchParams = useSearchParams();
//   // const clientId = searchParams.get('clientId');
//
//   const [client, setClient] = useState<Client | null>(null);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [showProjects, setShowProjects] = useState(false);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [newComment, setNewComment] = useState<string>('');
//   const [projectComments, setProjectComments] = useState<Comment[]>([]);
//   useEffect(() => {
//     if (clientId) {
//       fetchClientDetails(clientId.toString());
//     }
//   }, [clientId]);
//
//   const fetchClientDetails = async (clientId: string) => {
//     try {
//       const clientDetailsResponse = await fetch(`http://localhost:5034/api/clients/${clientId}/details`);
//       const clientDetailsData = await clientDetailsResponse.json();
//
//       setClient({
//         id: clientDetailsData.id,
//         clientName: clientDetailsData.clientName,
//         status: clientDetailsData.status,
//         email: clientDetailsData.email,
//         phoneNumber: clientDetailsData.phoneNumber,
//       });
//
//       setProjects(clientDetailsData.projects || []);
//       setComments(clientDetailsData.comments || []);
//     } catch (error) {
//       console.error('There was an error fetching the client details!', error);
//     }
//   };
//
//   const handleProjectClick = (project: Project) => {
//     setSelectedProject(project);
//     setShowProjects(true);
//     fetchProjectComments(project.id);
//   };
//
//   const fetchProjectComments = async (projectId: number) => {
//     try {
//       const commentsResponse = await fetch(`http://localhost:5034/api/comments/project/${projectId}`);
//       const commentsData = await commentsResponse.json();
//       console.log(commentsData);
//       setProjectComments(commentsData || []);
//     } catch (error) {
//       console.error('Error fetching project comments', error);
//     }
//   };
//
//   const handleAddComment = async () => {
//   if (selectedProject && newComment.trim()) {
//     const currentDate = new Date().toLocaleDateString('en-GB');
//
//     const newCommentObj = {
//       commentText: newComment,
//       projectId: selectedProject.id,
//       clientId: selectedProject.clientId,
//       date: currentDate,
//     };
//
//     try {
//       const response = await fetch(`http://localhost:5034/api/comments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newCommentObj),
//       });
//
//       if (response.ok) {
//         fetchProjectComments(selectedProject.id);
//         setNewComment('');
//       } else {
//         console.error('Failed to save comment');
//       }
//     } catch (error) {
//       console.error('Error adding comment', error);
//     }
//   }
// };
//
//   if (!client) {
//     return <div>Loading...</div>;
//   }
//
//   return (
//     <div className="flex flex-row space-x-12">
//       <div className="p-4 w-1/2">
//         <Table className="bg-white border text-xs">
//           <TableBody className="text-gray-700">
//             <TableRow className="text-center font-bold">
//               <TableCell className="border px-4 py-2 font-semibold">Client Details</TableCell>
//               <TableCell
//                 className="border px-4 py-2 cursor-pointer text-blue-500"
//                 onClick={() => setShowProjects(!showProjects)}
//               >
//                 {showProjects ? 'Back to Details' : 'Projects'}
//               </TableCell>
//             </TableRow>
//
//             {showProjects ? (
//               selectedProject ? (
//                 <>
//                   <TableRow>
//                     <TableCell className="border px-4 py-2 font-semibold">Project Name</TableCell>
//                     <TableCell className="border px-4 py-2">{selectedProject.projectName}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell className="border px-4 py-2 font-semibold">Start Date</TableCell>
//                     <TableCell className="border px-4 py-2">{new Date(selectedProject.startDate).toLocaleDateString()}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell className="border px-4 py-2 font-semibold">Status</TableCell>
//                     <TableCell className="border px-4 py-2">{selectedProject.status}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell className="border px-4 py-2 text-center" colSpan={2}>
//                       <button
//                         className="text-blue-500 underline"
//                         onClick={() => setSelectedProject(null)}
//                       >
//                         Back to Projects
//                       </button>
//                     </TableCell>
//                   </TableRow>
//                 </>
//               ) : (
//                 projects.length > 0 ? (
//                   projects.map((project) => (
//                     <TableRow key={project.id} className="text-center cursor-pointer" onClick={() => handleProjectClick(project)}>
//                       <TableCell className="border px-4 py-2" colSpan={2}>{project.projectName}</TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell className="border px-4 py-2 text-center" colSpan={2}>No projects available</TableCell>
//                   </TableRow>
//                 )
//               )
//             ) : (
//               <>
//                 <TableRow>
//                   <TableCell className="border px-4 py-2 font-semibold">Client Name</TableCell>
//                   <TableCell className="border px-4 py-2">{client.clientName}</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="border px-4 py-2 font-semibold">Status</TableCell>
//                   <TableCell className="border px-4 py-2">{client.status}</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="border px-4 py-2 font-semibold">Email</TableCell>
//                   <TableCell className="border px-4 py-2">{client.email}</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="border px-4 py-2 font-semibold">Phone Number</TableCell>
//                   <TableCell className="border px-4 py-2">{client.phoneNumber}</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="border px-4 py-2 text-center" colSpan={2}>
//                     <button
//                       onClick={() => router.push('/clients')}
//                       className="text-blue-500 underline"
//                     >
//                       Back to Clients
//                     </button>
//                   </TableCell>
//                 </TableRow>
//               </>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//
//
//       <div className="w-1/2 p-4">
//   {selectedProject && (
//     <>
//       <Table className="bg-white border text-xs w-full max-w-2xl">
//         <TableHeader>
//           <TableRow>
//             <TableCell colSpan={2} className="text-center text-black font-bold">
//               Comments
//             </TableCell>
//           </TableRow>
//         </TableHeader>
//         <TableBody className="text-gray-700">
//           <TableRow>
//             <TableCell colSpan={2} className="border px-4 py-2">
//               <div className="mb-4">
//                 <textarea
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   placeholder="Add a comment..."
//                   rows={3}
//                   className="border p-2 w-full text-black"
//                 />
//                 <button
//                   onClick={handleAddComment}
//                   className="bg-blue-500 text-white px-3 py-1 mt-2 rounded text-xs"
//                 >
//                   Add Comment
//                 </button>
//               </div>
//               <div className="overflow-y-auto max-h-96 border-t border-gray-300 pt-2">
//                 {projectComments.length > 0 ? (
//                   projectComments.map((comment) => (
//                     <div key={comment.id} className="border-b mb-2 pb-2 flex items-start">
//                       <div className="flex-1 break-all">
//                         <p><strong>{comment.projectName}:</strong> {comment.commentText}</p>
//                       </div>
//                       <div className="w-24 text-gray-500 text-[10px] text-right">
//                         {new Date(comment.createdDate).toLocaleDateString()}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center">No comments available</div>
//                 )}
//               </div>
//             </TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>
//     </>
//   )}
// </div>
//     </div>
//   );
// };
//
// export default ClientDetails;
