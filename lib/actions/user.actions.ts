"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

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
export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    //   path:"communities",
    //   model:Community,
    // })
  } catch (err: any) {
    throw new Error(`Failed to fetch user: ${err.message}`);
  }
}

export const fetchUserPosts = async (userId: string) => {
  try {
    connectToDB();

    const threads = await User.findById(userId).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "image name id",
        },
      },
    });

    return threads;
  } catch (err: any) {
    throw new Error(`Failed to fetch user posts: ${err.message}`);
  }
};

export const fetchUsers = async ({
  userId,
  searchString="",
  pageNumber=1,
  pageSize=20,
  sortBy="desc"
}:{
  userId:string,
  pageNumber?:number,
  pageSize?:number,
  searchString?:string,
  sortBy?:SortOrder,
}) => {
  try {
    connectToDB();

    const skipAmount = (pageNumber-1)* pageSize;

    const regex = new RegExp(searchString,"i")

    const query:FilterQuery<typeof User> = {
      id:{$ne:userId}
    }

    if(searchString.trim() !== ""){
      query.$or = [
        {username:{$regex:regex}},
        {name:{$regex:regex}}
      ]
    }

    const sortOptions = {joinedAt:sortBy}

    const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize)

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return {users,isNext}

  } catch (err:any) {
    throw new Error(`Failed to search users: ${err.message}`);
  }
};


export const getActivity = async (userId:string) =>{
  try {
    connectToDB();

    const userThreads = await Thread.find({
      author:userId
    });

    const childThreadIds = userThreads.reduce((acc,userThread)=>{
      return acc.concat(userThread.children)
    },[])

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: {$ne:userId}
    }).populate({
      path:"author",
      model:User,
      select:"image name _id"
    })

    return replies
  } catch (err:any) {
    throw new Error(`Failed to get Activity: ${err.message}`);
  }
}