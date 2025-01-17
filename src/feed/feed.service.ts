import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class FeedService{
    constructor(private readonly prismaService: PrismaService) {}

    async getProfileImage( userId: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                profile_image: true,
            }
        });
    }

    async getFeed(userId: number) {
        const posts = await this.prismaService.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                profile_image: true,
                            }
                        }
                    }
                },
                analysis: {
                    select: {
                        like_count: true,
                        comment_count: true,
                        repost_count: true,
                    },
                },
                like: {
                    where: { userId: userId }, 
                    select: { id: true },
                },
                repost: {
                    where: { userId: userId },
                    select: { id: true },
                }
            },
        });

        return posts.map(post => ({
            ...post,
            analysis: post.analysis[0],
            comments: post.comments[0],
            isLiked: post.like.length > 0, 
            isReposted: post.repost.length > 0,
        }));
    }

    async createPost(createPostDto: CreatePostDto, userId: number, imagePath?: string) {
        const { content, createdAt } = createPostDto;
        const user = await this.prismaService.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error('Kullanıcı bulunamadı.');
        }

        const post = await this.prismaService.post.create({
            data: {
                content,
                image: imagePath || null,
                createdAt: new Date(),
                userId: userId,
                analysis: {
                    create: {
                        like_count: 0,
                        comment_count: 0,
                        repost_count: 0,
                    },
                },
            },
            include: {
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                profile_image: true,
                            }
                        }
                    }
                },
                analysis: {
                    select: {
                        like_count: true,
                        comment_count: true,
                        repost_count: true,
                    },
                },
                like: {
                    where: { userId: userId }, 
                    select: { id: true },
                },
                repost: {
                    where: { userId: userId },
                    select: { id: true },
                }
            },
        });
        return post;
    }

    async getRandomUsers(userId: number) {
        const followedUserIds = await this.prismaService.following.findMany({
            where: { followersId: userId },
            select: { followingId: true },
        });
    
        const followedIds = followedUserIds.map(follow => follow.followingId);
    
        const randomUsers = await this.prismaService.user.findMany({
            where: {
                id: { notIn: [...followedIds, userId] },
            },
            take: 5,
        });
    
        return randomUsers;
    }

    async followUser(followerUserId: number, followedUserId: number) {
        const existingFollow = await this.prismaService.following.findUnique({
            where: {
                followersId_followingId: {
                    followersId: followerUserId,
                    followingId: followedUserId,
                },
            },
        });
    
        if (existingFollow) {
            throw new Error('Bu kullanıcı zaten takip ediliyor.');
        }
    
        return await this.prismaService.following.create({
            data: {
                followersId: followerUserId,
                followingId: followedUserId,
            },
        });
    }

    async toggleLikePost(postId: string, userId: number) {
        const postID = parseInt(postId, 10);
    
        const post = await this.prismaService.post.findUnique({
            where: { id: postID },
            include :{ analysis: true, user: true },
        });
    
        if (!post) {
            throw new Error('Post bulunamadı.');
        }
    
        const existingLike = await this.prismaService.like.findFirst({
            where: { userId, postId: postID },
        });
    
        let like_count_change = 0;
        let isLiked: boolean;
    
        if (existingLike) {
            await this.prismaService.like.delete({
                where: { id: existingLike.id },
            });
    
            like_count_change = -1; 
            isLiked = false;
        } else {
            await this.prismaService.like.create({
                data: {
                    userId,
                    postId: postID,
                },
            });
    
            like_count_change = 1;
            isLiked = true;
        }

        let analysis = await this.prismaService.analysis.findFirst({
            where: { postId: postID },
        });
    
        if (!analysis) {
            analysis = await this.prismaService.analysis.create({
                data: {
                    like_count: 0,
                    comment_count: 0,
                    read_count: 0,
                    repost_count: 0,
                    comment: {
                        connect: { id: postID },
                    },
                },
            });
        }

        const updatedAnalysis = await this.prismaService.analysis.update({
            where: { id: analysis.id },
            data: {
                like_count: { increment: like_count_change },
            },
        });
    
        return {
            message: isLiked ? 'Post beğenildi.' : 'Beğeni kaldırıldı.',
            like_count: updatedAnalysis.like_count,
            isLiked,
            updatedAnalysis,
        };
    }

    async toggleRepost(postId: string, userId: number) {
        const postID = parseInt(postId, 10);
    
        const post = await this.prismaService.post.findUnique({
            where: { id: postID },
            include: { analysis: true },
        });
    
        if (!post) {
            throw new Error('Post bulunamadı.');
        }
        const existingRepost = await this.prismaService.repost.findFirst({
            where: { userId, postId: postID },
        });
    
        let repost_count_change = 0;
        let isReposted: boolean;
    
        if (existingRepost) {
            await this.prismaService.repost.delete({
                where: { id: existingRepost.id },
            });

            const repostedPost = await this.prismaService.post.findFirst({
                where: {
                    originalPostId: postID,
                    userId: userId,
                },
            });
    
            if (repostedPost) {
                await this.prismaService.post.delete({
                    where: { id: repostedPost.id },
                });
            }
        
            repost_count_change = -1;
            isReposted = false;
        } else {
            await this.prismaService.repost.create({
                data: { userId, postId: postID },
            });

            repost_count_change = 1;
            isReposted = true;
        }

        let analysis = await this.prismaService.analysis.findFirst({
            where: { postId: postID },
        });
    
        if (!analysis) {
            analysis = await this.prismaService.analysis.create({
                data: {
                    like_count: 0,
                    comment_count: 0,
                    read_count: 0,
                    repost_count: 0,
                    post: {
                        connect: { id: postID },
                    },
                },
            });
        }

        const updatedAnalysis = await this.prismaService.analysis.update({
            where: { id: analysis.id },
            data: {
                repost_count: { increment: repost_count_change },
            },
        });
    
        return {
            originalPost: {
                id: post.id,
                content: post.content,
                analysis: updatedAnalysis,
                isRepostedByUser: isReposted,
            },
            repost_count: updatedAnalysis.repost_count,
            isReposted,
        };
    }    

    async getCommentsForPost(postId: string) {
        const postID = parseInt(postId, 10);
        const comments = await this.prismaService.comments.findMany({
            where: { postId: postID },
            include: {
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                profile_image: true,
                            },
                        },
                    },
                },
                like: true,
                analysis: {
                    select: {
                        like_count: true,
                        comment_count: true,
                    }
                },
            },
        });

        return comments.map(comment => ({
            ...comment,
            analysis: comment.analysis[0],
            isLiked: comment.like.length > 0, 
            replies: comment.replies || [],
        }));
    }
    
    async getRepliesForComment(commentId: string) {
        const commentID = parseInt(commentId, 10);
        const replies = await this.prismaService.comments.findMany({
            where: { parentCommentId: commentID },
            include: {
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
                like: true,
                analysis: {
                    select: {
                        like_count: true,
                        comment_count: true,
                    }
                },
            },
        });

        return replies.map(reply => ({
            ...reply,
            like: true,
            analysis: reply.analysis[0],
            isLiked: reply.like.length > 0, 
            replies: this.getRepliesForComment(reply.id.toString()),
        }));
    }    

    async sendComment(postId: string, content: string, userId: number) {
        const postID = parseInt(postId, 10);
    
        const post = await this.prismaService.post.findUnique({ where: { id: postID } });
        if (!post) {
            throw new Error('Post bulunamadı.');
        }
    
        const comments = await this.prismaService.comments.create({
            data: {
                content: content,
                postId: postID,
                userId,
                publish_date: new Date(),
            },
            include: {
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
                like: true,
                analysis: {
                    select: {
                        like_count: true,
                        comment_count: true,
                    }
                },
            },
        });
    
        let analysis = await this.prismaService.analysis.findFirst({
            where: { postId: postID },
        });
    
        if (!analysis) {
            analysis = await this.prismaService.analysis.create({
                data: {
                    postId: postID,
                    comment_count: 0,
                    like_count: 0,
                },
            });
        }
    
        const updatedAnalysis = await this.prismaService.analysis.update({
            where: { id: analysis.id },
            data: {
                comment_count: { increment: 1 },
            },
        });
        return {
            ...comments,
            analysis: comments.analysis[0],
            isLiked: comments.like.length > 0, 
            commentCount: updatedAnalysis.comment_count,
            message: 'Yanıt başarıyla eklendi.',
        };
    }
    
    async reply(parentCommentId: string, content: string, userId: number) {
        const parentCommentID = parseInt(parentCommentId, 10);
    
        const parentComment = await this.prismaService.comments.findUnique({
            where: { id: parentCommentID },
        });
    
        if (!parentComment) {
            throw new Error('Comment bulunamadı.');
        }
    
        const reply = await this.prismaService.comments.create({
            data: {
                content: content,
                parentCommentId: parentCommentID,
                userId,
                publish_date: new Date(),
            },
            include: {
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
                like: true,
            },
        });
    
        const analysis = await this.prismaService.analysis.findFirst({
            where: { commentId: parentCommentID },
        });
    
        let updatedReplyCount;
        if (analysis) {
            const updatedAnalysis = await this.prismaService.analysis.update({
                where: { id: analysis.id },
                data: {
                    comment_count: { increment: 1 },
                },
            });
            updatedReplyCount = updatedAnalysis.comment_count;
        }
    
        return {
            reply,
            comment_count: updatedReplyCount || 0,
            message: 'Yanıt başarıyla eklendi.',
        };
    }
    
    async likeComment(commentId: string, userId: number) {
        const commentID = parseInt(commentId, 10);
    
        const comment = await this.prismaService.comments.findUnique({
            where: { id: commentID },
        });
    
        if (!comment) {
            throw new Error('Comment bulunamadı.');
        }
    
        const existingLike = await this.prismaService.like.findFirst({
            where: { userId, commentId: commentID },
        });
    
        let likeCountChange = 0;
        let isLiked: boolean;
    
        if (existingLike) {
            await this.prismaService.like.delete({
                where: { id: existingLike.id },
            });
    
            likeCountChange = -1;
            isLiked = false;
        } else {
            await this.prismaService.like.create({
                data: {
                    userId,
                    commentId: commentID,
                },
            });
    
            likeCountChange = 1;
            isLiked = true;
        }
    
        let analysis = await this.prismaService.analysis.findFirst({
            where: { commentId: commentID },
        });
    
        if (!analysis) {
            analysis = await this.prismaService.analysis.create({
                data: {
                    like_count: 0,
                    comment_count: 0,
                    read_count: 0,
                    repost_count: 0,
                    comment: {
                        connect: { id: commentID },
                    },
                },
            });
        }
    
        const updatedAnalysis = await this.prismaService.analysis.update({
            where: { id: analysis.id },
            data: {
                like_count: { increment: likeCountChange },
            },
        });
    
        return {
            message: isLiked ? 'Yorum beğenildi.' : 'Beğeni kaldırıldı.',
            like_count: updatedAnalysis.like_count,
            isLiked,
            analysis,
        };
    }    
}
