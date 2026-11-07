"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/client";
import { currentUser } from "@clerk/nextjs/server";

export type CurrentUserData = Prisma.UserGetPayload<{
    include: {
        solvedProblems: true;
        submissions: { orderBy: { createdAt: "desc" } };
        playlists: true;
    };
}>;


export const onBoardUser = async()=>{
    try {
        const user = await currentUser();
        if(!user){
            return {success: false, error: "No authenticated user found"}
        }

        const {id, firstName, lastName, imageUrl, emailAddresses} = user;
        const newUser = await prisma.user.upsert({
            where:{
                clerkId: id
            },
            update:{
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0].emailAddress || ""
            },
            create:{
                clerkId: id,
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0].emailAddress || ""
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const currentUserRole = async()=>{
    try {
        const user = await currentUser();
        if(!user){
            return {success: false, error: "No authenticated user found"}
        }
        const {id} = user;
        const userRole = await prisma.user.findUnique({
            where:{
                clerkId:id
            },
            select:{
                role: true
            }
        })

        return userRole?.role;
    } catch (error) {
        console.log(error)
    }
}

export const getCurrentUserData = async(): Promise<CurrentUserData | null> =>{
    try {
        const user = await currentUser();
        if(!user){
            return null;
        }
        const data = await prisma.user.findUnique({
            where:{
                clerkId: user?.id
            },
            include:{
                solvedProblems: true,
                submissions: {
                    orderBy: { createdAt: "desc" },
                },
                playlists: true,
            }
        })
        return data;
    } catch (error) {
        console.log(error)
        return null;
    }
}

