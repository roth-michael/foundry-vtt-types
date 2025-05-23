import type { Socket } from "socket.io-client";
import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * The Chat Bubble Class
   * This application displays a temporary message sent from a particular Token in the active Scene.
   * The message is displayed on the HUD layer just above the Token.
   */
  class ChatBubbles {
    constructor();

    /**
     * @defaultValue `"templates/hud/chat-bubble.html"`
     */
    template: string;

    /**
     * Track active Chat Bubbles
     * @defaultValue `{}`
     * @remarks This is never used
     */
    bubbles: object;

    /**
     * Track which Token was most recently panned to highlight
     * Use this to avoid repeat panning
     * @defaultValue `null`
     * @internal
     */
    protected _panned: Token.Implementation | null;

    /**
     * A reference to the chat bubbles HTML container in which rendered bubbles should live
     */
    get container(): JQuery;

    /**
     * Create a chat bubble message for a certain token which is synchronized for display across all connected clients.
     * @param token   - The speaking Token Document
     * @param message - The spoken message text
     * @param options - Options which affect the bubble appearance
     */
    broadcast(
      token: TokenDocument.Implementation,
      message: string,
      options: ChatBubbles.ChatBubbleOptions,
    ): Promise<JQuery | null>;

    /**
     * Speak a message as a particular Token, displaying it as a chat bubble
     * @param token   - The speaking Token
     * @param message - The spoken message text
     * @param emote   - Whether to style the speech bubble as an emote
     * @returns A Promise which resolves once the chat bubble has been created
     */
    say(token: Token.Implementation, message: string, { emote }?: { emote?: boolean }): Promise<void>;

    /**
     * Activate Socket event listeners which apply to the ChatBubbles UI.
     * @param socket - The active web socket connection
     */
    protected static _activateSocketListeners(socket: Socket): Promise<void>;

    /**
     * Clear any existing chat bubble for a certain Token
     * @internal
     */
    protected _clearBubble(token: Token.Implementation): Promise<void>;

    /**
     * Render the HTML template for the chat bubble
     * @param data - Template data
     * @returns The rendered HTML
     * @internal
     */
    protected _renderHTML(data: { token: Token.Implementation; message: string; emote: boolean }): Promise<string>;

    /**
     * Before displaying the chat message, determine it's constrained and unconstrained dimensions
     * @param message - The message content
     * @returns The rendered message dimensions
     * @internal
     */
    protected _getMessageDimensions(message: string): ChatBubbles.Dimensions;

    /**
     * Assign styling parameters to the chat bubble, toggling either a left or right display (randomly)
     * @internal
     */
    protected _setPosition(token: Token.Implementation, html: JQuery, dimensions: ChatBubbles.Dimensions): void;

    /**
     * Determine the length of time for which to display a chat bubble.
     * Research suggests that average reading speed is 200 words per minute.
     * Since these are short-form messages, we multiply reading speed by 1.5.
     * Clamp the result between 1 second (minimum) and 20 seconds (maximum)
     *
     * @param html - The HTML message
     * @returns The number of milliseconds for which to display the message
     */
    protected _getDuration(html: JQuery): number;
  }

  namespace ChatBubbles {
    interface Any extends AnyChatBubbles {}
    interface AnyConstructor extends Identity<typeof AnyChatBubbles> {}

    interface Dimensions {
      width: number;
      height: number;
      unconstrained: number;
    }

    interface ChatBubbleOptions {
      cssClasses?: string;
      pan: boolean;
      requireVisible: false;
    }
  }
}

declare abstract class AnyChatBubbles extends ChatBubbles {
  constructor(...args: never);
}
