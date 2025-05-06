import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const syncUser = mutation({
  args: {// Define the arguments for the mutation
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();// Check if the user already exists in Convex
    if (existingUser) return;

    return await ctx.db.insert("users", args);//add new user to the users in the database.
  },
});

export const updateUser = mutation({
  args:{
    name: v.string(),
    email: v.string(),
    image_url: v.optional(v.string()),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
    .first();

    if(!existingUser) return ;
    
    return await ctx.db.patch(existingUser._id, args);//update the user in the database.
    
  }
});
