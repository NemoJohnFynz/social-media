import {
  Controller, Post, Body, UseGuards, Put,
  HttpException, HttpStatus, Param, Get, Type, Delete,
  UseInterceptors, UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ChatService } from './chat.service';
import { ObjectId, Types } from 'mongoose';
import { AuthGuardD } from 'src/user/guard/auth.guard';
import { CurrentUser } from 'src/user/decorator/currentUser.decorator';
import { User } from 'src/user/schemas/user.schemas';
import { CreateGroupDto } from './dto/createGroup.dto';
import { SendMessageDto } from './dto/sendMessage.dto';
import { EventService } from '../event/event.service';
import { authorize } from 'passport';
import { addMembersToGroupDto } from './dto/addMemberGroup.dto';


@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly eventService: EventService
  ) { }

  @Post('creategroup')
  @UseGuards(AuthGuardD)
  async createGroupChat(
    @CurrentUser() currentUser: User,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    if (!currentUser) {
      throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
    }
    const owner = new Types.ObjectId(currentUser._id.toString());
    return this.chatService.createGroup(createGroupDto, owner);
  }

  @Post('sendmessagetoGroup/:groupId')
  @UseGuards(AuthGuardD)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async sendMessageToGroup(
    @CurrentUser() currentUser: User,
    @Param('groupId') groupId: Types.ObjectId,
    @Body() sendMessageDto: SendMessageDto,
    @UploadedFiles() files: { files: Express.Multer.File[] },
  ) {
    if (!currentUser) {
      throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
    }
    const currentUserID = new Types.ObjectId(currentUser._id as string);

    const message = await this.chatService.sendMessageToGroup(sendMessageDto, currentUserID, groupId, files?.files);


    const currentAuthor = {
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      avatar: currentUser.avatar,
    };

    const messageSee = {
      ...sendMessageDto,
      mediaURL: message.mediaURL,
      author: currentAuthor,
      _id: message._id,
      sender: {
        _id: currentUser._id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        avatar: currentUser.avatar
      }
    };


    const groupParticipants = await this.chatService.getMemberGroup(groupId);

    if (!Array.isArray(groupParticipants)) {
      throw new HttpException('Invalid group participants data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    console.log('groupParticipants:', groupParticipants);


    groupParticipants.forEach((participant) => {

      this.eventService.notificationToUser(participant._id.toString(), 'newmessage', messageSee);

    });
    console.log('Saved message:', message);
    return message;
  }


  @Get('getmessagegroup/:groupId')
  async getMessageGroup(
    @Param('groupId') groupId: Types.ObjectId,

  ) {

    const messages = await this.chatService.getGroupMessages(groupId);
    return messages;
  }

  @Get('MembersGroup/:idgr')
  @UseGuards(AuthGuardD)
  async getMembersGroup(
    @CurrentUser() currentUser: User,
    @Param('idgr') idgr: Types.ObjectId,
  ) {
    return await this.chatService.getMemberGroup(idgr);

  }

  @Get('getMylistChat')
  @UseGuards(AuthGuardD)
  async getListMessage(
    @CurrentUser() currentUser: User,
  ) {
    const currentUserOBJ = new Types.ObjectId(currentUser._id.toString());
    return await this.chatService.getMylishChat(currentUserOBJ);
  }

  @Delete('removeMemBerInGroup/:groupId')
  @UseGuards(AuthGuardD)
  async removeMemberInGroup(
    @CurrentUser() currentUser: User,
    @Param('groupId') groupId: Types.ObjectId,
    @Body('userId') userId: Types.ObjectId,
  ) {
    return await this.chatService.removeMemberInGroup(groupId, userId);
  }

  @Post('sendmessageToUser/:userId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  @UseGuards(AuthGuardD)

  async sendMessageToUser(
    @CurrentUser() currentUser: User,
    @Param('userId') userId: Types.ObjectId,
    @Body() sendMessageDto: SendMessageDto,
    @UploadedFiles() files: { files: Express.Multer.File[] },
  ) {

    try {
      const checkTypeReceiver = userId;
      if (Types.ObjectId.isValid(userId)) {
        console.log('receiverId is a valid ObjectId');
      } else {
        console.log('receiverId is not a valid ObjectId');
      }

      const currentUserOBJ = new Types.ObjectId(currentUser._id.toString());
      const UserOBJ = new Types.ObjectId(userId.toString());
      const message = await this.chatService.sendMesageToUser(currentUserOBJ, UserOBJ, sendMessageDto, files?.files);

      const currentAuthor = {
        _id: currentUser._id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        avatar: currentUser.avatar,
      };

      const notificationUsers = [
        { user: userId.toString(), author: currentUser._id.toString() },
        { user: currentUser._id.toString(), author: currentUser._id.toString() },
      ];

      const messageSee = {
        ...sendMessageDto,
        mediaURL: message.mediaURL,
        author: currentAuthor,
        _id: message._id,
      };

      notificationUsers.map(async (notif) => {
        this.eventService.notificationToUser(notif.user, 'newmessage', messageSee);
      });

      return message;
    }
    catch (error) {
      console.error('Error uploading images to Cloudinary:', error);
      throw new HttpException('Failed to upload images', HttpStatus.INTERNAL_SERVER_ERROR);

    }

  }

  @Get('getmessagestouser/:userId')
  @UseGuards(AuthGuardD)
  async getMessageUser(
    @CurrentUser() currentUser: User,
    @Param('userId') userId: Types.ObjectId,
  ) {
    const currentUserOBJ = new Types.ObjectId(currentUser._id.toString());
    const userIdOBJ = new Types.ObjectId(userId.toString());
    return await this.chatService.getMessagesToUser(currentUserOBJ, userIdOBJ);
  }

  @Put('revokedMesage/:messageId')
  @UseGuards(AuthGuardD)
  async revokeAMessage(
    @CurrentUser() currentUser: User,
    @Param('messageId') messageId: Types.ObjectId,
  ) {
    const messageOBJ = new Types.ObjectId(messageId.toString());
    const currentUserOBJ = new Types.ObjectId(currentUser._id.toString());
    return await this.chatService.revokeAMessage(messageOBJ, currentUserOBJ);
  }

  @Put('addMembersTogroup/:groupId')
  @UseGuards(AuthGuardD)
  async addMembersToGroup(
    @CurrentUser() currentUser: User,
    @Param('groupId') groupId: Types.ObjectId,
    @Body('participants') addMembersToGroupDto: addMembersToGroupDto,
  ) {
    try {
      if (!currentUser) {
        throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
      }
      if (!Array.isArray(addMembersToGroupDto)) {
        throw new HttpException('Invalid user data', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return await this.chatService.addMembersToGroup(addMembersToGroupDto, groupId);
    } catch (error) {
      console.log('error in chatcontroller /addMembersTogroup', error);
    }

  }



}