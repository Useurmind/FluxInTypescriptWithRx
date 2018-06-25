export interface ISiteNode {
    caption: string;
    type: SiteNodeType;
    relativeRoute?: string;
    route?: string;
    description?: string;
    imagePath?: string;
    subNodes?: ISiteNode[];
}

export enum SiteNodeType  {
    SiteNodeCollection,
    CustomComponent
}

export enum ViewMode {
    View,
    New,
    Edit,
}

export interface ISiteNodeCollection extends ISiteNode {
}

export interface ISiteNodePropsNoType {
    caption: string;
    relativeRoute?: string;
    route?: string;
    description?: string;
    imagePath?: string;
    subNodes?: ISiteNode[];
}

export interface ISiteNodeProps extends ISiteNodePropsNoType {
    type: SiteNodeType;
}

export class SiteNode implements ISiteNode {
    caption: string;
    type: SiteNodeType;
    relativeRoute?: string;
    route?: string;
    description?: string;
    imagePath?: string;
    subNodes?: ISiteNode[];

    constructor(props : ISiteNodeProps) {
        this.caption = props.caption;
        this.type = props.type;
        this.relativeRoute = props.relativeRoute;
        this.route = props.route;
        this.description = props.description;
        this.imagePath = props.imagePath;
        this.subNodes = props.subNodes;
    }
}

export interface ISiteNodeCollectionProps extends ISiteNodePropsNoType {
    subNodes: ISiteNode[];    
}
export class SiteNodeCollection extends SiteNode implements ISiteNodeCollection {
    subNodes: ISiteNode[];

    constructor(props: ISiteNodeCollectionProps) {
        super({
            caption: props.caption, 
            relativeRoute: props.relativeRoute,
            route: props.route,
            description: props.description,
            imagePath: props.imagePath,
            type: SiteNodeType.SiteNodeCollection,
            subNodes: props.subNodes
        });

        this.subNodes = props.subNodes;
    }
}
