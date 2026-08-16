import type { Allocation, Client, Department, FloatSnapshot, Person, Project, ProjectStatus } from "../types/float";
import { mockSnapshot } from "../data/mockFloatData";

// -----------------------------------------------------------------------
// INTEGRATION SEAM
// -----------------------------------------------------------------------
// FloatClient is the only thing components talk to. Everything below
// MockFloatClient is temporary. To wire up the real Float MCP server
// (https://github.com/asachs01/float-mcp, or Float's own hosted MCP beta):
//
//   1. Implement a `RealFloatClient` that satisfies this same interface,
//      calling the MCP tools instead of reading mockSnapshot:
//        - listClients/listDepartments/getProjectsFor*/getPeopleFor*
//          -> `manage-entity` (read actions on clients/departments/people/projects)
//        - getAllocationsForProject -> `manage-project-workflow`
//        - ask(question) -> route the question through an LLM tool-calling
//          loop with `manage-entity`, `manage-project-workflow`,
//          `manage-time-tracking`, and `generate-report` bound as tools
//          (this replaces the keyword matching in askMock below)
//   2. Swap the export at the bottom of this file from `mockFloatClient`
//      to `realFloatClient`. No component changes needed.
// -----------------------------------------------------------------------

export interface FloatClient {
  readonly source: "mock" | "float-mcp";
  getSnapshot(): Promise<FloatSnapshot>;
  listClients(): Promise<Client[]>;
  listDepartments(): Promise<Department[]>;
  getProjectsForClient(clientId: string): Promise<Project[]>;
  getProjectsForDepartment(departmentId: string): Promise<Project[]>;
  getPeopleForDepartment(departmentId: string): Promise<Person[]>;
  getAllocationsForProject(projectId: string): Promise<Allocation[]>;
  ask(question: string): Promise<string>;
}

const SIMULATED_LATENCY_MS = 220;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

function personName(people: Person[], id: string): string {
  return people.find((p) => p.id === id)?.name ?? "Unassigned";
}

function clientName(clients: Client[], id: string): string {
  return clients.find((c) => c.id === id)?.name ?? "Unknown client";
}

function departmentNames(departments: Department[], ids: string[]): string {
  return ids.map((id) => departments.find((d) => d.id === id)?.name ?? id).join(", ");
}

