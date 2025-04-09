
import { ReportParams } from '@/types';
import { getAuthToken } from './auth';

const API_URL = 'https://api.recipebook.example'; // Replace with actual API URL when available

export async function generateReport(params: ReportParams): Promise<Blob> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const queryParams = new URLSearchParams();
    queryParams.append('type', params.type);
    
    if (params.userId) {
      queryParams.append('userId', params.userId);
    }
    
    if (params.categoryId) {
      queryParams.append('categoryId', params.categoryId);
    }
    
    queryParams.append('format', params.format);

    const response = await fetch(`${API_URL}/reports?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    return response.blob();
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

export function downloadReport(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
