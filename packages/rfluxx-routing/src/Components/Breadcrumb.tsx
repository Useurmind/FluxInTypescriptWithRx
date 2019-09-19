// import createStyles from "@material-ui/styles/createStyles";
import { createStyles, withStyles, WithStyles } from "@material-ui/styles";
import { ClassKeyOfStyles } from "@material-ui/styles/withStyles";
import classnames from "classnames";
import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { RouterLink } from "../RouterLink";
import { getSiteMapNodeCaption, getSiteMapNodeSideBarUrl, ISiteMapNode } from "../SiteMap/ISiteMapNode";
import { ISiteMapStore, ISiteMapStoreState } from "../SiteMap/SiteMapStore";
import { IPageContextProps } from "../PageContext";

const styles = createStyles({
    root: {
        display: "flex",
        flexDirection: "row",
        padding: "5px"
    },
    item: {
        paddingRight: "5px"
    },
    activeItem: {
    },
    link: {
    },
    separator: {
        paddingLeft: "5px"
    }
});

export type StyleNames = Record<ClassKeyOfStyles<typeof styles>, string>;

/**
 * Props for { @see Breadcrumb }.
 */
export interface IBreadcrumbProps 
    extends IPageContextProps, WithStyles<typeof styles>
{
    /**
     * Function to create a separator, by default we take a /.
     */
    createSeparator?: (classes: StyleNames) => any;

    /**
     * The site map store that states the currently active site map node.
     * If the site map store is not given the breadcrumb will try to retrieve it from the container.
     */
    siteMapStore?: ISiteMapStore;

    /**
     * Render one node of the breadcrumb.
     * Either set this or renderLink to customize the render behaviour.
     * renderPart is more complex to implement than renderLink.
     */
    renderPart?: (node: ISiteMapNode, isLastItem: boolean, classes: StyleNames) => any;

    /**
     * Render only the link inside the breadcrumb node. Used in the default implementation of renderPart.
     * Either set this or renderLink to customize the render behaviour.
     * renderPart is more complex to implement than renderLink.
     */
    renderLink?: (caption: any, urlPath: string, classes: StyleNames) => any;
}

/**
 * State for { @see Breadcrumb }.
 */
export interface IBreadcrumbState
{
    /**
     * The path of site map nodes that leads to the currently active site map node (including it).
     */
    siteMapPath: ISiteMapNode[];
}

/**
 * The breadcrumb renders the path to the currently active site map node.
 */
export const Breadcrumb = withStyles(styles)(
class extends React.Component<IBreadcrumbProps, IBreadcrumbState>
{
    private subscription: StoreSubscription<ISiteMapStore, ISiteMapStoreState>
        = new StoreSubscription();

    constructor(props: IBreadcrumbProps)
    {
        super(props);

        this.state = {
            siteMapPath: []
        };
    }

    /**
     * @inheritDoc
     */
    public componentDidMount()
    {
        const store = this.props.siteMapStore
                        ? this.props.siteMapStore
                        : this.props.container.resolve<ISiteMapStore>("ISiteMapStore");

        if (!store)
        {
            throw Error("The site map store in the breadcrumb was neither given through the props"
                        + " nor was a container passed to the props.");
        }

        this.subscription.subscribeStore(
            store,
            x => this.setState({
                ...this.state,
                siteMapPath:  x.siteMapNodeHit ? x.siteMapNodeHit.siteMapPath : []}));
    }

    /**
     * @inheritDoc
     */
    public componentWillUnmount()
    {
        this.subscription.unsubscribe();
    }

    /**
     * @inheritDoc
     */
    public render(): any
    {
        const { classes, ...rest } = this.props;

        const createSeparator = this.props.createSeparator
                                    ? this.props.createSeparator
                                    : (classesParam: StyleNames) => <span className={classesParam.separator}>/</span>;

        const renderLink = this.props.renderLink
                                ? this.props.renderLink
                                : (caption: any,
                                   urlPath: string,
                                   classesParam: StyleNames) =>
                                {
                                    return <RouterLink caption={caption}
                                                       path={urlPath}
                                                       className={classesParam.link} />;
                                };

        const renderPart = this.props.renderPart
                                ? this.props.renderPart
                                : (sn: ISiteMapNode, isLastItem: boolean) =>
                                {
                                    const snClassName = classnames(classes.item, {
                                        [classes.activeItem]: isLastItem
                                    });

                                    const urlPath = getSiteMapNodeSideBarUrl(sn);
                                    const caption = getSiteMapNodeCaption(sn, this.props.routeParameters);

                                    return <div className={snClassName} key={sn.routeExpression}>
                                       { renderLink(caption, urlPath, classes) }
                                       { !isLastItem && <span className={classes.separator}>/</span> }
                                    </div>;
                                };

        return <nav aria-label="breadcrumb" className={classes.root}>
            {
                this.state.siteMapPath.length > 0 &&
                this.state.siteMapPath.map((sn, index) =>
                {
                    return renderPart(sn, index === (this.state.siteMapPath.length - 1), classes);
                })
            }
            {
                this.state.siteMapPath.length === 0 &&
                "404: not found"
            }
        </nav>;
    }
}
);
