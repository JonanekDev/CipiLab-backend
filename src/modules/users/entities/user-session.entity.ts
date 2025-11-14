import { UserSession } from 'generated/prisma';

export class UserSessionEntity {
  id: number;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  revoked: boolean;

  constructor(session: UserSession) {
    this.id = session.id;
    this.userAgent = session.userAgent;
    this.createdAt = session.createdAt;
    this.updatedAt = session.updatedAt;
    this.revoked = session.revoked;
  }
}
