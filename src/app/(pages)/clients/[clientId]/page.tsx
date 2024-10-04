"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Client, Project, Comment } from '@/utils/types';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import ProjectTable from "@/components/ProjectTable";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const ClientDetails = ({ params }: { params: { clientId: number } }) => {
    const router = useRouter();

    const { clientId } = params;


    const [client, setClient] = useState<Client | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showProjects, setShowProjects] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [newComment, setNewComment] = useState<string>('');
    const [projectComments, setProjectComments] = useState<Comment[]>([]);
    useEffect(() => {
        if (clientId) {
            fetchClientDetails(clientId.toString());
        }
    }, [clientId]);

    const fetchClientDetails = async (clientId: string) => {
        try {
            const clientDetailsResponse = await fetch(`http://localhost:5034/api/clients/${clientId}/details`);
            const clientDetailsData = await clientDetailsResponse.json();

            setClient({
                id: clientDetailsData.id,
                clientName: clientDetailsData.clientName,
                status: clientDetailsData.status,
                email: clientDetailsData.email,
                phoneNumber: clientDetailsData.phoneNumber,
            });

            setProjects(clientDetailsData.projects || []);
            setComments(clientDetailsData.comments || []);
        } catch (error) {
            console.error('There was an error fetching the client details!', error);
        }
    };

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setShowProjects(true);
        fetchProjectComments(project.id);
    };

    const fetchProjectComments = async (projectId: number) => {
        try {
            const commentsResponse = await fetch(`http://localhost:5034/api/comments/project/${projectId}`);
            const commentsData = await commentsResponse.json();
            console.log(commentsData);
            setProjectComments(commentsData || []);
        } catch (error) {
            console.error('Error fetching project comments', error);
        }
    };

    const handleAddComment = async () => {
        if (selectedProject && newComment.trim()) {
            const currentDate = new Date().toLocaleDateString('en-GB');

            const newCommentObj = {
                commentText: newComment,
                projectId: selectedProject.id,
                clientId: selectedProject.clientId,
                date: currentDate,
            };

            try {
                const response = await fetch(`http://localhost:5034/api/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newCommentObj),
                });

                if (response.ok) {
                    fetchProjectComments(selectedProject.id);
                    setNewComment('');
                } else {
                    console.error('Failed to save comment');
                }
            } catch (error) {
                console.error('Error adding comment', error);
            }
        }
    };

    if (!client) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col p-12">
            <div className="w-full">
                <Link href="/clients"
                    onClick={() => router.push('/clients')}
                    className="text-blue-500 underline"
                >
                    Back to Clients
                </Link>

                <div className="mt-4 flex flex-row space-x-4 h-[300px]">
                    <div className="bg-white border border-gray rounded-md p-4 w-1/3 h-full">
                        <div className="mb-4 font-semibold text-[20px]">Client Details</div>

                        <div className="flex flex-row items-center w-full">
                            <div className="flex flex-col space-y-2">
                                <p>
                                    <span className="text-black font-bold">Client Name</span>: {client.clientName}
                                </p>
                                <p>
                                    <span className="text-black font-bold">Status</span>: {client.status}
                                </p>
                                <p>
                                    <span className="text-black font-bold">Email</span>: {client.email}
                                </p>
                                <p>
                                    <span className="text-black font-bold">Phone Number</span>: {client.phoneNumber}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray rounded-md p-4 w-1/3 flex flex-col h-full">
                        <div className="mb-4 font-semibold text-[20px]">Create Comment</div>

                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={3}
                            className="border p-2 w-full text-black grow mb-4 resize-none"
                        />

                        <Button
                            onClick={handleAddComment}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 mt-2 rounded"
                        >
                            Add Comment
                        </Button>
                    </div>

                    <div className="bg-white border border-gray rounded-md p-4 w-1/3 h-full  overflow-y-scroll">
                        <div className="mb-4 font-semibold text-[20px]">Comments</div>

                        <div className="text-[16px]">
                            <div className="pb-2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
                                <p className="mt-2 text-gray text-[14px]">9:30 2024/10/01</p>
                            </div>
                            <hr/>
                            <div className="pb-2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
                                <p className="text-gray text-[14px]">9:30 2024/10/01</p>
                            </div>
                            <hr/>
                            <div className="pb-2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
                                <p className="text-gray text-[14px]">9:30 2024/10/01</p>
                            </div>
                            <hr/>
                            <div className="pb-2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
                                <p className="text-gray text-[14px]">9:30 2024/10/01</p>
                            </div>
                            <hr/>
                            <div className="pb-2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
                                <p className="text-gray text-[14px]">9:30 2024/10/01</p>
                            </div>
                            <hr/>
                            <div className="pb-2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis cum ea et facere fugit, laudantium nostrum quidem quo rem similique.</p>
                                <p className="text-gray text-[14px]">9:30 2024/10/01</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray rounded-md mt-8">
                <ProjectTable params={{clientId: clientId}}/>
            </div>
        </div>
    );
};

export default ClientDetails;
