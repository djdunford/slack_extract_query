export type Message = {
  type: string;
  subtype: string;
  text: string;
  file: unknown;
  user: string;
  upload: boolean;
  display_as_bot: boolean;
  username: string;
  bot_id: string | null;
  ts: string;

  comment: any;
}
