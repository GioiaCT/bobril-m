import * as b from "bobril";
import * as m from "../index";
import * as Icon from "bobril-m-icons";
import { IconButton } from "./iconButton";

export interface ITableData {
    header?: {
        columns: ITableHeaderCellData[];
    };
    footer?: {
        pagination?: ITablePaginationData;
    };
    children?: b.IBobrilChildren | IRowsSettingsChildren;
    style?: b.IBobrilStyles;
    colSpan?: number;
    type?: CellType;
}

interface ITableCtx extends b.BobrilCtx<ITableData> {
    data: ITableData;
}

export const Table = b.createComponent<ITableData>({
    render(ctx: ITableCtx, me: b.IBobrilNode) {
        me.tag = "table";

        me.children = [
            ctx.data.header
                ? b.withKey(
                      TableHead({
                          children: ctx.data.header.columns.map((column) =>
                              TableHeaderCell({ children: column.children, sort: column.sort })
                          ),
                      }),
                      "tableHead"
                  )
                : undefined,
            isRowsSettingsChildren(ctx.data.children)
                ? b.withKey(
                      TableBody({
                          children: ctx.data.children.rows?.map((row) =>
                              TableRow({ children: row.cells?.map((cell) => TableCell({ children: cell.children })) })
                          ),
                      }),
                      "tableBody"
                  )
                : b.withKey(ctx.data.children, "children"),
            ctx.data.footer?.pagination
                ? b.withKey(TableFooter({ children: TablePagination(ctx.data.footer.pagination) }), "footer")
                : undefined,
        ];
        b.style(me, tableStyle, ctx.data.style);
    },
});

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

interface ITableHeaderCellData {
    sort?: { onChange(value: TableCellSortingType): void; direction?: TableCellSortingType; isActive?: boolean };
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

export type TableCellSortingType = "asc" | "desc";

interface IHeaderCellCtx extends b.BobrilCtx<ITableHeaderCellData> {
    active: boolean;
    defaultDirection: TableCellSortingType;
    data: ITableHeaderCellData;
}

interface ITableRowCtx extends b.BobrilCtx<ITableRowData> {
    data: ITableRowData;
    hover: boolean;
}

interface ITableSortData {
    children?: b.IBobrilChildren;
    direction: TableCellSortingType;
    style?: b.IBobrilStyles;
}

interface ITableSortCtx extends b.BobrilCtx<ITableSortData> {
    data: ITableSortData;
}

interface ITableCellCtx extends b.BobrilCtx<ITableCellData> {
    data: ITableCellData;
}

interface ITableCellData {
    children: b.IBobrilChildren;
    style?: b.IBobrilStyles;
    colSpan?: number;
    type?: CellType;
}

function backButtonAction(ctx: ITablePaginationCtx) {
    ctx.data.page(ctx.data.page() - 1);

    b.invalidate(ctx);
}

function nextButtonAction(ctx: ITablePaginationCtx) {
    ctx.data.page(ctx.data.page() + 1);

    b.invalidate(ctx);
}

export interface IRowsSettingsChildren {
    rows: {
        cells: ITableCellData[];
    }[];
}

function isRowsSettingsChildren(children: b.IBobrilChildren | IRowsSettingsChildren): children is IRowsSettingsChildren {
    return (children as any).rows !== undefined;
}

export const TableHead = b.createVirtualComponent({
    render(ctx: ITableCtx, me: b.IBobrilNode) {
        me.children = { tag: "thead", children: ctx.data.children };
        b.style(me.children, tableStyleBase, ctx.data.style);
    },
});

export const TableHeaderCell = b.createComponent<ITableHeaderCellData>({
    init(ctx: IHeaderCellCtx, _me: b.IBobrilCacheNode): void {
        ctx.active = false;
        ctx.defaultDirection = "asc";
    },
    render(ctx: IHeaderCellCtx, me: b.IBobrilNode) {
        me.tag = "th";
        me.attrs = { colSpan: ctx.data.colSpan };
        me.children = [
            ctx.data.sort !== undefined && (ctx.data.sort.isActive === undefined ? ctx.active : ctx.data.sort.isActive)
                ? TableHeaderSort({ direction: ctx.data.sort.direction || ctx.defaultDirection })
                : undefined,
            ctx.data.children,
        ];
        b.style(me, tableStyleBase, ctx.data.style);
    },
    onMouseDown(ctx: IHeaderCellCtx) {
        if (ctx.data.sort === undefined) {
            return;
        }

        if (!ctx.active) {
            ctx.active = true;
            ctx.data.sort.onChange(ctx.defaultDirection);
        } else {
            ctx.data.sort.onChange(toggleSort(ctx.data.sort.direction));
        }
        b.invalidate(ctx);
    },
});

function toggleSort(direction?: TableCellSortingType): TableCellSortingType {
    return direction === "desc" ? "asc" : "desc";
}

export const TableHeaderSort = b.createComponent<ITableSortData>({
    render(ctx: ITableSortCtx, me: b.IBobrilNode) {
        b.style(me, {
            cssFloat: "left",
        });
        me.children = {
            children: ctx.data.direction === "asc" ? Icon.navigationArrowUpward() : Icon.navigationArrowDownward(),
        };
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
    render(ctx: ITableCellCtx, me: b.IBobrilNode) {
        me.children = { tag: "td", attrs: { colSpan: ctx.data.colSpan }, children: ctx.data.children };
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
                    { cssFloat: "right", lineHeight: "48px" }
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

export function comparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator<Key extends keyof any>(
    order: TableCellSortingType,
    orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === "desc" ? (a, b) => comparator(a, b, orderBy) : (a, b) => -comparator(a, b, orderBy);
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
