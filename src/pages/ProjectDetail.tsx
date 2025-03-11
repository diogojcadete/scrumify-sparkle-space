
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { CalendarDays, Code } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Sprint } from "@/types";
import { supabase } from "@/lib/supabase";
import { fetchProjectCollaborators } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

import SprintCard from "@/components/sprints/SprintCard";
import NewSprintButton from "@/components/sprints/NewSprintButton";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProject, getSprintsByProject } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);
  
  const project = getProject(projectId || "");
  
  const fetchSprints = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .eq('project_id', projectId)
        .order('start_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching sprints:', error);
        throw error;
      }
      
      const formattedSprints: Sprint[] = data.map(sprint => ({
        id: sprint.id,
        title: sprint.title,
        description: sprint.description || '',
        projectId: sprint.project_id,
        startDate: sprint.start_date,
        endDate: sprint.end_date,
        status: sprint.status as 'planned' | 'in-progress' | 'completed'
      }));
      
      setSprints(formattedSprints);
    } catch (error) {
      console.error('Error fetching sprints:', error);
      toast.error('Failed to load sprints');
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkUserRole = async () => {
    if (!project || !user) return;
    
    // Check if user is owner
    const isOwner = project.ownerId === user.id;
    
    if (isOwner) {
      setIsOwnerOrAdmin(true);
      return;
    }
    
    // Check if user is admin
    try {
      const collaborators = await fetchProjectCollaborators(project.id);
      const userCollaboration = collaborators.find(c => c.userId === user.id);
      setIsOwnerOrAdmin(userCollaboration?.role === 'admin');
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };
  
  useEffect(() => {
    if (projectId) {
      fetchSprints();
      checkUserRole();
    }
  }, [projectId, user]);
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">Project not found</h2>
        <button
          onClick={() => navigate("/")}
          className="scrum-button"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Sprints</h2>
        {isOwnerOrAdmin && (
          <NewSprintButton projectId={project.id} onSprintCreated={fetchSprints} />
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="scrum-card animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-gray-700 rounded w-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : sprints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sprints.map((sprint) => (
            <SprintCard
              key={sprint.id}
              sprint={sprint}
              isOwnerOrAdmin={isOwnerOrAdmin}
              onEdit={() => navigate(`/projects/${project.id}/sprint/${sprint.id}/edit`)}
              onViewBoard={() => navigate(`/projects/${project.id}/sprint/${sprint.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-scrum-text-secondary mb-4">
            No sprints yet
          </div>
          {isOwnerOrAdmin && (
            <NewSprintButton projectId={project.id} onSprintCreated={fetchSprints} label="Create First Sprint" />
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
