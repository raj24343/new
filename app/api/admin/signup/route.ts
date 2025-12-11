import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name ,email, password ,role} = body;
        if(!name || !email || !password || !role){
            return NextResponse.json({message:"missing parameters"}, {status:400})
        }
        const existing = await prisma.user.findUnique({where:{email}});
        if(existing){
            return NextResponse.json({message:"user already exists"}, {status:400})
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password: hashed,
                role
            }
        });
        return NextResponse.json({user}, {status:201})
    } catch (error) {
        return NextResponse.json({message:"internal server error in signup route"}, {status:500})
    }
}