// "use client"

// import { useEffect, useState } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Project } from "@/types/types"
// import { supabase } from "@/lib/supabase"

// interface PasswordData {
//   id: string
//   service_name: string
//   url: string
//   email: string
//   assignment: string
//   password: string
//   last_updated: string
// }

// interface ProjectDetailsModalProps {
//   open: boolean
//   onClose: () => void
//   project: Project | null
// }

// export default function ProjectDetailsModal({
//   open,
//   onClose,
//   project,
// }: ProjectDetailsModalProps) {
//   const [passwords, setPasswords] = useState<PasswordData[]>([])
//   const [loading, setLoading] = useState(false)
//   const [errorMsg, setErrorMsg] = useState<string | null>(null)

//   useEffect(() => {
//     if (project?.id && open) {
//       fetchPasswords(project.id)
//     }
//   }, [project, open])

//   const fetchPasswords = async (projectId: string) => {
//     setLoading(true)
//     setErrorMsg(null)

//     const { data, error } = await supabase
//       .from("passwords")
//       .select("id, service_name, url, email, assignment, password, last_updated")
//       .eq("project_id", projectId)
//       .order("last_updated", { ascending: false })

//     if (error) {
//       console.error("Error fetching passwords:", error)
//       setErrorMsg("⚠️ Failed to load related data. Please try again.")
//     } else {
//       setPasswords(data || [])
//     }

//     setLoading(false)
//   }

//   if (!project) return null

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl p-6 rounded-2xl shadow-lg">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-bold">{project.name} – Details</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Project Meta */}
//           <div className="grid grid-cols-2 gap-6 text-sm bg-gray-50 rounded-lg p-4 border">
//             <p>
//               <span className="font-medium text-gray-600">Client:</span>{" "}
//               {project.client_name || "N/A"}
//             </p>
//             <p>
//               <span className="font-medium text-gray-600">Start Date:</span>{" "}
//               {project.start_date
//                 ? new Date(project.start_date).toLocaleDateString()
//                 : "Not set"}
//             </p>
//           </div>

//           {/* Related Passwords */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3">Related Details</h3>
//             {loading ? (
//               <p className="text-gray-500">Loading...</p>
//             ) : errorMsg ? (
//               <p className="text-red-500">{errorMsg}</p>
//             ) : passwords.length > 0 ? (
//               <div className="grid gap-4 sm:grid-cols-2">
//                 {passwords.map((item) => (
//                   <div
//                     key={item.id}
//                     className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
//                   >
//                     <p className="font-semibold text-gray-800">{item.service_name}</p>
//                     <p className="text-sm text-blue-600 truncate">
//                       <a href={item.url} target="_blank" rel="noopener noreferrer">
//                         {item.url}
//                       </a>
//                     </p>
//                     <p className="text-sm text-gray-600">{item.email}</p>
//                     <p className="text-sm">Assignment: {item.assignment}</p>
//                     <p className="text-sm font-mono text-gray-800">
//                       Password: {item.password}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Updated: {new Date(item.last_updated).toLocaleDateString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 italic">No related entries found.</p>
//             )}
//           </div>

//           <Button className="w-full" variant="secondary" onClick={onClose}>
//             Close
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
