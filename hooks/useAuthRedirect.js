"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const useAuthRedirect = () => {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return
        if (status === "unauthenticated") {
            router.push("/Home")
        }
    }, [status, router])

    return { session, status, update }
}

export default useAuthRedirect