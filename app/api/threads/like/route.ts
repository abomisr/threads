import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  let { userId, threadId } = await req.json();

  try {
    threadId = new mongoose.Types.ObjectId(threadId);
    connectToDB();

    const user = await User.findOne({
      id: userId,
    });

    const isLiked = user.likedThreads.includes(threadId);

    if (isLiked) {
      await User.findOneAndUpdate(
        { id: userId },
        {
          $pull: { likedThreads: threadId },
        }
      );
      await Thread.findByIdAndUpdate(threadId, {
        $pull: { likes: userId },
      });
    } else {
      await User.findOneAndUpdate(
        { id: userId },
        {
          $push: { likedThreads: threadId },
        }
      );
      await Thread.findByIdAndUpdate(threadId, {
        $push: { likes: userId },
      });
    }

    return NextResponse.json(!isLiked);
  } catch (err: any) {
    throw new Error(`Failed to like a thread: ${err.message}`);
  }
};
