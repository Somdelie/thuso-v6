import { db } from "@/lib/prisma"

export const getJobById = async(jobId: string) => {
try {
    const job = await db.job.findUnique({
        where: {
            id: jobId
        },
        include: {
            author: true,
            proposals: true
        }
    })

    if (!job) return null

    return job
} catch (error: any) {
    throw new Error(error)
}
}