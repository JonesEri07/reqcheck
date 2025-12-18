/**
 * Greenhouse Job Board API Client
 * Documentation: https://developers.greenhouse.io/job-board.html
 */

export interface GreenhouseJob {
  id: number;
  internal_job_id: number;
  title: string;
  updated_at: string;
  requisition_id?: string;
  location?: {
    name: string;
  };
  absolute_url: string;
  language: string;
  metadata: any;
  content: string; // HTML content of job description
  departments?: Array<{
    id: number;
    name: string;
    parent_id: number | null;
    child_ids: number[];
  }>;
  offices?: Array<{
    id: number;
    name: string;
    location: string;
    parent_id: number | null;
    child_ids: number[];
  }>;
}

export interface GreenhouseJobsResponse {
  jobs: GreenhouseJob[];
}

/**
 * Fetch all jobs from Greenhouse Job Board API
 * Note: The ?content=true parameter is required to include job description content
 */
export async function fetchGreenhouseJobs(
  boardToken: string
): Promise<GreenhouseJob[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Greenhouse API error: ${response.status} ${response.statusText}`
    );
  }

  const data: GreenhouseJobsResponse = await response.json();
  return data.jobs;
}
