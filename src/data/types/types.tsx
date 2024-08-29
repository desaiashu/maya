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
  | "slug"
  | "stop";
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
  | "slug";
export type SuccessCode =
  | "success"
  | "token sent"
  | "message sent"
  | "perspective requested"
  | "annotation requested"
  | "updated user"
  | "stream stopped";
export type ErrorCode = "error" | "verification failed" | "version outdated" | "command not found" | "chat not found";
export type SubscriptionPlan = "free" | "open" | "sota" | "extcontext";

export interface AnnotationRequest {
  userid: string;
  phone: string;
  token: string;
  version: string;
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
  phone: string;
  token: string;
  timestamp: number;
}
export interface ChatInfo {
  chatid: string;
  slug: string;
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
  update?: WSUpdate & string;
  background?: boolean;
}
export interface ChatRequest {
  userid: string;
  phone: string;
  token: string;
  version: string;
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
  update?: WSUpdate & string;
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
  update?: WSUpdate & string;
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
  data: UpdateInfo;
  update?: WSUpdate & string;
  background?: boolean;
}
export interface UpdateInfo {
  code: SuccessCode | ErrorCode | WSRequest | WSUpdate;
  info?: string;
}
export interface JsonableModel {}
export interface LastRefresh {
  time: number;
}
export interface MayaRequest {
  userid: string;
  phone: string;
  token: string;
  version: string;
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
  phone: string;
  token: string;
  version: string;
  command: WSRequest;
  data: Message;
}
export interface MessageUpdate {
  data: Message;
  update?: WSUpdate & string;
  background?: boolean;
}
export interface MongoModel {}
export interface PerspectiveData {
  chatid: string;
  messageid: number;
  lastupdated: number;
  confidence?: Confidence;
  related?: RelatedTopic[];
  search?: SearchResult[];
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
  phone: string;
  token: string;
  version: string;
  command: WSRequest;
  data: Message[];
}
export interface Quota {
  alltime?: number;
  monthly?: number;
  remaining?: number;
  reset?: number;
}
export interface RefreshData {
  chatlist: ChatInfo[];
  messages: Message[];
  protocols: string[];
  contacts: Profile[];
  bots: Profile[];
  perspectives: PerspectiveData[];
}
export interface RefreshRequest {
  userid: string;
  phone: string;
  token: string;
  version: string;
  command: WSRequest;
  data: LastRefresh;
}
export interface RefreshUpdate {
  data: RefreshData;
  update?: WSUpdate & string;
  background?: boolean;
}
export interface RelatedUpdate {
  data: RelatedTopic[];
  update?: WSUpdate & string;
  background?: boolean;
}
export interface SearchUpdate {
  data: SearchResult[];
  update?: WSUpdate & string;
  background?: boolean;
}
export interface SlugData {
  chatInfo: ChatInfo;
  messages: Message[];
  perspectives: PerspectiveData[];
}
export interface SlugRequest {
  userid: string;
  phone: string;
  token: string;
  version: string;
  command: WSRequest;
  data: string;
}
export interface SlugUpdate {
  data: SlugData;
  update?: WSUpdate & string;
  background?: boolean;
}
export interface StopRequest {
  userid: string;
  phone: string;
  token: string;
  version: string;
  command: WSRequest;
  data: Message;
}
export interface SuccessUpdate {
  data: UpdateInfo;
  update?: WSUpdate & string;
  background?: boolean;
}
export interface User {
  userid: string;
  username: string;
  avatar: string;
  contacts: string[];
  bot: boolean;
  streaming?: boolean;
  plan?: SubscriptionPlan & string;
  readspeed?: number;
  quota?: Quota;
  created?: number;
}
export interface UserRequest {
  userid: string;
  phone: string;
  token: string;
  version: string;
  command: WSRequest;
  data: User;
}
export interface UserUpdate {
  data?: User;
  update?: WSUpdate & string;
  background?: boolean;
}
