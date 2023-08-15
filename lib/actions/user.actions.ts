"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

interface Props {
  id: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  id,
  username,
  name,
  bio,
  image,
  path,
}: Props): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (err: any) {
    throw new Error(`Failed to write/update user: ${err.message}`);
  }
}
export async function fetchUser(userId:string) {
  try {
    connectToDB();
  
    return await User.findOne({id:userId})
    // .populate({
    //   path:"communities",
    //   model:Community,
    // })
  } catch (err: any) {
    throw new Error(`Failed to fetch user: ${err.message}`);
  }
}


