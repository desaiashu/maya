/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface Auth {
  userid: string;
  token: string;
  timestamp: number;
}
export interface ChatInfo {
  chatid: string;
  creator: string;
  participants: string[];
  profiles?: User[];
  topic?: string;
  protocol: string;
}
export interface User {
  userid: string;
  username: string;
  avatar?: string;
}
export interface ChatRequest {
  userid: string;
  token: string;
  command: string;
  data: ChatInfo;
}
export interface Chunk {
  chatid: string;
  sender: string;
  time: number;
  chunk: string;
  end: boolean;
}
export interface ChunkUpdate {
  update: string;
  data: Chunk;
}
export interface Context {
  chatid: string;
  content: string;
  sender: string;
  role: string;
  participant: string;
  tokens: number;
  timestamp: number;
}
export interface ErrorUpdate {
  update: string;
  data: string;
}
export interface JsonableModel {}
export interface LastRefresh {
  time: number;
}
export interface MayaRequest {
  userid: string;
  token: string;
  command: string;
  data?: unknown;
}
export interface MayaUpdate {
  update: string;
  data?: unknown;
}
export interface Message {
  chatid: string;
  content: string;
  sender: string;
  timestamp: number;
}
export interface MessageRequest {
  userid: string;
  token: string;
  command: string;
  data: Message;
}
export interface MessageUpdate {
  update: string;
  data: Message;
}
export interface MongoModel {}
export interface RefreshData {
  chatlist: ChatInfo[];
  messages: Message[];
  protocols: string[];
}
export interface RefreshRequest {
  userid: string;
  token: string;
  command: string;
  data: LastRefresh;
}
export interface RefreshUpdate {
  update: string;
  data: RefreshData;
}
export interface SuccessUpdate {
  update: string;
  data: string;
}
export interface UserRequest {
  userid: string;
  token: string;
  command: string;
  data: User;
}
