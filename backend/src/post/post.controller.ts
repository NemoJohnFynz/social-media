import { Put, Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuardD } from '../user/guard/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/createpost.dto';
import { CurrentUser } from '../user/decorator/currentUser.decorator';
import { User } from '../user/schemas/user.schemas';
import { OptionalAuthGuard } from '../user/guard/optional.guard';

@Controller('post')
export class PostController {

    constructor(
        private postService: PostService
    ) { }


    @Post('createPost')
    @UseGuards(AuthGuardD)
    @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
    async createPost(
        @CurrentUser() currentUser: User,
        @Body() createPostDto: CreatePostDto,
        @UploadedFiles() files: { files: Express.Multer.File[] }
    ) {

        if (!currentUser) {
            throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
        }
        console.log('Current User:', currentUser);
        console.log('Uploaded Files:', files);

        return this.postService.createPost(createPostDto, currentUser._id.toString(), files.files);
    }

    @Get('testOptionalGuard')
    @UseGuards(OptionalAuthGuard)
    testOptionalGuard(@CurrentUser() currentUser: User) {
        console.log('Current User:', currentUser);
        return currentUser;
    }




    @Put(':id/like')
    @UseGuards(AuthGuardD)
    async likePost(@Param('id') id: string, @CurrentUser() currentUser: User) {
        if (!currentUser) {
            throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
        }

        return await this.postService.likePost(id, currentUser._id.toString());
    }
    @Put(':id/unlike')
    @UseGuards(AuthGuardD)
    async unlikePost(@Param('id') id: string, @CurrentUser() currentUser: User) {
        if (!currentUser) {
            throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
        }

        return await this.postService.unlikePost(id, currentUser._id.toString());
    }
    @Put(':id/dislike')
    @UseGuards(AuthGuardD)
    async dislikePost(@Param('id') id: string, @CurrentUser() currentUser: User) {
        if (!currentUser) {
            throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
        }

        return await this.postService.dislikePost(id, currentUser._id.toString());
    }
    @Put(':id/undislike')
    @UseGuards(AuthGuardD)
    async undislikePost(@Param('id') id: string, @CurrentUser() currentUser: User) {
        if (!currentUser) {
            throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
        }

        return await this.postService.undislikePost(id, currentUser._id.toString());
    }

   
    @Get('crpost')
    @UseGuards(AuthGuardD)
    async getCurrentPost(
        @CurrentUser() currentUser: User,
    ) {
        return this.postService.findPostCurrentUser(currentUser._id.toString())
    }
 


    @Get(':postId/privacy')
    @UseGuards(AuthGuardD)
    async findPostPrivacy(
        @CurrentUser() currentUser: User,
        @Param('postId') postId: string,
    ) {
        return this.postService.findPostPrivacy(postId, currentUser._id.toString());
    }

    @Get('getHomeFeed')
    @UseGuards(AuthGuardD)
    async getHomeFeed(@CurrentUser() currentUser: User) {
      const currentUserId = currentUser ? currentUser._id.toString() : undefined;
      return this.postService.getHomeFeed(currentUserId);
    }


    @Get('friend/:userId')
    @UseGuards(AuthGuardD)
    async getPostsByUser(
        @Param('userId') userId: string,
        @CurrentUser() currentUser: User
    ) {
        try {
            const posts = await this.postService.getPostsByUser(userId, currentUser._id.toString() || null);
            return posts;
        }   catch (error) {
            throw new HttpException('An error occurred while fetching posts  ????', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}


