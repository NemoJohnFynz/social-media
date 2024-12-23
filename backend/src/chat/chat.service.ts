import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './schema/message.schema';
import { GroupMessage } from './schema/groupMessage.schema';
import { User } from '../user/schemas/user.schemas';
import { CreateGroupDto } from './dto/createGroup.dto';
import { SendMessageDto } from './dto/sendMessage.dto';
import { content } from 'googleapis/build/src/apis/content';
import { Group } from './schema/group.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RoomChat } from './schema/roomChat.schema';
import { addMembersToGroupDto } from './dto/addMemberGroup.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Message.name) private readonly MessageModel: Model<Message>,
        @InjectModel(GroupMessage.name) private readonly GroupMessageModel: Model<GroupMessage>,
        @InjectModel(Group.name) private readonly GroupModel: Model<Group>,
        @InjectModel(User.name) private readonly UserModel: Model<User>,
        @InjectModel(RoomChat.name) private readonly RoomChatModel: Model<RoomChat>,
        private readonly cloudinaryService : CloudinaryService,
    ){}


    async createGroup(createGroupDto: CreateGroupDto, userId: Types.ObjectId){
        const { name, avatarGroup, participants } = createGroupDto;
        const participantIds = participants.map(participant =>
          new Types.ObjectId(participant)
      );
        const group = new this.GroupModel({
          name,
          avatarGroup,
          owner: userId,
          participants: [...participantIds, userId],
        });
    
        return await group.save();
    }


    async sendMessageToGroup(
      sendMessageDto: SendMessageDto, 
      userId: Types.ObjectId, 
      groupId: Types.ObjectId, 
      files?: Express.Multer.File[]
    ): Promise<GroupMessage> {
      const { content, mediaURL } = sendMessageDto;
    
      // Khởi tạo tin nhắn
      const groupMessage = new this.GroupMessageModel({
        group: groupId,
        sender: userId,

        content,
        reading: [],
      });
    

      if (files && files.length > 0) {
        try {
          
          const uploadedMedia = await Promise.all(files.map(file => this.cloudinaryService.uploadFile(file)));
          
          groupMessage.mediaURL = uploadedMedia;
          
         
        } catch (error) {
          console.error('Error uploading images to Cloudinary:', error);
          throw new HttpException('Failed to upload images', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }
      return await groupMessage.save();
    }
    

    async getGroupMessages(groupId: Types.ObjectId): Promise<{ group: any; messages: GroupMessage[] }> {
     
      const group = await this.GroupModel.findById(groupId)
        .populate({ 
          path: 'owner', 
          select: 'firstName lastName avatar' 
        })
        .populate({ 
          path: 'participants', 
          select: 'firstName lastName avatar'
        })
        .exec();
    
      if (!group) {
        throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
      }

      const messages = await this.GroupMessageModel.find({ group: groupId })
        .populate({ 
          path: 'sender', 
          select: 'firstName lastName avatar' 
        })
        .exec();
    
      if (!messages.length) { 
        throw new HttpException('Group has no messages', HttpStatus.NOT_FOUND);
      }

      return { group, messages };
    }

    async getMemberGroup(groupId: Types.ObjectId): Promise<User[]> {
      try {
        const swagerGroupId = new Types.ObjectId(groupId);
        const group = await this.GroupModel.findById(swagerGroupId)
          .populate({
            path: 'participants',
             model: 'User',
            select: '_id firstName lastName avatar', // chọn các trường muốn hiển thị
          })
          .exec();
    
        if (!group) {
          throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
        }
  
        return group.participants;
      } catch (error) {
        console.error('Error fetching group members:', error);
        throw new HttpException('Failed to fetch group members', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }



    async getMylishChat(userId: string | Types.ObjectId): Promise<{ Group: Group[]; Participants: any[] }> {
      const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    

      const distinctUserIds = await this.MessageModel.distinct('sender', {
        $or: [
          { sender: userObjectId },
          { receiver: userObjectId },
        ],
      }).then(ids => ids.map(id => id.toString()));
    

      const normalizeIds = (ids: (string | Types.ObjectId)[]) => {
        return ids.map(id => {

          if (typeof id === 'string' && Types.ObjectId.isValid(id)) {
            return new Types.ObjectId(id);
          }
          return id;
        });
      };
    
      // Lấy các participants (người tham gia khác với user hiện tại)
      const participants = await this.UserModel.find({
        _id: { $in: normalizeIds(distinctUserIds), $ne: userObjectId }, // Exclude the current user
      }).select('firstName lastName avatar')
      // .sort({createdAt : -1})
    
      // Lấy nhóm mà user tham gia
      const groups = await this.GroupModel.find({
        participants: { $in: normalizeIds([userObjectId]) }, // Normalize userObjectId
      }).select('name avatarGroup')
      // .sort({createdAt : -1})
      .exec();
      return {
        Group: groups,
        Participants: participants,
      };
    }
    
    
    

    async removeMemberInGroup(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<Group> {
      const group = await this.GroupModel.findById(groupId);
      if (!group) {
        throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
      }
    
      if (group.owner.toString() !== userId.toString()) {
        throw new HttpException('You are not the owner of this group', HttpStatus.UNAUTHORIZED);
      }
    
      group.participants = group.participants.filter((id) => id.toString() !== userId.toString());
      return await group.save();
    }
    

    async sendMesageToUser(
      senderId: Types.ObjectId,
      receiverId: Types.ObjectId, 
      sendMessageDto: SendMessageDto,
      files?: Express.Multer.File[]
    ): Promise<Message> {
      const { content } = sendMessageDto;
      const user = await this.UserModel.findById(receiverId);
      
      // Ensure the receiver exists
      if (!user) {
        throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
      }
    

      

      const Message = new this.MessageModel({
        sender: senderId,
        receiver: receiverId,
        content,
      });
    
      // Upload files if provided
      if (files && files.length > 0) {
        try {
          const uploadedMedia = await Promise.all(files.map(file => this.cloudinaryService.uploadFile(file)));
          Message.mediaURL = uploadedMedia;  
        } catch (error) {
          console.error('Error uploading images to Cloudinary:', error);
          throw new HttpException('Failed to upload images', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
      if (Types.ObjectId.isValid(receiverId)) {
        const receiverObjectId = new Types.ObjectId(receiverId); 
        console.log('Converted receiverId to ObjectId:', receiverObjectId);
      } else {
        console.log('receiverId is not a valid ObjectId string');
      }
    
      // Save and return the message
      return await Message.save();
    }

    async getMessagesToUser(userId: Types.ObjectId, receiverId: Types.ObjectId): Promise<any[]> {
      const messages = await this.MessageModel.find({
        $or: [
          { sender: userId, receiver: receiverId },
          { sender: receiverId, receiver: userId },
        ],
      })
        .sort({ createdAt: 1 })
        .exec();
    
      if (!messages.length) {
        throw new HttpException('No messages found', HttpStatus.NOT_FOUND);
      }
      const processedMessages = messages.map((message) => {
        if (!message.isLive) {
          return {
            _id: message._id,
            sender: message.sender,
            receiver: message.receiver,
            content: 'The message has been revoked', 
          };
        }
        return message;
      });
    
      return processedMessages;
    }
    

    async revokeAMessage(messageId: Types.ObjectId, userId: Types.ObjectId): Promise<Message | GroupMessage> {
      // Tìm tin nhắn trong MessageModel
      let message = await this.MessageModel.findById(messageId);
      let messageSource = 'MessageModel';
    

      if (!message) {
        message = await this.GroupMessageModel.findById(messageId);
        messageSource = 'GroupMessageModel';
      }
    

      if (!message) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }
    

      if (message.sender.toString() !== userId.toString()) {
        throw new HttpException('You are not authorized to revoke this message', HttpStatus.FORBIDDEN);
      }
    
      
      const updateFields = {
        isLive: false,
        content: null,
        mediaURL: null,
      };
    
      if (messageSource === 'MessageModel') {
        message = await this.MessageModel.findByIdAndUpdate(messageId, updateFields, { new: true });
      } else if (messageSource === 'GroupMessageModel') {
        message = await this.GroupMessageModel.findByIdAndUpdate(messageId, updateFields, { new: true });
      }
    

      return message;
    }
    
    


    async addMembersToGroup(
      addMembersToGroupDto: addMembersToGroupDto,
      groupId: Types.ObjectId,
    ): Promise<Group> {
      const { participants } = addMembersToGroupDto;
    
      // Kiểm tra xem group có tồn tại hay không
      const group = await this.GroupModel.findById(groupId);
      if (!group) {
        throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
      }
    

      const existingParticipantIds = group.participants.map((id) => id.toString());
    
 
      const newParticipantIds = participants.filter(
        (id) => !existingParticipantIds.includes(id.toString()),
      );
    
      if (newParticipantIds.length === 0) {
        throw new HttpException(
          'All users are already in the group',
          HttpStatus.BAD_REQUEST,
        );
      }
    
      // Thêm userId mới vào participants
      const newParticipants = await this.UserModel.find({ _id: { $in: newParticipantIds } });
      group.participants.push(...newParticipants);
    
      // Lưu group sau khi thêm
      return await group.save();
    }
    
    
    
    
    

    
}

