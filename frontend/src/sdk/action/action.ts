import { EraseLayersAction } from "./erase-layers-aciton";
import { GotoAndPlayAction } from "./goto-and-play-action";
import { PlayAction } from "./play-action";
import { SetTextValueAction } from "./set-text-value-action";
import { StopAction } from "./stop-action";

export type Action = EraseLayersAction | GotoAndPlayAction | PlayAction | StopAction | SetTextValueAction;
