// Google Drive API Client Service for Logbook Kinerja
import { getAccessToken, googleSignIn } from './firebaseAuth';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
}

const FOLDER_NAME = 'Logbook Kinerja PVT Manoko';

/**
 * Ensure we have a valid access token. If missing, prompt Google Sign In.
 */
async function ensureToken(): Promise<string> {
  let token = await getAccessToken();
  if (!token) {
    const res = await googleSignIn();
    if (!res?.accessToken) {
      throw new Error('Akses token Google Drive tidak tersedia. Silakan login terlebih dahulu.');
    }
    token = res.accessToken;
  }
  return token;
}

/**
 * Finds or creates the app folder in Google Drive.
 */
export async function getOrCreateAppFolder(): Promise<string> {
  const token = await ensureToken();

  // Search for folder
  const query = encodeURIComponent(
    `name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal mencari folder di Google Drive');
  }

  const data = await searchRes.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat folder di Google Drive');
  }

  const newFolder = await createRes.json();
  return newFolder.id;
}

/**
 * Upload a file (Blob / File / JSON string) to Google Drive in the app's folder.
 */
export async function uploadFileToDrive(options: {
  fileName: string;
  mimeType: string;
  content: Blob | string;
  description?: string;
}): Promise<DriveFileItem> {
  const token = await ensureToken();
  const folderId = await getOrCreateAppFolder();

  const metadata = {
    name: options.fileName,
    mimeType: options.mimeType,
    parents: [folderId],
    description: options.description || 'Disinkronkan dari Aplikasi Logbook Kinerja',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );

  const fileBlob =
    typeof options.content === 'string'
      ? new Blob([options.content], { type: options.mimeType })
      : options.content;

  form.append('file', fileBlob);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,createdTime,modifiedTime,size,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal mengupload berkas ke Google Drive');
  }

  return (await res.json()) as DriveFileItem;
}

/**
 * List files in the app's folder.
 */
export async function listAppFiles(): Promise<DriveFileItem[]> {
  const token = await ensureToken();
  const folderId = await getOrCreateAppFolder();

  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime desc&fields=files(id,name,mimeType,createdTime,modifiedTime,size,webViewLink,webContentLink)`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membaca berkas dari Google Drive');
  }

  const data = await res.json();
  return (data.files || []) as DriveFileItem[];
}

/**
 * Download file content (e.g. JSON backup) from Google Drive.
 */
export async function downloadFileContent(fileId: string): Promise<string> {
  const token = await ensureToken();
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Gagal mengunduh isi berkas dari Google Drive');
  }

  return await res.text();
}

/**
 * Delete a file in Google Drive.
 */
export async function deleteFileFromDrive(fileId: string): Promise<void> {
  const token = await ensureToken();
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error('Gagal menghapus berkas dari Google Drive');
  }
}
