interface BaseModel {
  at: number;

  /**
   * Small piece of text to highlight it
   */
  highlightText?: string;
  /**
   * The type of message. Default is info
   */
  type?: "info" | "okay" | "warning" | "error";
  message: string;
}

export default BaseModel;
