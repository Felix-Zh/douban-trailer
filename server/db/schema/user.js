import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { LOGIN as CONFIG } from '../../config';


const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  lockUntil: {
    type: Number,
    required: true,
    default: 0
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  meta: {
    meta: {
      createTime: Date,
      updateTime: Date
    }
  }
});

userSchema.virtual('isLock').get(function () {
  return Boolean(this.lockUntil >= Date.now());
});

userSchema.pre('save', async function () {
  if (this.isNew) {
    this.meta.createTime = this.meta.updateTime = Date.now();
  } else {
    this.meta.updateTime = Date.now();
  }
});

// 如果密码变更，重新加盐加密
userSchema.pre('save', async function () {
  if (this.isModifed('password')) {
    this.password = await bcrypt.hash(this.password, LOGIN.PASSWORD_SALT_ROUNDS);
  }
});

userSchema.method({

  /**
   * 校验密码
   * @param {String} rawPassword 
   * @param {String} hashPassword 
   */
  compare(rawPassword, hashPassword) {
    return bcrypt.compare(rawPassword, hashPassword);
  },

  /**
   * 更新尝试登录次数和登录锁定状态
   */
  attemptLogin() {
    const newLockUntil = { lockUntil: Date.now() + CONFIG.LOCK_TIME };

    // 已经锁定的情况
    if (this.isLock) {
      return this.update({ $set: newLockUntil });
    }

    // 本次登录达到了最大尝试限制
    if (this.loginAttempts + 1 >= CONFIG.MAX_LOGIN_ATTEMPTS) {
      return this.update({ $set: { ...newLockUntil, loginAttempts: 0 } });
    }

    // 未被锁定且未达到最大尝试限制，简单地增加一次登录尝试次数
    this.update({ $inc: { loginAttempts: 1 } });

  }

});

export default mongoose.model('User', userSchema);
