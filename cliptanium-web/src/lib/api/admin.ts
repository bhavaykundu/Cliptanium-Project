import { fetchAPI } from './client';

export async function getAdminQueue() {
  return fetchAPI('/admin/submissions/pending');
}

export async function reviewSubmission(submissionId: string, action: 'approve' | 'reject', reason?: string) {
  return fetchAPI(`/admin/submissions/${submissionId}/review`, {
    method: 'POST',
    body: JSON.stringify({ action, reason }),
  });
}