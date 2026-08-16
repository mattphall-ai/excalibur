import type { Allocation, Client, Department, FloatSnapshot, Person, Project } from "../types/float";

// -----------------------------------------------------------------------
// TEMPORARY SAMPLE DATA
// -----------------------------------------------------------------------
// This file stands in for a real Float account until Float MCP credentials
// are available. Shapes match Float's core entities (clients, departments,
// people, projects, allocations) so that src/lib/floatClient.ts can be
// repointed at real MCP tool calls later without touching any component.
// See src/lib/floatClient.ts for the swap-in instructions.
// -----------------------------------------------------------------------

export const departments: Department[] = [
  { id: "dep-synthetic", name: "Synthetic" },
  { id: "dep-creative", name: "Creative" },
  { id: "dep-engineering", name: "Engineering" },
  { id: "dep-strategy", name: "Strategy" },
  { id: "dep-accounts", name: "Account Management" },
];

export const clients: Client[] = [
  { id: "cl-acme", name: "Acme Corp" },
  { id: "cl-globex", name: "Globex Industries" },
  { id: "cl-initech", name: "Initech" },
  { id: "cl-umbrella", name: "Umbrella Health" },
  { id: "cl-stark", name: "Stark Retail" },
  { id: "cl-wonka", name: "Wonka Foods" },
];

export const people: Person[] = [
  { id: "p1", name: "Maya Torres", role: "Creative Director", departmentId: "dep-creative", email: "maya.torres@agency.com" },
  { id: "p2", name: "Jordan Blake", role: "Senior Designer", departmentId: "dep-creative", email: "jordan.blake@agency.com" },
  { id: "p10", name: "Ivy Chen", role: "Copywriter", departmentId: "dep-creative", email: "ivy.chen@agency.com" },
  { id: "p3", name: "Sam Patel", role: "Engineering Lead", departmentId: "dep-engineering", email: "sam.patel@agency.com" },
  { id: "p4", name: "Ravi Kumar", role: "Backend Engineer", departmentId: "dep-engineering", email: "ravi.kumar@agency.com" },
  { id: "p11", name: "Noah Fischer", role: "Frontend Engineer", departmentId: "dep-engineering", email: "noah.fischer@agency.com" },
  { id: "p5", name: "Dana Reyes", role: "Synthetic Lead", departmentId: "dep-synthetic", email: "dana.reyes@agency.com" },
  { id: "p6", name: "Priya Nair", role: "Synthetic Modeler", departmentId: "dep-synthetic", email: "priya.nair@agency.com" },
  { id: "p8", name: "Owen Chu", role: "Synthetic Data Scientist", departmentId: "dep-synthetic", email: "owen.chu@agency.com" },
  { id: "p9", name: "Lena Fitch", role: "Synthetic QA Analyst", departmentId: "dep-synthetic", email: "lena.fitch@agency.com" },
  { id: "p7", name: "Elena Vasquez", role: "Strategy Director", departmentId: "dep-strategy", email: "elena.vasquez@agency.com" },
  { id: "p12", name: "Chris Dalton", role: "Strategist", departmentId: "dep-strategy", email: "chris.dalton@agency.com" },
  { id: "p13", name: "Grace Kim", role: "Account Director", departmentId: "dep-accounts", email: "grace.kim@agency.com" },
  { id: "p14", name: "Tom Reilly", role: "Account Manager", departmentId: "dep-accounts", email: "tom.reilly@agency.com" },
];