// --- Rule-based NL responder over the mock snapshot -----------------------
// A stand-in for the LLM + Float MCP tool-calling loop described above.
// Understands a handful of question shapes: by client, by department,
// by status, by person, and "ending soon" queries.
function askMock(question: string, snapshot: FloatSnapshot): string {
  const q = question.toLowerCase();
  const { clients, departments, people, projects } = snapshot;

  const matchedClient = clients.find((c) => q.includes(c.name.toLowerCase()));
  const matchedDept = departments.find((d) => q.includes(d.name.toLowerCase()));
  const matchedPerson = people.find((p) => q.includes(p.name.toLowerCase()) || q.includes(p.name.split(" ")[0].toLowerCase()));
  const statusOptions: ProjectStatus[] = ["Active", "Planned", "On Hold", "Completed"];
  const statusMatch = statusOptions.find((s) => q.includes(s.toLowerCase()));

  if (matchedPerson) {
    const theirProjects = projects.filter((p) =>
      snapshot.allocations.some((a) => a.personId === matchedPerson.id && a.projectId === p.id),
    );
    if (theirProjects.length === 0) {
      return `${matchedPerson.name} (${matchedPerson.role}) has no active allocations in the sample data.`;
    }
    const lines = theirProjects.map((p) => `- ${p.name} for ${clientName(clients, p.clientId)} (${p.status})`);
    return `${matchedPerson.name} (${matchedPerson.role}, ${departments.find((d) => d.id === matchedPerson.departmentId)?.name}) is working on:\n${lines.join("\n")}`;
  }

  if (matchedClient) {
    const clientProjects = projects.filter((p) => p.clientId === matchedClient.id);
    if (clientProjects.length === 0) return `No projects found for ${matchedClient.name} in the sample data.`;
    const lines = clientProjects.map(
      (p) => `- ${p.name}: ${p.status}, ${p.startDate} to ${p.endDate} (${departmentNames(departments, p.departmentIds)})`,
    );
    return `${matchedClient.name} has ${clientProjects.length} project(s):\n${lines.join("\n")}`;
  }

  if (matchedDept) {
    const deptProjects = projects.filter((p) => p.departmentIds.includes(matchedDept.id));
    const deptPeople = people.filter((p) => p.departmentId === matchedDept.id);
    const lines = deptProjects.map((p) => `- ${p.name} for ${clientName(clients, p.clientId)} (${p.status})`);
    return `${matchedDept.name} has ${deptPeople.length} team member(s) and is on ${deptProjects.length} project(s):\n${lines.join("\n")}`;
  }

  if (q.includes("ending soon") || q.includes("wrapping up") || q.includes("due soon")) {
    const now = new Date();
    const soon = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
    const endingSoon = projects.filter((p) => {
      const end = new Date(p.endDate);
      return p.status === "Active" && end >= now && end <= soon;
    });
    if (endingSoon.length === 0) return "No active projects are ending in the next 3 weeks.";
    const lines = endingSoon.map((p) => `- ${p.name} for ${clientName(clients, p.clientId)}, ends ${p.endDate}`);
    return `Projects wrapping up in the next 3 weeks:\n${lines.join("\n")}`;
  }

  if (statusMatch) {
    const matches = projects.filter((p) => p.status === statusMatch);
    const lines = matches.map((p) => `- ${p.name} for ${clientName(clients, p.clientId)} (${departmentNames(departments, p.departmentIds)})`);
    return `${matches.length} project(s) are ${statusMatch}:\n${lines.join("\n")}`;
  }

  if (q.includes("how many") && q.includes("project")) {
    return `There are ${projects.length} projects across ${clients.length} clients in the sample data (${projects.filter((p) => p.status === "Active").length} active).`;
  }

  return [
    "I couldn't match that to the sample data yet. Try asking things like:",
    '- "What is Globex Industries working on?"',
    '- "What projects is the Synthetic team on?"',
    '- "What is Dana Reyes working on?"',
    '- "Which projects are ending soon?"',
    '- "Show me completed projects."',
    "(This is a rule-based stand-in over temp data — once Float MCP is connected, this will route through an LLM with real Float tool access.)",
  ].join("\n");
}

class MockFloatClient implements FloatClient {
  readonly source = "mock" as const;

  async getSnapshot(): Promise<FloatSnapshot> {
    return delay(mockSnapshot);
  }

  async listClients(): Promise<Client[]> {
    return delay(mockSnapshot.clients);
  }

  async listDepartments(): Promise<Department[]> {
    return delay(mockSnapshot.departments);
  }

  async getProjectsForClient(clientId: string): Promise<Project[]> {
    return delay(mockSnapshot.projects.filter((p) => p.clientId === clientId));
  }

  async getProjectsForDepartment(departmentId: string): Promise<Project[]> {
    return delay(mockSnapshot.projects.filter((p) => p.departmentIds.includes(departmentId)));
  }

  async getPeopleForDepartment(departmentId: string): Promise<Person[]> {
    return delay(mockSnapshot.people.filter((p) => p.departmentId === departmentId));
  }

  async getAllocationsForProject(projectId: string): Promise<Allocation[]> {
    return delay(mockSnapshot.allocations.filter((a) => a.projectId === projectId));
  }

  async ask(question: string): Promise<string> {
    const answer = askMock(question, mockSnapshot);
    return delay(answer);
  }
}

export const floatClient: FloatClient = new MockFloatClient();
export { personName, clientName, departmentNames };
