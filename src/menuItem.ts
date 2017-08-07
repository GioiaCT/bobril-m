import * as b from 'bobril';
import { ClickAwayListener } from './clickAwayListener';
import { ListItem } from './listItem';
import * as icons from "bobril-m-icons";
import { Menu } from './menu';
import { Popover } from './popover';
import { IPopoverOrigin } from './popoverOrigin';
import * as styles from './styles';

export const enum IFocusState {
    None,
    Focused,
    KeyboardFocused
}

export interface IMenuItemData {
    anchorOrigin?: IPopoverOrigin,
    animation?: b.IComponentFactory<b.IBobrilComponent>,
    checked?: boolean,
    children?: b.IBobrilChildren,
    desktop?: boolean,
    disabled?: boolean,
    innerDivStyle?: b.IBobrilStyleDef,
    insetChildren?: boolean,
    leftIcon?: (data: { color: string }) => b.IBobrilNode,
    menuItems?: b.IBobrilChildren,
    onTouchTap?: () => void,
    primaryText?: string,
    rightIcon?: (data: { color: string }) => b.IBobrilNode,
    secondaryText?: string,
    style?: b.IBobrilStyleDef,
    targetOrigin?: IPopoverOrigin
}

interface IMenuItemCtx extends b.IBobrilCtx {
    data: IMenuItemData;
    anchorNode: b.IBobrilCacheNode;
    open: boolean;
}

// have to be object instead of styleDef because of style overrides
const innerDivStyle = { paddingBottom: 0, paddingTop: 0 };

const rootStyle = b.styleDef({ whiteSpace: 'nowrap' });
const nestedMenuStyle = b.styleDef({ position: 'relative', zIndex: 1000 });
const secondaryTextStyle = b.styleDef({ cssFloat: 'right' });
const leftIconDesktopStyle = b.styleDef({ left: 24, top: 4 });
const rightIconDesktopStyle = b.styleDef({ right: 24, top: 4 });

function handleTouchTap(ctx: IMenuItemCtx, event) {
    if (!ctx.data.menuItems) {
        ctx.open = false;
        ctx.anchorNode = undefined;
    }
    else {
        ctx.open = !ctx.open;
    }

    b.invalidate(ctx);
    if (ctx.data.onTouchTap) ctx.data.onTouchTap();
};

function handleRequestClose(ctx: IMenuItemCtx) {
    ctx.open = false;
    ctx.anchorNode = undefined;
    b.invalidate(ctx);
};

export const MenuItem = b.createComponent<IMenuItemData>({
    init(ctx: IMenuItemCtx) {
        ctx.open = false;
    },
    render(ctx: IMenuItemCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        let leftIconElement
        if (d.leftIcon) {
            leftIconElement = d.leftIcon({ color: d.disabled ? styles.strDisabledColor : styles.strTextColor });
        } else if (d.checked) {
            leftIconElement = icons.navigationCheck();
        }

        if (leftIconElement)
            leftIconElement = b.styledDiv(<b.IBobrilNode>leftIconElement,
                leftIconDesktopStyle, { marginTop: d.desktop ? -8 : -4 });

        let rightIconElement;
        if (d.rightIcon)
            rightIconElement = b.styledDiv(d.rightIcon({ color: d.disabled ? styles.strDisabledColor : styles.strTextColor }),
                rightIconDesktopStyle, { marginTop: d.desktop ? -8 : -4 });

        let secondaryTextElement;
        if (d.secondaryText) secondaryTextElement = b.styledDiv(d.secondaryText, secondaryTextStyle);

        let childMenuPopover;
        if (d.menuItems) {
            childMenuPopover = Popover({
                autoCloseWhenOffScreen: true,
                animation: d.animation,
                anchorOrigin: d.anchorOrigin || { horizontal: 'right', vertical: 'top' },
                anchorNode: ctx.anchorNode,
                open: ctx.open,
                targetOrigin: d.targetOrigin || { horizontal: 'left', vertical: 'top' },
                onRequestClose: () => handleRequestClose(ctx)
            }, [
                    Menu({
                        desktop: d.desktop,
                        style: nestedMenuStyle
                    }, d.menuItems),
                    ClickAwayListener({
                        id: d.primaryText,
                        onClick: () => handleRequestClose(ctx)
                    }, undefined)
                ]
            );
        }

        const indent = d.desktop ? 64 : 72;
        const sidePadding = d.desktop ? 24 : 16;

        me.children = ListItem({
            action: () => handleTouchTap(ctx, undefined),
            primaryText: d.primaryText,
            disabled: d.disabled,
            innerDivStyle: [innerDivStyle, {
                paddingLeft: d.leftIcon || d.insetChildren || d.checked ? indent : sidePadding,
                paddingRight: d.rightIcon ? indent : sidePadding,
            }, d.innerDivStyle],
            insetChildren: d.insetChildren,
            leftIcon: () => leftIconElement,
            rightIcon: () => rightIconElement,
            style: [rootStyle, {
                color: d.disabled ? styles.strDisabledColor : styles.strTextColor,
                cursor: d.disabled ? 'default' : 'pointer',
                minHeight: d.desktop ? '32px' : '48px',
                lineHeight: d.desktop ? '32px' : '48px',
                fontSize: d.desktop ? 15 : 16
            }, d.style]
        }, [d.children, secondaryTextElement, childMenuPopover]);
    },
    postInitDom(ctx: IMenuItemCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.anchorNode = me;
    },
    postUpdateDom(ctx: IMenuItemCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.anchorNode = me;
    }
});