export const projects: Project[] = [
  { id: "proj-acme-rebrand", name: "Acme Rebrand", clientId: "cl-acme", status: "Active", departmentIds: ["dep-creative", "dep-strategy"], projectManagerId: "p1", startDate: "2026-06-01", endDate: "2026-09-30", budgetHours: 480 },
  { id: "proj-acme-support", name: "Acme Ongoing Support Retainer", clientId: "cl-acme", status: "Active", departmentIds: ["dep-engineering"], projectManagerId: "p3", startDate: "2026-01-01", endDate: "2026-12-31", budgetHours: 800 },
  { id: "proj-acme-synth-pilot", name: "Acme Synthetic Data Pilot", clientId: "cl-acme", status: "Completed", departmentIds: ["dep-synthetic"], projectManagerId: "p6", startDate: "2026-03-01", endDate: "2026-06-15", budgetHours: 320 },
  { id: "proj-globex-synth-model", name: "Globex Synthetic Demand Model", clientId: "cl-globex", status: "Active", departmentIds: ["dep-synthetic"], projectManagerId: "p5", startDate: "2026-07-01", endDate: "2026-10-15", budgetHours: 600 },
  { id: "proj-globex-launch", name: "Globex Product Launch Campaign", clientId: "cl-globex", status: "Planned", departmentIds: ["dep-creative", "dep-accounts"], projectManagerId: "p2", startDate: "2026-09-01", endDate: "2026-12-01", budgetHours: 300 },
  { id: "proj-globex-audit", name: "Globex Data Audit", clientId: "cl-globex", status: "On Hold", departmentIds: ["dep-strategy"], projectManagerId: "p7", startDate: "2026-05-01", endDate: "2026-07-15", budgetHours: 180 },
  { id: "proj-initech-migration", name: "Initech Platform Migration", clientId: "cl-initech", status: "Active", departmentIds: ["dep-engineering"], projectManagerId: "p3", startDate: "2026-05-15", endDate: "2026-08-30", budgetHours: 520 },
  { id: "proj-initech-synthdata", name: "Initech Synthetic Test Data", clientId: "cl-initech", status: "Active", departmentIds: ["dep-synthetic"], projectManagerId: "p6", startDate: "2026-06-01", endDate: "2026-09-01", budgetHours: 400 },
  { id: "proj-umbrella-portal", name: "Umbrella Patient Portal", clientId: "cl-umbrella", status: "On Hold", departmentIds: ["dep-engineering", "dep-strategy"], projectManagerId: "p4", startDate: "2026-04-01", endDate: "2026-08-01", budgetHours: 350 },
  { id: "proj-umbrella-synth-qa", name: "Umbrella Synthetic Records QA", clientId: "cl-umbrella", status: "Planned", departmentIds: ["dep-synthetic"], projectManagerId: "p6", startDate: "2026-09-15", endDate: "2026-11-30", budgetHours: 280 },
  { id: "proj-stark-holiday", name: "Stark Holiday Campaign", clientId: "cl-stark", status: "Completed", departmentIds: ["dep-creative"], projectManagerId: "p2", startDate: "2026-02-01", endDate: "2026-05-01", budgetHours: 260 },
  { id: "proj-stark-loyalty", name: "Stark Loyalty Program Strategy", clientId: "cl-stark", status: "Active", departmentIds: ["dep-strategy", "dep-accounts"], projectManagerId: "p7", startDate: "2026-07-15", endDate: "2026-10-30", budgetHours: 300 },
  { id: "proj-wonka-synth-flavor", name: "Wonka Synthetic Flavor Panel Sim", clientId: "cl-wonka", status: "Active", departmentIds: ["dep-synthetic"], projectManagerId: "p5", startDate: "2026-08-01", endDate: "2026-11-15", budgetHours: 450 },
  { id: "proj-wonka-brandbook", name: "Wonka Brand Guidelines Refresh", clientId: "cl-wonka", status: "Planned", departmentIds: ["dep-creative"], projectManagerId: "p1", startDate: "2026-10-01", endDate: "2026-12-15", budgetHours: 200 },
];

