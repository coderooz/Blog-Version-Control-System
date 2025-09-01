import { NextRequest, NextResponse } from "next/server";
import BlogPost from "@models/BlogPost";
import connect from "@lib/db";

export default async function GET(req: NextRequest){
    try{
        await connect();
        const ret = BlogPost.find({});
        return NextResponse.json({ret},{status: 200});
    } catch (error) {
        console.log("Error in api/content/route.ts", error);
        return NextResponse.json({message: "Internal Server Error!"}, {status: 400});
    }
}
