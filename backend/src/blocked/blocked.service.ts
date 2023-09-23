import {HttpException, HttpStatus,  Injectable } from '@nestjs/common';
import { BlockedUser } from 'src/database/blockedUser.entity';
import { User } from 'src/database/user.entity';
import { UserFriends } from 'src/database/userFriends.entity';
import { Repository, Not, Equal } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class BlockedService {
  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User>,
  @InjectRepository(BlockedUser)
  private readonly blockedRepository: Repository<BlockedUser>,
  @InjectRepository(UserFriends)
    private readonly userFriendsRepository: Repository<UserFriends>,){}

    async create(userID: Number, blockedID: Number) {
      // console.log("USERID ______ ", userID);
      // console.log("blockedID ______ ", blockedID);
      if (userID == blockedID)
        throw new HttpException("User is trying to block himself", HttpStatus.FORBIDDEN);
      const user = await this.userRepository.findOne({ where: { id: Equal(userID) }, relations: ['blockedUsers', 'blockingUsers'] });
      const bluuck = await this.userRepository.findOne({ where: { id: Equal(blockedID) }, relations: ['blockedUsers', 'blockingUsers'] });
      // console.log("USER= ==== ", user);
      // console.log("BLUUUUCK= ==== ", bluuck);
      const block = await this.blockedRepository.findOne({ where: { blockedby: Equal(userID), blockeduser: Equal(blockedID) }, relations: ['blockedby', 'blockeduser'] })
      if (!user || !bluuck)
        throw new HttpException("The user or the recipient is not found", HttpStatus.FORBIDDEN);
      if (block)
        throw new HttpException("This user has already been blocked", HttpStatus.FORBIDDEN);
      const friendship = await this.userFriendsRepository.findOne({ where: [{ sender: Equal(userID), receiver: Equal(blockedID) }, { sender: Equal(blockedID), receiver: Equal(userID) }] });
      if (friendship)
        await this.userFriendsRepository.remove(friendship);
      // const blocking = new BlockedUser();
      // blocking.blockedby = user;
      // blocking.blockeduser = bluuck;
      const blockedUserEntity = new BlockedUser();
    blockedUserEntity.setBlockedRelationship(user, bluuck);
      // user.blockedUsers.push(blocking);
      // bluuck.blockingUsers.push(blocking);
      await this.userRepository.save([user, bluuck]);
      // console.log("------ ", user.blockedUsers);      
      await this.blockedRepository.save(blockedUserEntity);
    }

  findAll() {
    return `This action returns all blocked`;
  }

  async unblock(userid: Number, recipientid: Number) {
    console.log(userid, " ========= ", recipientid);
    const user = await this.userRepository.findOne({where:{id:Equal(userid)}, relations: ['blockedUsers', 'blockingUsers']});
    const blocked = await this.userRepository.findOne({where:{id:Equal(recipientid)}, relations: ['blockedUsers', 'blockingUsers']});
    if (!user || !blocked)
      throw new HttpException("The current/blocked user doesn't exist", HttpStatus.FORBIDDEN);
      if (!user || !blocked)
      throw new HttpException("The current/blocked user doesn't exist", HttpStatus.FORBIDDEN);
    // console.log("------ ", user.blockedUsers, " ======== ", user.blockingUsers);
    const search = user.blockingUsers.find(block => block.blockeduser.id == recipientid);
    if (!search)
      throw new HttpException("You do not have the right to unblock this user", HttpStatus.FORBIDDEN);
      await this.blockedRepository.remove(search);
  }

  async getblocked(userid: Number): Promise<User[]>
  {
    const user = await this.userRepository.findOne({
      where: { id: Equal(userid) },
      relations: ['blockingUsers', 'blockedUsers'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // console.log("++++++++++ ", user.blockingUsers);
    const blocked = user.blockingUsers.map(blocked=> blocked.blockeduser);
    // console.log("--=-=-> ", blocked);
    return (blocked);
  }

  async isBlocked(userid: Number, recipientid: Number): Promise<boolean>
  {
    const user = await this.userRepository.findOne({
      where: { id: Equal(userid) },
      relations: ['blockedUsers', 'blockingUsers'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // console.log(userid, " ===== ", recipientid);
    const blocked = user.blockingUsers.find(block => block.blockeduser.id == recipientid);
    if (blocked)
      return true;
    else
     return false;
  }

  async isBlocking(userid: Number, recipientid: Number): Promise<boolean>
  {
    const user = await this.userRepository.findOne({
      where: { id: Equal(userid) },
      relations: ['blockingUsers', 'blockedUsers'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // console.log(userid, " ===== ", recipientid);
    const blocking = user.blockedUsers.find(block => block.blockedby.id == recipientid);
    if (blocking)
      return true;
    else
     return false;
  }
}