export const allocations: Allocation[] = [
  { id: "alloc-1", projectId: "proj-acme-rebrand", personId: "p1", startDate: "2026-06-01", endDate: "2026-09-30", hoursPerWeek: 20 },
  { id: "alloc-2", projectId: "proj-acme-rebrand", personId: "p2", startDate: "2026-06-01", endDate: "2026-09-30", hoursPerWeek: 25 },
  { id: "alloc-3", projectId: "proj-acme-rebrand", personId: "p10", startDate: "2026-06-15", endDate: "2026-09-15", hoursPerWeek: 15 },
  { id: "alloc-4", projectId: "proj-acme-support", personId: "p3", startDate: "2026-01-01", endDate: "2026-12-31", hoursPerWeek: 10 },
  { id: "alloc-5", projectId: "proj-acme-support", personId: "p4", startDate: "2026-01-01", endDate: "2026-12-31", hoursPerWeek: 15 },
  { id: "alloc-6", projectId: "proj-acme-synth-pilot", personId: "p6", startDate: "2026-03-01", endDate: "2026-06-15", hoursPerWeek: 20 },
  { id: "alloc-7", projectId: "proj-globex-synth-model", personId: "p5", startDate: "2026-07-01", endDate: "2026-10-15", hoursPerWeek: 25 },
  { id: "alloc-8", projectId: "proj-globex-synth-model", personId: "p8", startDate: "2026-07-01", endDate: "2026-10-15", hoursPerWeek: 30 },
  { id: "alloc-9", projectId: "proj-globex-launch", personId: "p2", startDate: "2026-09-01", endDate: "2026-12-01", hoursPerWeek: 20 },
  { id: "alloc-10", projectId: "proj-globex-launch", personId: "p14", startDate: "2026-09-01", endDate: "2026-12-01", hoursPerWeek: 10 },
  { id: "alloc-11", projectId: "proj-initech-migration", personId: "p3", startDate: "2026-05-15", endDate: "2026-08-30", hoursPerWeek: 20 },
  { id: "alloc-12", projectId: "proj-initech-migration", personId: "p11", startDate: "2026-05-15", endDate: "2026-08-30", hoursPerWeek: 30 },
  { id: "alloc-13", projectId: "proj-initech-synthdata", personId: "p6", startDate: "2026-06-01", endDate: "2026-09-01", hoursPerWeek: 20 },
  { id: "alloc-14", projectId: "proj-initech-synthdata", personId: "p9", startDate: "2026-06-01", endDate: "2026-09-01", hoursPerWeek: 25 },
  { id: "alloc-15", projectId: "proj-umbrella-portal", personId: "p4", startDate: "2026-04-01", endDate: "2026-08-01", hoursPerWeek: 15 },
  { id: "alloc-16", projectId: "proj-umbrella-synth-qa", personId: "p9", startDate: "2026-09-15", endDate: "2026-11-30", hoursPerWeek: 20 },
  { id: "alloc-17", projectId: "proj-stark-loyalty", personId: "p7", startDate: "2026-07-15", endDate: "2026-10-30", hoursPerWeek: 15 },
  { id: "alloc-18", projectId: "proj-stark-loyalty", personId: "p13", startDate: "2026-07-15", endDate: "2026-10-30", hoursPerWeek: 10 },
  { id: "alloc-19", projectId: "proj-wonka-synth-flavor", personId: "p5", startDate: "2026-08-01", endDate: "2026-11-15", hoursPerWeek: 20 },
  { id: "alloc-20", projectId: "proj-wonka-synth-flavor", personId: "p8", startDate: "2026-08-01", endDate: "2026-11-15", hoursPerWeek: 25 },
  { id: "alloc-21", projectId: "proj-wonka-synth-flavor", personId: "p9", startDate: "2026-08-01", endDate: "2026-11-15", hoursPerWeek: 15 },
  { id: "alloc-22", projectId: "proj-globex-audit", personId: "p12", startDate: "2026-05-01", endDate: "2026-07-15", hoursPerWeek: 10 },
];

export const mockSnapshot: FloatSnapshot = {
  clients,
  departments,
  people,
  projects,
  allocations,
};
