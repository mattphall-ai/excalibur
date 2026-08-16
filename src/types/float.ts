// Shapes mirror the entities exposed by Float's API / Float MCP server
// (people, projects, clients, departments, allocations). See src/lib/floatClient.ts
// for the swap-in point where mock data is replaced by real Float MCP calls.

export type ProjectStatus = "Active" | "Planned" | "On Hold" | "Completed";

export interface Client {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  departmentIds: string[];
  projectManagerId: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  budgetHours: number;
}

export interface Allocation {
  id: string;
  projectId: string;
  personId: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  hoursPerWeek: number;
}

export interface FloatSnapshot {
  clients: Client[];
  departments: Department[];
  people: Person[];
  projects: Project[];
  allocations: Allocation[];
}
