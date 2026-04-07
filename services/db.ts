
import { Dexie, type Table } from 'dexie';
import { Session, ChatMessage, ArchivedDocument, MediaAsset, Project } from '../types';

export class TaliaDB extends Dexie {
  projects!: Table<Project>;
  sessions!: Table<Session>;
  messages!: Table<ChatMessage>;
  archives!: Table<ArchivedDocument>;
  assets!: Table<MediaAsset>;

  constructor() {
    super('TaliaDB');
    
    // Schema evolution
    // Fix: Explicitly using this as any to handle potential inheritance visibility issues in some TS configurations
    (this as any).version(5).stores({
      projects: 'id, createdAt',
      sessions: 'id, projectId, mode, createdAt',
      messages: 'id, sessionId, timestamp',
      archives: 'id, createdAt',
      assets: 'id, sessionId, type, source, createdAt'
    });
  }
}

export const db = new TaliaDB();
