import * as b from "bobril";
import * as m from "./index";
import { TableCellSortingType } from "./index";

interface Data {
    calories: number;
    carbs: number;
    fat: number;
    name: string;
    protein: number;
}

function createData(name: string, calories: number, fat: number, carbs: number, protein: number): Data {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Donut", 452, 25.0, 51, 4.9),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
    createData("Honeycomb", 408, 3.2, 87, 6.5),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Jelly Bean", 375, 0.0, 94, 0.0),
    createData("KitKat", 518, 26.0, 65, 7.0),
    createData("Lollipop", 392, 0.2, 98, 0.0),
    createData("Marshmallow", 318, 0, 81, 2.0),
    createData("Nougat", 360, 19.0, 9, 37.0),
    createData("Oreo", 437, 18.0, 63, 4.0),
];

const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Dessert (100g serving)" },
    { id: "calories", numeric: true, disablePadding: false, label: "Calories" },
    { id: "fat", numeric: true, disablePadding: false, label: "Fat (g)" },
    { id: "carbs", numeric: true, disablePadding: false, label: "Carbs (g)" },
    { id: "protein", numeric: true, disablePadding: false, label: "Protein (g)" },
];

let nameSortType: TableCellSortingType | undefined = undefined;
export function getTablePreview(): b.IBobrilChildren {
    return [
        m.Paper(
            { style: { margin: 16, padding: 8 } },
            m.Table({
                children: [
                    m.TableHead({
                        children: [
                            m.TableHeaderCell({ children: "Name" }),
                            m.TableHeaderCell({ children: "Link" }),
                            m.TableHeaderCell({ children: "Description" }),
                        ],
                    }),
                    m.TableBody({
                        children: [
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "typescript" }),
                                    m.TableCell({ children: "https://www.typescriptlang.org" }),
                                    m.TableCell({ children: "language" }),
                                ],
                            }),
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "git" }),
                                    m.TableCell({ children: "https://git-scm.com" }),
                                    m.TableCell({ children: "version control system" }),
                                ],
                            }),
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "tortoise git" }),
                                    m.TableCell({ children: "https://tortoisegit.org/" }),
                                    m.TableCell({ children: "Windows shell interface for Git" }),
                                ],
                            }),
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "fork" }),
                                    m.TableCell({ children: "https://git-fork.com" }),
                                    m.TableCell({ children: "Git client" }),
                                ],
                            }),
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "npm" }),
                                    m.TableCell({ children: "https://www.npmjs.com" }),
                                    m.TableCell({ children: "Package manager" }),
                                ],
                            }),
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "bobril" }),
                                    m.TableCell({ children: "https://github.com/Bobris/Bobril" }),
                                    m.TableCell({ children: "framework" }),
                                ],
                            }),
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "bobril-build" }),
                                    m.TableCell({ children: "https://github.com/Bobris/bobril-build" }),
                                    m.TableCell({ children: "tool to build bobril applications" }),
                                ],
                            }),
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "bobril-g11n" }),
                                    m.TableCell({ children: "https://github.com/Bobris/bobril-g11n" }),
                                    m.TableCell({ children: "bobril addon for globalization" }),
                                ],
                            }),
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "bobx" }),
                                    m.TableCell({ children: "https://github.com/bobril/bobx" }),
                                    m.TableCell({ children: "library for Bobril" }),
                                ],
                            }),
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "bobril-m" }),
                                    m.TableCell({ children: "https://github.com/bobril/bobril-m" }),
                                    m.TableCell({ children: "Bobril Material UI" }),
                                ],
                            }),
                            m.TableRow({
                                children: [
                                    m.TableCell({ children: "bobril-m-icons" }),
                                    m.TableCell({ children: "https://github.com/bobril/bobril-m-icons" }),
                                    m.TableCell({ children: "Bobril Material Icons" }),
                                ],
                            }),
                        ],
                    }),
                ],
            })
        ),
        m.Paper({ style: { margin: 16, padding: 8 } }, [
            m.Table({
                children: [
                    m.TableHead({
                        children: [
                            m.TableHeaderCell({
                                sort: {
                                    direction: nameSortType,
                                    onChange: (v) => {
                                        nameSortType = v;
                                        b.invalidate();
                                    },
                                },
                                children: ["Dessert (100g serving)"],
                            }),
                            m.TableHeaderCell({ children: "Calories" }),
                            m.TableHeaderCell({ children: "Fat (g)" }),
                            m.TableHeaderCell({ children: "Carbs (g)" }),
                            m.TableHeaderCell({ children: "Protein (g)" }),
                        ],
                    }),
                    rows.map((row) =>
                        m.TableRow({
                            children: [
                                { key: row.name },
                                m.TableCell({ children: row.name }),
                                m.TableCell({ children: row.calories }),
                                m.TableCell({ children: row.fat }),
                                m.TableCell({ children: row.carbs }),
                                m.TableCell({ children: row.protein }),
                            ],
                        })
                    ),
                    m.TableFooter({
                        children: m.TablePagination({
                            rowsPerPage: 3,
                            page: () => 0,
                            count: rows.length,
                            colSpan: 5,
                        }),
                    }),
                ],
            }),
        ]),
    ];
}
