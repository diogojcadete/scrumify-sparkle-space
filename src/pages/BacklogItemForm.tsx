import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useProjects } from "@/context/ProjectContext";
import { X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Collaborator } from "@/types";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high"]),
  storyPoints: z.coerce.number().min(1).max(100),
  assignedTo: z.string().optional(),
});

interface BacklogItemFormProps {
  taskId?: string;
  onClose: () => void;
  projectId?: string;
}

const BacklogItemForm: React.FC<BacklogItemFormProps> = ({ taskId, onClose, projectId }) => {
  const { getTask, addTask, updateTask, getProject } = useProjects();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [projectOwner, setProjectOwner] = useState<{ username: string, email: string } | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const isEditMode = !!taskId;
  
  // Get the task to edit if in edit mode
  const taskToEdit = isEditMode && taskId ? getTask(taskId) : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      priority: (taskToEdit?.priority as "low" | "medium" | "high") || "medium",
      storyPoints: taskToEdit?.storyPoints || 1,
      assignedTo: taskToEdit?.assignedTo || "",
    },
  });

  // Update form when task is loaded
  useEffect(() => {
    if (taskToEdit) {
      form.reset({
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        priority: (taskToEdit.priority as "low" | "medium" | "high") || "medium",
        storyPoints: taskToEdit.storyPoints || 1,
        assignedTo: taskToEdit.assignedTo || "",
      });
    }
  }, [taskToEdit, form]);

  // Fetch collaborators when the component mounts
  useEffect(() => {
    if (projectId) {
      fetchProjectCollaborators(projectId);
    }
  }, [projectId]);

  const fetchProjectCollaborators = async (id: string) => {
    setLoadingUsers(true);
    try {
      // Fetch collaborators
      const { data: collabData, error: collabError } = await supabase
        .from('collaborators')
        .select(`
          id,
          role,
          user_id,
          users:user_id (id, username, email)
        `)
        .eq('project_id', id);
        
      if (collabError) throw collabError;
      
      const formattedCollaborators: Collaborator[] = (collabData || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        username: item.users ? (item.users as any).username || '' : '',
        email: item.users ? (item.users as any).email || '' : '',
        role: item.role,
        createdAt: '',
      }));
      
      setCollaborators(formattedCollaborators);
      
      // Fetch project owner information
      const project = getProject(id);
      if (project && project.ownerId) {
        const { data: ownerData, error: ownerError } = await supabase
          .from('users')
          .select('username, email')
          .eq('id', project.ownerId)
          .single();
          
        if (!ownerError && ownerData) {
          setProjectOwner(ownerData);
        }
      }
    } catch (error) {
      console.error("Error fetching collaborators:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      if (!user) {
        toast.error("You must be logged in to create a backlog item");
        return;
      }
      
      if (isEditMode && taskId) {
        // Update existing task
        await updateTask(taskId, {
          title: data.title,
          description: data.description,
          priority: data.priority,
          storyPoints: data.storyPoints,
          assignedTo: data.assignedTo,
        });
        toast.success("Backlog item updated successfully");
      } else {
        // Create new task
        if (!projectId) {
          toast.error("Project ID is required to create a backlog item");
          return;
        }
        
        console.log('Creating new backlog item with project ID:', projectId); // Add logging to help debug
        
        // Direct Supabase insert as a fallback method
        if (user) {
          const { data: insertData, error } = await supabase
            .from('tasks')
            .insert([{
              title: data.title,
              description: data.description,
              status: "backlog",
              sprint_id: null,
              project_id: projectId,
              priority: data.priority,
              story_points: data.storyPoints,
              assign_to: data.assignedTo,
              user_id: user.id
            }]);
            
          if (error) {
            console.error("Supabase error:", error);
            throw error;
          } else {
            toast.success("Backlog item created successfully");
          }
        } else {
          // Try using the context method as originally intended
          await addTask({
            title: data.title,
            description: data.description,
            status: "backlog",
            projectId: projectId,
            priority: data.priority,
            storyPoints: data.storyPoints,
            assignedTo: data.assignedTo,
            sprintId: "",
          });
          toast.success("Backlog item created successfully");
        }
      }
      
      onClose();
    } catch (error) {
      console.error("Error creating/updating backlog item:", error);
      toast.error(`Error ${isEditMode ? 'updating' : 'creating'} backlog item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 animate-slide-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {isEditMode ? "Edit Backlog Item" : "Create Backlog Item"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter item description"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storyPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <UserCircle className="h-4 w-4" />
                    Assigned To
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loadingUsers}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      
                      {/* Project Owner */}
                      {projectOwner && (
                        <SelectItem value={projectOwner.username}>
                          {projectOwner.username} (Owner)
                        </SelectItem>
                      )}
                      
                      {/* Divider */}
                      {collaborators.length > 0 && (
                        <SelectItem value="_divider" disabled>
                          --- Collaborators ---
                        </SelectItem>
                      )}
                      
                      {/* Collaborators */}
                      {collaborators.map(collab => (
                        <SelectItem key={collab.id} value={collab.username}>
                          {collab.username} ({collab.role})
                        </SelectItem>
                      ))}
                      
                      {/* Keep the current value if it's custom */}
                      {field.value && 
                       !collaborators.some(c => c.username === field.value) && 
                       projectOwner?.username !== field.value && 
                       field.value !== "" && (
                        <SelectItem value={field.value}>
                          {field.value} (Custom)
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditMode ? "Update Item" : "Create Item"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BacklogItemForm;
