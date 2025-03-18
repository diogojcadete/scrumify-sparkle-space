
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  LineChart,
} from "recharts";
import { format, parseISO, startOfDay, addDays, isBefore, isAfter, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { BurndownData, Task } from "@/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BurndownDataPoint {
  date: string;
  ideal: number;
  actual: number;
  formattedDate: string;
}

const BurndownChart: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProject, getTasksBySprint, getSprintsByProject, tasks, sprints } = useProjects();
  const { user } = useAuth();
  const [chartData, setChartData] = useState<BurndownDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const project = useMemo(() => getProject(projectId || ""), [projectId, getProject]);
  
  // Memoize sprints and tasks to avoid re-renders
  const projectSprints = useMemo(() => 
    projectId ? getSprintsByProject(projectId) : [],
    [projectId, getSprintsByProject, sprints]
  );
  
  const allSprintTasks = useMemo(() => {
    const result: Task[] = [];
    projectSprints.forEach(sprint => {
      const sprintTasks = getTasksBySprint(sprint.id);
      result.push(...sprintTasks);
    });
    return result;
  }, [projectSprints, getTasksBySprint, tasks]);
  
  useEffect(() => {
    const fetchBurndownData = async () => {
      if (!projectId || !user) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const burndownData = await generateBurndownData();
        setChartData(burndownData);
      } catch (error) {
        console.error("Error generating burndown data:", error);
        setError("Failed to load burndown chart data");
        toast.error("Failed to load burndown chart data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBurndownData();
  }, [projectId, user, allSprintTasks]);
  
  const generateBurndownData = async (): Promise<BurndownDataPoint[]> => {
    const data: BurndownDataPoint[] = [];
    const today = startOfDay(new Date());
    
    if (projectSprints.length === 0) {
      return generateDefaultTimeframe(today, 21);
    }
    
    // Find earliest sprint start date and latest sprint end date
    let earliestStartDate: Date | null = null;
    let latestEndDate: Date | null = null;
    
    for (const sprint of projectSprints) {
      const startDate = parseISO(sprint.startDate);
      const endDate = parseISO(sprint.endDate);
      
      if (!earliestStartDate || isBefore(startDate, earliestStartDate)) {
        earliestStartDate = startDate;
      }
      
      if (!latestEndDate || isAfter(endDate, latestEndDate)) {
        latestEndDate = endDate;
      }
    }
    
    if (!earliestStartDate || !latestEndDate) {
      return generateDefaultTimeframe(today, 21);
    }
    
    // Calculate days between earliest and latest dates
    const daysInProject = differenceInDays(latestEndDate, earliestStartDate) + 1;
    
    // Ensure we have at least 7 days for visibility
    const timeframeDays = Math.max(daysInProject, 7);
    
    // Calculate total story points across all tasks
    const totalStoryPoints = allSprintTasks.reduce((sum, task) => {
      return sum + (task.storyPoints || 0);
    }, 0);
    
    if (totalStoryPoints === 0) {
      return generateDefaultTimeframe(today, timeframeDays);
    }
    
    // Create a map to track completed tasks by date
    const completedTasksByDate = new Map<string, number>();
    
    // Populate the map with completed tasks
    allSprintTasks.forEach(task => {
      if (task.status === "done" && task.updatedAt && task.storyPoints) {
        const completionDate = task.updatedAt.split('T')[0];
        const currentPoints = completedTasksByDate.get(completionDate) || 0;
        completedTasksByDate.set(completionDate, currentPoints + task.storyPoints);
      }
    });
    
    // Generate data points for each day in the project timeframe
    let remainingPoints = totalStoryPoints;
    let actualRemainingPoints = totalStoryPoints;
    const pointsPerDay = totalStoryPoints / timeframeDays;
    
    for (let i = 0; i < timeframeDays; i++) {
      const date = addDays(earliestStartDate, i);
      const dateStr = date.toISOString().split('T')[0];
      const formattedDate = format(date, "MMM dd");
      
      // Calculate ideal burndown - linear decrease over the project timeframe
      const idealRemaining = Math.max(0, totalStoryPoints - (i * pointsPerDay));
      
      // For past dates, reduce actual points based on completed tasks
      if (isBefore(date, today) || date.getTime() === today.getTime()) {
        const completedPoints = completedTasksByDate.get(dateStr) || 0;
        actualRemainingPoints = Math.max(0, actualRemainingPoints - completedPoints);
      }
      
      data.push({
        date: dateStr,
        ideal: Math.round(idealRemaining),
        actual: Math.round(actualRemainingPoints),
        formattedDate
      });
    }
    
    return data;
  };
  
  const generateDefaultTimeframe = (startDate: Date, days: number): BurndownDataPoint[] => {
    const data: BurndownDataPoint[] = [];
    const totalPoints = 100;
    const pointsPerDay = totalPoints / days;
    
    for (let i = 0; i < days; i++) {
      const date = addDays(startDate, i);
      const dateStr = date.toISOString().split('T')[0];
      const idealRemaining = Math.max(0, totalPoints - (i * pointsPerDay));
      
      data.push({
        date: dateStr,
        ideal: Math.round(idealRemaining),
        actual: Math.round(idealRemaining), // Start with ideal for default
        formattedDate: format(date, "MMM dd"),
      });
    }
    
    return data;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-scrum-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-scrum-text-secondary">Loading burndown chart data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="scrum-card p-6 text-center">
        <p className="text-red-500 mb-2">Error loading burndown data</p>
        <p className="text-scrum-text-secondary">Please try refreshing the page</p>
      </div>
    );
  }
  
  const chartConfig = {
    ideal: {
      label: "Ideal Burndown",
      color: "#8884d8"
    },
    actual: {
      label: "Actual Burndown",
      color: "#82ca9d"
    }
  };
  
  return (
    <div>
      <div className="scrum-card mb-6">
        <h2 className="text-xl font-bold mb-2">Project Burndown Chart</h2>
        <p className="text-scrum-text-secondary">
          Tracking progress across all sprints in {project?.title || "this project"}
        </p>
      </div>
      
      <div className="scrum-card h-[500px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <LineChart
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="formattedDate"
              stroke="var(--color-muted-foreground)"
            />
            <YAxis
              label={{ 
                value: "Story Points Remaining", 
                angle: -90, 
                position: "insideLeft"
              }}
              stroke="var(--color-muted-foreground)"
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent
                      payload={payload}
                      active={active}
                    />
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ideal"
              name="ideal"
              stroke="var(--color-ideal)"
              activeDot={{ r: 8 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="actual"
              stroke="var(--color-actual)"
              activeDot={{ r: 8 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
      
      <div className="scrum-card mt-6 p-4">
        <h3 className="text-lg font-medium mb-3">How to Read the Burndown Chart</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-scrum-text-secondary">
          <li>
            <strong>Ideal Burndown</strong>: Shows the theoretical perfect progress where work is completed at a constant rate.
          </li>
          <li>
            <strong>Actual Burndown</strong>: Shows the actual remaining work based on completed tasks.
          </li>
          <li>
            When the Actual line is <strong>above</strong> the Ideal line, the project is <strong>behind schedule</strong>.
          </li>
          <li>
            When the Actual line is <strong>below</strong> the Ideal line, the project is <strong>ahead of schedule</strong>.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BurndownChart;
