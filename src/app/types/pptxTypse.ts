interface SlideNode {
  "p:txBody"?: {
    "a:p"?: {
      "a:r"?: {
        "a:t"?: string[];
      }[];
    }[];
  }[];
}

interface SlideTree {
  "p:sp"?: SlideNode[];
}

interface SlideContent {
  "p:sld"?: {
    "p:cSld"?: {
      "p:spTree"?: SlideTree[];
    }[];
  };
}

export type{SlideContent, SlideNode, SlideTree};