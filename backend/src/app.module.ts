import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OtpModule } from './otp/otp.module';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';
import { ChatModule } from './chat/chat.module';
import { FriendModule } from './friend/friend.module';
import { EventModule } from './event/event.module';
import { OtpController } from './otp/otp.controller';
import { MailController } from './mail/mail.controller';
import { OtpService } from './otp/otp.service';
import { MailService } from './mail/mail.service';

@Global()
@Module({
  imports: [
    // Load environment variables and make them globally available
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    // Connect to MongoDB using the URI from environment variables
    MongooseModule.forRoot(process.env.MONGO_URI), // Removed useNewUrlParser and useUnifiedTopology

    // Import all your feature modules
    UserModule,
    PostModule,
    CommentModule,
    CloudinaryModule,
    OtpModule,
    MailModule,
    SmsModule,
    ChatModule,
    FriendModule,
    EventModule,
  ],
  controllers: [
    AppController,
    OtpController,
    MailController, // Include the controllers for OTP and Mail
  ],
  providers: [
    AppService,
    OtpService, // OTP service for OTP functionality
    MailService, // Mail service for sending emails
  ],
})
export class AppModule {}
