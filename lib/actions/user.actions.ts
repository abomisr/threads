"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function updateUser({
  id,
  username,
  name,
  bio,
  image,
  path,
}: Record<string, string>): Promise<void> {
  connectToDB();

  try{
    await User.findOneAndUpdate(
        { id },
        {
          username: username.toLowerCase(),
          name,
          bio,
          image,
          onboarded: true,
        },{upsert:true}
      );
    
      if(path === "/profile/edit"){
        revalidatePath(path)
      }
  }catch(err:any){
    throw new Error(`Failed to write/update user: ${err.message}`)
  }
}

