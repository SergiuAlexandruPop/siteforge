// ---------------------------------------------------------------------------
// GitHub API Utilities
// ---------------------------------------------------------------------------
// CRUD operations on markdown files in the repo via GitHub REST API.
// Used by the CMS to create, update, and delete blog posts.
// ---------------------------------------------------------------------------

interface GitHubConfig {
  token: string
  repo: string
  branch: string
}

interface GitHubFileResponse {
  content: string
  sha: string
  path: string
}

function getGitHubConfig(): GitHubConfig {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? 'main'

  if (!token || !repo) {
    throw new Error(
      'Missing GitHub configuration. Set GITHUB_TOKEN and GITHUB_REPO in your environment.'
    )
  }

  return { token, repo, branch }
}

function apiUrl(repo: string, filePath: string): string {
  return `https://api.github.com/repos/${repo}/contents/${filePath}`
}

/**
 * Read a file from the repo. Returns content (decoded from base64) and SHA.
 * Returns null if file doesn't exist.
 */
export async function readFile(
  filePath: string
): Promise<{ content: string; sha: string } | null> {
  const { token, repo, branch } = getGitHubConfig()

  const response = await fetch(`${apiUrl(repo, filePath)}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (response.status === 404) return null

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as GitHubFileResponse
  const content = Buffer.from(data.content, 'base64').toString('utf-8')

  return { content, sha: data.sha }
}

/**
 * List files in a directory. Returns array of file names.
 */
export async function listFiles(dirPath: string): Promise<string[]> {
  const { token, repo, branch } = getGitHubConfig()

  const response = await fetch(`${apiUrl(repo, dirPath)}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (response.status === 404) return []

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as Array<{ name: string; type: string }>

  return data
    .filter((item) => item.type === 'file' && item.name.endsWith('.md'))
    .map((item) => item.name)
}

/**
 * Create a new file in the repo.
 */
export async function createFile(
  filePath: string,
  content: string,
  commitMessage: string
): Promise<void> {
  const { token, repo, branch } = getGitHubConfig()

  const response = await fetch(apiUrl(repo, filePath), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      branch,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GitHub API error: ${response.status} — ${JSON.stringify(error)}`)
  }
}

/**
 * Update an existing file in the repo. Requires the current SHA.
 */
export async function updateFile(
  filePath: string,
  content: string,
  sha: string,
  commitMessage: string
): Promise<void> {
  const { token, repo, branch } = getGitHubConfig()

  const response = await fetch(apiUrl(repo, filePath), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      sha,
      branch,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GitHub API error: ${response.status} — ${JSON.stringify(error)}`)
  }
}

/**
 * Delete a file from the repo. Requires the current SHA.
 */
export async function deleteFile(
  filePath: string,
  sha: string,
  commitMessage: string
): Promise<void> {
  const { token, repo, branch } = getGitHubConfig()

  const response = await fetch(apiUrl(repo, filePath), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      sha,
      branch,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GitHub API error: ${response.status} — ${JSON.stringify(error)}`)
  }
}
