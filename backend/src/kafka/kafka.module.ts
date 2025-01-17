import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { KafkaService } from './kafka.service';
import { KafkaConsumerService } from './kafkaConsumer.service';
import { KafkaProducerService } from './kafkaProducer.service';

@Module({
  controllers: [KafkaController],
  providers: [KafkaService, KafkaConsumerService, KafkaProducerService]
})
export class KafkaModule {}
