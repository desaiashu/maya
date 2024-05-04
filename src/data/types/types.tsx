/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export type WSRequest =
  | "auth"
  | "verify"
  | "refresh"
  | "message"
  | "annotation"
  | "perspective"
  | "create_chat"
  | "update_group"
  | "update_user"
  | "thread";
export type WSUpdate =
  | "refresh"
  | "success"
  | "error"
  | "chunk"
  | "message"
  | "chatinfo"
  | "user"
  | "confidence"
  | "related"
  | "search"
  | "thread";

export interface AnnotationRequest {
  userid: string;
  token: string;
  command: WSRequest;
  data: Message[];
}
export interface Message {
  content: string;
  chatid: string;
  sender: string;
  timestamp: number;
}
export interface Auth {
  userid: string;
  token: string;
  timestamp: number;
}
export interface ChatInfo {
  chatid: string;
  creator: string;
  created: number;
  updated: number;
  participants: string[];
  profiles?: Profile[];
  topic?: string;
  protocol: string;
}
export interface Profile {
  userid: string;
  username: string;
  avatar: string;
}
export interface ChatInfoUpdate {
  data: ChatInfo;
  update?: string;
  background?: boolean;
}
export interface ChatRequest {
  userid: string;
  token: string;
  command: WSRequest;
  data: ChatInfo;
}
export interface Chunk {
  chatid: string;
  sender: string;
  timestamp: number;
  content: string;
}
export interface ChunkUpdate {
  data: Chunk;
  update?: string;
  background?: boolean;
}
export interface Confidence {
  content: string;
  chatid: string;
  sender: string;
  timestamp: number;
  messageid: number;
  value: number;
}
export interface ConfidenceUpdate {
  data: Confidence;
  update?: string;
  background?: boolean;
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
  data: string;
  update?: string;
  background?: boolean;
}
export interface JsonableModel {}
export interface LastRefresh {
  time: number;
}
export interface MayaRequest {
  userid: string;
  token: string;
  command: WSRequest;
  data?: unknown;
}
export interface MayaUpdate {
  data?: unknown;
  update: WSUpdate;
  background?: boolean;
}
export interface MessageRequest {
  userid: string;
  token: string;
  command: WSRequest;
  data: Message;
}
export interface MessageUpdate {
  data: Message;
  update?: string;
  background?: boolean;
}
export interface MongoModel {}
export interface PerspectiveData {
  chatid: string;
  messageid: number;
  lastupdated: number;
  confidence?: Confidence;
  relatedTopics: RelatedTopic[];
  searchResults: SearchResult[];
}
export interface RelatedTopic {
  chatid: string;
  messageid: number;
  topic: string;
}
export interface SearchResult {
  chatid: string;
  messageid: number;
  title: string;
  url: string;
}
export interface PerspectiveRequest {
  userid: string;
  token: string;
  command: WSRequest;
  data: Message[];
}
export interface RefreshData {
  chatlist: ChatInfo[];
  messages: Message[];
  protocols: string[];
  contacts: Profile[];
  bots: Profile[];
}
export interface RefreshRequest {
  userid: string;
  token: string;
  command: WSRequest;
  data: LastRefresh;
}
export interface RefreshUpdate {
  data: RefreshData;
  update?: string;
  background?: boolean;
}
export interface RelatedUpdate {
  data: RelatedTopic[];
  update?: string;
  background?: boolean;
}
export interface SearchUpdate {
  data: SearchResult[];
  update?: string;
  background?: boolean;
}
export interface SuccessUpdate {
  data: string;
  update?: string;
  background?: boolean;
}
export interface ThreadData {
  chatInfo: ChatInfo;
  messages: Message[];
  perspectives: PerspectiveData[];
}
export interface ThreadRequest {
  userid: string;
  token: string;
  command: WSRequest;
  data: string;
}
export interface ThreadUpdate {
  data: ThreadData;
  update?: string;
  background?: boolean;
}
export interface User {
  userid: string;
  username: string;
  avatar: string;
  contacts: string[];
  bot: boolean;
  streaming?: boolean;
  plan?: string;
  readspeed?: number;
}
export interface UserRequest {
  userid: string;
  token: string;
  command: WSRequest;
  data: User;
}
export interface UserUpdate {
  data?: User;
  update?: string;
  background?: boolean;
}
