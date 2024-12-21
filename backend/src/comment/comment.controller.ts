import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UseInterceptors, UploadedFiles, HttpException, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { AuthGuardD } from '../user/guard/auth.guard';
import { CurrentUser } from '../user/decorator/currentUser.decorator';
import { User } from '../user/schemas/user.schemas'
import { RolesGuard } from '../user/guard/role.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('comments')
@UseGuards(AuthGuardD)
export class CommentController {
  constructor(private readonly commentService: CommentService) { }



  @UseGuards(AuthGuardD)
  @Post(':postId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 2 }]))
  async createCmt(
    @Param('postId') postId: string,
    @CurrentUser() currentUser: User,
    @Body() commetDto: CommentDto,
    @UploadedFiles() files: { files: Express.Multer.File[] }
  ) {
    if (!currentUser) {
      throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
    }

    console.log('Current User:', currentUser);
    console.log('Uploaded Files:', files);

    return this.commentService.create(currentUser._id.toString(), postId, commetDto, files.files);
  }

  @Get()
  async findAll() {
    return await this.commentService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.commentService.findById(id);
  }

  @Get('post/:postId')
  async findByPostId(@Param('postId') postId: string) {
    return await this.commentService.findByPostId(postId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.commentService.delete(id);
  }

  @Put(':id')
  @UseGuards(AuthGuardD)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 2 }]))
  async update(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
    @Body() updateCommentDto: CommentDto,
    @UploadedFiles() files: { files: Express.Multer.File[] }
  ) {
    if (!currentUser) {
      throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
    }

    return await this.commentService.update(id, currentUser._id.toString(), updateCommentDto, files.files);
  }
  @Put(':id/like')
  @UseGuards(AuthGuardD)
  async likeComment(@Param('id') id: string, @CurrentUser() currentUser: User) {
    if (!currentUser) {
      throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
    }

    return await this.commentService.likeComment(id, currentUser._id.toString());
  }

  @Post(':id/reply')
  @UseGuards(AuthGuardD)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 2 }]))
  async reply(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
    @Body() replyDto: CommentDto,
    @UploadedFiles() files: { files: Express.Multer.File[] }
  ) {
    if (!currentUser) {
      throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
    }

    return await this.commentService.reply(id, currentUser._id.toString(), replyDto, files.files);
  }
}


