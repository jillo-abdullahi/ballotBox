// Format timestamp to locale string
export const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleString()

// Share helper: Web Share API → clipboard → prompt
export async function shareUrl(url: string, text?: string) {
  const title = "BallotBox"
  try {
    if (navigator.share) return await navigator.share({ title, text, url })
    await navigator.clipboard.writeText(url)
    alert("Link copied!")
  } catch {
    prompt("Copy link:", url)
  }
}

// Check if proposal voting is still open
export const isProposalOpen = (deadline: number) => Date.now() / 1000 <= deadline

// Calculate voting percentages
export const calculateVotingPercentages = (yes: number, no: number) => {
  const total = yes + no
  
  // If no votes yet, show 0% for both
  if (total === 0) {
    return { yesPct: 0, noPct: 0, total: 0 }
  }
  
  const yesPct = Math.round((yes / total) * 100)
  const noPct = 100 - yesPct
  return { yesPct, noPct, total }
}
