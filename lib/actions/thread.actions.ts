"user server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export const writeThread = async ({
  text,
  author,
  communityId,
  path,
}: Params) => {
  try{
    await connectToDB();

    const writtenThread = await Thread.create({
        text,
        author,
        community: null,
    })

    await User.findByIdAndUpdate(author,{
        $push:{threads:writtenThread._id}
    })

    revalidatePath(path)
  }catch(err:any){
    throw new Error(`Error write thread: ${err.message}`)
  }
};
