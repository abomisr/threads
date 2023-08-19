"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

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
  try {
    await connectToDB();

    const communityIdObject = await Community.findOne(
      {id:communityId},
      {_id:1},
    )

    const writtenThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: writtenThread._id },
    });

    if(communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject,{
        $push: {threads:writtenThread._id},
      })
    }

    revalidatePath(path);
  } catch (err: any) {
    throw new Error(`Error write thread: ${err.message}`);
  }
};

export const fetchPosts = async (pageNumber = 1, pageSize = 20) => {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ writtenAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User, select: "_id id name image" })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (err: any) {
    throw new Error("Error fetching posts: " + err.message);
  }
};

export const fetchThreadById = async (id: string) => {
  try {
    await connectToDB();

    const thread = await Thread.findById(id)
      .populate({ path: "author", model: User, select: "_id id name image" })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err: any) {
    throw new Error("Error fetching thread: " + err.message);
  }
};

export const addCommentToThread = async ({
  threadId,
  commentText,
  userId,
  path,
}: {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}) => {
  connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) throw new Error("Thread not found");

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (err: any) {
    throw new Error("Error adding comment to thread: " + err.message);
  }
};
