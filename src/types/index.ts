export type Proposal = {
  id: number
  title: string
  description: string
  details?: string     // Optional detailed description for proposal pages
  author: string       // 0x… address or handle
  createdAt: number    // epoch seconds
  deadline: number     // epoch seconds
  yes: number
  no: number
}
