import * as b from "bobril";
import * as m from "../index";
import { Button } from "./button";
import * as Icon from "bobril-m-icons";
import { IconButton } from "./iconButton";

/*
export * from "./tableHead"; done
export * from "./tableBody"; done
export * from "./tableRow"; done
export * from "./tableCell"; done
export * from "./tableHeaderCell"; done
export * from "./tableFooter";
export * from "./tablePagination";
*/
export const enum CellType {
    Number,
    String,
}

export interface ITableRowData {
    isEven?: boolean;
    isSelected?: boolean;
    children: b.IBobrilChildren;
    style?: b.IBobrilStyles;
}

interface ITableData {
    children: b.IBobrilChildren;
    style?: b.IBobrilStyles;
    colSpan?: number;
    type?: CellType;
}

interface ITableHeaderCellData {
    children: b.IBobrilChildren;
    style?: b.IBobrilStyles;
    colSpan?: number;
}

interface ITablePaginationData {
    children?: b.IBobrilChildren;
    style?: b.IBobrilStyles;
    rowsPerPage: number;
    page: Function;
    colSpan: number;
    count: number;
    onChangePage?: Function;
}

interface ITablePaginationCtx extends b.BobrilCtx<ITablePaginationData> {
    data: ITablePaginationData;
}

interface ITableCtx extends b.BobrilCtx<ITableData> {
    data: ITableData;
}

interface ICtx extends b.BobrilCtx<ITableHeaderCellData> {
    data: ITableHeaderCellData;
}

interface ITableRowCtx extends b.BobrilCtx<ITableRowData> {
    data: ITableRowData;
    hover: boolean;
}

function backButtonAction(ctx: ITablePaginationCtx) {
    ctx.data.page(ctx.data.page() - 1);

    b.invalidate(ctx);
}

function nextButtonAction(ctx: ITablePaginationCtx) {
    ctx.data.page(ctx.data.page() + 1);

    b.invalidate(ctx);
}

export const Table = b.createComponent({
    render(ctx: ITableCtx, me: b.IBobrilNode) {
        me.tag = "table";
        me.children = ctx.data.children;
        b.style(me, tableStyle, ctx.data.style);
    },
});

export const TableHead = b.createVirtualComponent({
    render(ctx: ITableCtx, me: b.IBobrilNode) {
        me.children = { tag: "thead", children: ctx.data.children };
        b.style(me.children, tableStyleBase, ctx.data.style);
    },
});

export const TableHeaderCell = b.createComponent<ITableHeaderCellData>({
    render(ctx: ICtx, me: b.IBobrilNode) {
        me.tag = "th";
        me.children = { attrs: { colSpan: ctx.data.colSpan }, children: ctx.data.children };
        b.style(me, tableStyleBase, ctx.data.style);
    },
});

export const TableBody = b.createVirtualComponent({
    render(ctx: ITableCtx, me: b.IBobrilNode) {
        me.children = { tag: "tbody", children: ctx.data.children };
        b.style(me.children, tableStyleBase, ctx.data.style);
    },
});

export const TableRow = b.createComponent({
    render(ctx: ITableRowCtx, me: b.IBobrilNode) {
        let showHover = ctx.hover;
        b.style(me, tableRowStyle, ctx.data.isEven && evenTableRowStyle, ctx.data.style, {
            backgroundColor: showHover ? m.hoverColor : ctx.data.isSelected ? selectedTableRowStyle : undefined,
        });
        me.tag = "tr";
        me.children = ctx.data.children;
    },
    onMouseEnter(ctx: ITableRowCtx) {
        ctx.hover = true;
        b.invalidate(ctx);
    },
    onMouseLeave(ctx: ITableRowCtx) {
        ctx.hover = false;
        b.invalidate(ctx);
    },
});

export const TableCell = b.createVirtualComponent({
    render(ctx: ITableCtx, me: b.IBobrilNode) {
        me.children = { tag: "td", attrs: { colSpan: ctx.data.colSpan }, children: ctx.data.children }; //TODO: change first tag to hyperlink tag
        b.style(me.children, tableStyleBase, ctx.data.style, ctx.data.type === CellType.Number && numberTypeStyle);
    },
});

export const TableFooter = b.createVirtualComponent({
    render(ctx: ITableCtx, me: b.IBobrilNode) {
        me.children = { tag: "tfoot", children: ctx.data.children };
        b.style(me.children, tableStyleBase, ctx.data.style);
    },
});

export const TablePagination = b.createVirtualComponent<ITablePaginationData>({
    render(ctx: ITablePaginationCtx, me: b.IBobrilNode) {
        const lastPage: number = (ctx.data.page() + 1) * ctx.data.rowsPerPage;
        me.children = TableCell({
            children: [
                b.styledDiv(IconButton({ action: () => nextButtonAction(ctx) }, Icon.hardwareKeyboardArrowRight()), {
                    cssFloat: "right",
                }),
                b.styledDiv(IconButton({ action: () => backButtonAction(ctx) }, Icon.hardwareKeyboardArrowLeft()), {
                    cssFloat: "right",
                }),
                b.styledDiv(
                    [
                        ctx.data.page() * ctx.data.rowsPerPage + 1,
                        " - ", //g.t(" - "),
                        lastPage > ctx.data.count ? ctx.data.count : lastPage,
                        " of: ",
                        ctx.data.count,
                    ],
                    { cssFloat: "right", marginTop: 12 }
                ),

                /*
                    IconButton({ action: () => backButtonAction(ctx) }, Icon.hardwareKeyboardArrowLeft()),
                    IconButton({ action: () => backButtonAction(ctx) }, Icon.hardwareKeyboardArrowRight()),
                    Button({ action: () => nextButtonAction(ctx) }, Icon.hardwareKeyboardArrowRight())
                    */
            ],
            colSpan: ctx.data.colSpan,
            style: [tableStylePagination, ctx.data.style],
        });
    },
});

const tableRowStyle = b.styleDef({
    color: "inherit",
    display: "table-row",
    height: 48,
});

const evenTableRowStyle = b.styleDef({
    backgroundColor: m.clockCircleColor,
});

const selectedTableRowStyle = b.styleDef({
    backgroundColor: m.selectColor,
});

const tableStyleBase = b.styleDef({
    borderBottom: "1px solid",
    borderColor: m.borderColor,
    textAlign: "left",
    borderCollapse: "collapse",
    borderSpacing: 0,
    overflow: "hidden",
});

const tableStyle = b.styleDef([
    tableStyleBase,
    {
        width: "100%",
    },
]);

const tableStylePagination = b.styleDef([
    tableStyleBase,
    {
        textAlign: "right",
        verticalAlign: "middle",
    },
]);

const numberTypeStyle = b.styleDef({
    textAlign: "right",
    flexDirection: "row-reverse",
});
